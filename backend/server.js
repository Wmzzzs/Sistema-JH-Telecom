const express = require('express');
const app = express();

// ✅ CORS - Middleware MELHORADO
app.use((req, res, next) => {
  // Permitir qualquer origem
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Responder imediatamente a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight request autorizado');
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authRoutes = require('./src/routes/authRoutes');

// ✅ Rota de teste para verificar se o servidor está respondendo
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando!', timestamp: new Date() });
});

app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ⚠️ IMPORTANTE: Deve estar na porta 5000 para o frontend funcionar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em http://localhost:${PORT}\n`);
});