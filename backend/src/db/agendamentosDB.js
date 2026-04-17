const db = require('./database');

// Salvar agendamento
function salvarAgendamento(dados, callback = () => {}) {
  const sql = `
    INSERT OR REPLACE INTO agendamentos 
    (os, contrato, cliente, contato, data_agendamento, hora, responsavel, observacoes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [
    dados.os,
    dados.contrato,
    dados.cliente,
    dados.contato,
    dados.data_agendamento,
    dados.hora,
    dados.responsavel,
    dados.observacoes,
    'agendado'
  ], function(err) {
    if (err) {
      console.error('Erro ao salvar agendamento:', err.message);
      callback({ success: false, error: err.message });
    } else {
      callback({ success: true, id: this.lastID });
    }
  });
}

// Listar agendamentos com filtros
function listarAgendamentos(filtros = {}, callback) {
  let query = 'SELECT * FROM agendamentos WHERE 1=1';
  const params = [];
  
  if (filtros.responsavel) {
    query += ' AND responsavel = ?';
    params.push(filtros.responsavel);
  }
  
  if (filtros.data_inicio && filtros.data_fim) {
    query += ' AND DATE(data_agendamento) BETWEEN DATE(?) AND DATE(?)';
    params.push(filtros.data_inicio, filtros.data_fim);
  }
  
  if (filtros.status) {
    query += ' AND status = ?';
    params.push(filtros.status);
  }
  
  if (filtros.cliente) {
    query += ' AND cliente LIKE ?';
    params.push(`%${filtros.cliente}%`);
  }
  
  query += ' ORDER BY data_agendamento DESC, hora DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Erro ao listar agendamentos:', err.message);
      callback([]);
    } else {
      callback(rows || []);
    }
  });
}

// Buscar agendamento por OS (com callback)
function buscarAgendamentoPorOS(os, callback) {
  const sql = 'SELECT * FROM agendamentos WHERE os = ?';
  db.get(sql, [os], (err, row) => {
    if (err) {
      console.error('Erro ao buscar agendamento:', err.message);
      callback(null);
    } else {
      callback(row);
    }
  });
}

// Atualizar agendamento
function atualizarAgendamento(os, dados, callback = () => {}) {
  const sql = `
    UPDATE agendamentos 
    SET data_agendamento = ?, hora = ?, responsavel = ?, observacoes = ?, status = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE os = ?
  `;
  
  db.run(sql, [
    dados.data_agendamento,
    dados.hora,
    dados.responsavel,
    dados.observacoes,
    dados.status || 'agendado',
    os
  ], function(err) {
    if (err) {
      console.error('Erro ao atualizar agendamento:', err.message);
      callback({ success: false, error: err.message });
    } else {
      callback({ success: this.changes > 0 });
    }
  });
}

// Deletar agendamento
function deletarAgendamento(os, callback = () => {}) {
  const sql = 'DELETE FROM agendamentos WHERE os = ?';
  db.run(sql, [os], function(err) {
    if (err) {
      console.error('Erro ao deletar agendamento:', err.message);
      callback({ success: false, error: err.message });
    } else {
      callback({ success: this.changes > 0 });
    }
  });
}

// Contar agendamentos
function contarAgendamentos(filtros = {}, callback) {
  let query = 'SELECT COUNT(*) as total FROM agendamentos WHERE 1=1';
  const params = [];
  
  if (filtros.responsavel) {
    query += ' AND responsavel = ?';
    params.push(filtros.responsavel);
  }
  
  if (filtros.data_inicio && filtros.data_fim) {
    query += ' AND DATE(data_agendamento) BETWEEN DATE(?) AND DATE(?)';
    params.push(filtros.data_inicio, filtros.data_fim);
  }
  
  db.get(query, params, (err, result) => {
    if (err) {
      console.error('Erro ao contar agendamentos:', err.message);
      callback(0);
    } else {
      callback(result?.total || 0);
    }
  });
}

module.exports = {
  salvarAgendamento,
  listarAgendamentos,
  buscarAgendamentoPorOS,
  atualizarAgendamento,
  deletarAgendamento,
  contarAgendamentos
};
