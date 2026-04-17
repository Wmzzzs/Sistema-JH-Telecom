const express = require('express');
const app = express();

// ✅ CORS - Middleware MELHORADO
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

try {
  const orderRoutes = require('./src/routes/orderRoutes');
  const adminRoutes = require('./src/routes/adminRoutes');
  const authRoutes = require('./src/routes/authRoutes');

  // ✅ Rota de teste
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend funcionando!', timestamp: new Date() });
  });

  app.use('/orders', orderRoutes);
  app.use('/admin', adminRoutes);
  app.use('/auth', authRoutes);
} catch (error) {
  console.error('❌ Erro ao carregar rotas:', error.message);
}

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor', message: err.message });
});

// Para desenvolvimento local
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n✅ Servidor rodando em http://localhost:${PORT}\n`);
  });
}

// Exportar para Vercel
module.exports = app;
