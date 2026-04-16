const express = require('express');
const router = express.Router();

const { 
  importExcel, 
  getOrders, 
  importFinalizados, 
  getOrdersData, 
  agendar, 
  getAgendamentos,
  getTiposServico,
  setAtendentePorServico,
  getAtendentePorServico,
  getMinhasOrdens
} = require('../controllers/orderController');

// GET
router.get('/', getOrders);
router.get('/agendamentos', getAgendamentos);
router.get('/tipos-servico', getTiposServico);
router.get('/atendente-servico', getAtendentePorServico);
router.get('/minhas-ordens', getMinhasOrdens);

// POST - Importação
router.post('/import-excel', importExcel);
router.post('/import-finalizados', importFinalizados);

// POST - Agendamento
router.post('/agendar', agendar);

// POST - Configuração (Admin)
router.post('/atendente-servico', setAtendentePorServico);

module.exports = router;