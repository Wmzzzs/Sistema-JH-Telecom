const users = require('../data/users');

// 🔐 LOGIN com Email e Senha
exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Buscar usuário por email
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  // Validar senha (comparação simples - em produção usar bcrypt)
  if (user.senha !== senha) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  // ✅ Marcar usuário como online ao fazer login
  user.online = true;

  res.json({
    message: 'Login realizado com sucesso',
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      online: user.online
    }
  });
};

// 📋 LISTAR USUÁRIOS
exports.getUsers = (req, res) => {
  const result = users.map(({ id, nome, email, role, online }) => ({
    id, nome, email, role, online
  }));
  res.json(result);
};

// 🚪 LOGOUT - Marcar usuário como offline
exports.logout = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID do usuário é obrigatório' });
  }

  const user = users.find(u => u.id == id);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  // ✅ Marcar usuário como offline ao fazer logout
  user.online = false;

  res.json({
    message: `Usuário ${user.nome} desconectado com sucesso`
  });
};