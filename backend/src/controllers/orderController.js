const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { differenceInDays } = require('date-fns');

let orders = [];
let atendentePorServico = {}; // { tipo_servico: ['João', 'Maria'] }

// 🔁 Converter data serial do Excel para JS
function excelDateToJSDate(serial) {
  const excelEpoch = new Date(1899, 11, 30);
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

// 🔁 Mapear status do CSV de finalizados para o padrão do sistema
function mapearStatusFinalizados(statusCSV) {
  const map = {
    'concluído':     'finalizado',
    'cancelado':     'cancelado',
    'não concluído': 'nao_concluido',
    'suspenso':      'suspenso',
    'pendente':      'pendente'
  };
  return map[statusCSV?.toLowerCase?.().trim()] || 'pendente';
}

// 📥 IMPORTAR BACKLOG
exports.importExcel = (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../files/backlog.xlsx');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo backlog.xlsx não encontrado' });
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ error: 'Planilha vazia ou sem dados válidos' });
    }

    orders = data.map(item => {
      const dataBase = excelDateToJSDate(item.DATA_AGENDAMENTO);
      const dias = differenceInDays(new Date(), dataBase);

      let status = 'pendente';
      if (dias > 7) status = 'atrasado';

      return {
        cliente:          item.CLIENTE,
        contato:          item.CONTATO,
        fila:             item.FILA,
        tipo_servico:     item.FILA || 'Geral', // Usar fila como tipo de serviço
        bairro:           item.BAIRRO,
        contrato:         item.CODIGO_CONTRATO,
        os:               item.NUMERO_DA_OS,
        unidade:          item.UNIDADE || null,
        territorio:       item['TERRITÓRIO SP'] || null,
        grupo_regiao:     item['GRUPO DE REGIÕES'] || null,
        // ✅ PRIORIDADE agora mapeada (ex: "PRIOR_NCA", "PRIOR_RETENCAO")
        prioridade:       item.PRIORIDADE || null,
        data_base:        dataBase,
        data_ingresso:    item.DATA_DE_INGRESSO ? excelDateToJSDate(item.DATA_DE_INGRESSO) : null,
        dias_em_aberto:   dias,
        status,
        responsavel:      null,
        motivo_conclusao: null
      };
    });

    res.json({
      message: 'Backlog importado com sucesso',
      total: orders.length,
      preview: orders.slice(0, 10)
    });

  } catch (error) {
    console.error('Erro ao importar backlog:', error);
    res.status(500).json({ error: 'Erro ao importar backlog' });
  }
};

// 📋 LISTAR ORDENS (com filtros)
exports.getOrders = (req, res) => {
  const { status, responsavel, fila, prioridade, bairro } = req.query;

  let filtered = orders;

  if (status)      filtered = filtered.filter(o => o.status === status);
  if (responsavel) filtered = filtered.filter(o => o.responsavel === responsavel);
  if (fila)        filtered = filtered.filter(o => o.fila === fila);
  if (prioridade)  filtered = filtered.filter(o => o.prioridade === prioridade);
  if (bairro)      filtered = filtered.filter(o => o.bairro === bairro);

  res.json(filtered);
};

// 🔄 IMPORTAR FINALIZADOS
exports.importFinalizados = (req, res) => {
  const filePath = path.join(__dirname, '../../files/finalizados.csv');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo finalizados.csv não encontrado' });
  }

  const resultados = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => resultados.push(data))
    .on('error', (error) => {
      console.error('Erro ao ler CSV:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro ao ler arquivo CSV' });
      }
    })
    .on('end', () => {
      // ✅ Coluna correta do CSV: "Ordem de Serviço" (antes estava "NUMERO_DA_OS" — bug)
      // ✅ Cada OS agora recebe o status real (concluído, cancelado, suspenso, etc.)
      const mapaFinalizados = {};
      resultados.forEach(item => {
        const os = Number(item['Ordem de Serviço']);
        if (!isNaN(os)) {
          mapaFinalizados[os] = {
            status:  mapearStatusFinalizados(item['Status da Atividade']),
            motivo:  item['Motivo de Encerramento das atividades'] || null,
            recurso: item['Recurso'] || null
          };
        }
      });

      let atualizadas = 0;

      orders = orders.map(order => {
        const match = mapaFinalizados[Number(order.os)];
        if (match) {
          atualizadas++;
          return {
            ...order,
            status:           match.status,
            motivo_conclusao: match.motivo,
            // ✅ Vincula o recurso do CSV como responsável se ainda não tiver
            responsavel:      order.responsavel || match.recurso
          };
        }
        return order;
      });

      // Resumo por status para facilitar conferência
      const resumoStatus = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {});

      res.json({
        message:      'Finalizados atualizados com sucesso',
        atualizadas,
        totalCSV:     resultados.length,
        resumoStatus
      });
    });
};

// 📤 EXPORTAR ORDERS (uso interno)
exports.getOrdersData = () => orders;

// 📅 AGENDAR ORDEM (Atendente)
exports.agendar = (req, res) => {
  const { os, data_agendamento, hora, observacoes } = req.body;

  if (!os || !data_agendamento || !hora) {
    return res.status(400).json({ error: 'OS, data e hora são obrigatórios' });
  }

  // Buscar ordem
  const order = orders.find(o => Number(o.os) === Number(os));

  if (!order) {
    return res.status(404).json({ error: 'Ordem não encontrada' });
  }

  // Adicionar informações de agendamento
  order.data_agendamento_confirmada = data_agendamento;
  order.hora_agendamento = hora;
  order.observacoes_agendamento = observacoes || null;
  order.status_agendamento = 'agendado';

  res.json({
    message: 'Ordem agendada com sucesso',
    order: {
      os: order.os,
      cliente: order.cliente,
      data_agendamento: data_agendamento,
      hora: hora,
      responsavel: order.responsavel
    }
  });
};

// 📋 LISTAR AGENDAMENTOS
exports.getAgendamentos = (req, res) => {
  const { atendente } = req.query;
  
  let agendamentos = orders
    .filter(o => o.status_agendamento === 'agendado')
    .map(o => ({
      os: o.os,
      contrato: o.contrato,
      cliente: o.cliente,
      contato: o.contato,
      data_agendamento: o.data_agendamento_confirmada,
      hora: o.hora_agendamento,
      responsavel: o.responsavel,
      observacoes: o.observacoes_agendamento,
      status: o.status
    }));
  
  // Se foi enviado um atendente (atendentes veem apenas seus), filtrar
  if (atendente) {
    agendamentos = agendamentos.filter(a => a.responsavel === atendente);
  }

  res.json(agendamentos);
};

// 🔧 EXTRAIR TIPOS DE SERVIÇO ÚNICOS (para admin configurar)
exports.getTiposServico = (req, res) => {
  const tipos = [...new Set(orders.map(o => o.tipo_servico || o.fila).filter(t => t))];
  res.json(tipos);
};

// ⚙️ ADMIN: SETAR ATENDENTES POR TIPO DE SERVIÇO
exports.setAtendentePorServico = (req, res) => {
  const { mapeamento } = req.body; // { tipo_servico: [atendentes] }
  atendentePorServico = mapeamento;
  distribuirOrdens(); // Redistribuir após mudança
  res.json({ 
    message: 'Mapeamento atualizado e ordens redistribuídas',
    mapeamento: atendentePorServico,
    totalOrdensDist: orders.filter(o => o.responsavel).length
  });
};

// ⚙️ ADMIN: OBTER MAPEAMENTO ATUAL
exports.getAtendentePorServico = (req, res) => {
  res.json(atendentePorServico);
};

// 🔄 DISTRIBUIR ORDENS POR TIPO DE SERVIÇO E ATENDENTE (round-robin)
function distribuirOrdens() {
  // Reset responsável para ordens pendentes
  orders.forEach(o => {
    if (o.status_agendamento !== 'cancelado' && !o.status_cancelado) {
      o.responsavel = null;
    }
  });
  
  // Agrupar por tipo de serviço
  const ordensPorServico = {};
  orders.forEach(ordem => {
    const tipo = ordem.tipo_servico || ordem.fila || 'Indefinido';
    if (!ordensPorServico[tipo]) {
      ordensPorServico[tipo] = [];
    }
    // Somente ordens não canceladas/finalizadas
    if (!ordem.status_cancelado && ordem.status_agendamento !== 'cancelado') {
      ordensPorServico[tipo].push(ordem);
    }
  });

  // Para cada tipo de serviço, distribuir entre atendentes (round-robin)
  Object.keys(ordensPorServico).forEach(tipo => {
    const atendentes = atendentePorServico[tipo] || [];
    if (atendentes.length === 0) return;

    const ordensDoTipo = ordensPorServico[tipo];
    let indiceAtendente = 0;

    ordensDoTipo.forEach((ordem) => {
      ordem.responsavel = atendentes[indiceAtendente % atendentes.length];
      indiceAtendente++;
    });
  });
}

// 👤 ATENDENTE: OBTER PRÓPRIAS ORDENS (sem canceladas/finalizadas)
exports.getMinhasOrdens = (req, res) => {
  const { atendente } = req.query;
  
  if (!atendente) {
    return res.json([]);
  }

  const minhasOrdens = orders.filter(o => {
    const ehResponsavel = o.responsavel === atendente;
    const naoCancelada = !o.status_cancelado && o.status_agendamento !== 'cancelado';
    const naoFinalizada = o.status !== 'finalizado';
    
    return ehResponsavel && naoCancelada && naoFinalizada;
  });

  res.json(minhasOrdens);
};