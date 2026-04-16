# 📡 JH Telecom - Sistema de Gestão de Ordens

Sistema completo de gestão de ordens de serviço para empresas de telecomunicações, desenvolvido com **Express.js** no backend e **HTML5/CSS3/JavaScript** no frontend.

---

## 🎯 Funcionalidades Principais

✅ **Autenticação** - Login seguro com email e senha  
✅ **Dashboard** - Estatísticas em tempo real de ordens  
✅ **Gestão de Ordens** - Listagem, filtros avançados e paginação  
✅ **Usuários** - Ver status online/offline de atendentes  
✅ **Administração** - Importar dados e distribuir ordens  
✅ **Responsividade** - Design adaptável para mobile e desktop  

---

## 🚀 Como Começar

### Pré-requisitos

- **Node.js** (v14+) - [Download aqui](https://nodejs.org/)
- **npm** (vem com Node.js)
- Um navegador moderno (Chrome, Firefox, Safari, Edge)

### 1️⃣ Instalação das Dependências

```bash
cd backend
npm install
```

### 2️⃣ Iniciar o Backend

```bash
cd backend
node server.js
```

Você verá:
```
✅ Servidor rodando em http://localhost:5000
```

### 3️⃣ Iniciar o Frontend

Em **outro terminal**:

```bash
cd frontend
node server.js
```

Você verá:
```
✅ Frontend rodando em http://localhost:8000
📂 Servindo arquivos de: .../frontend
```

### 4️⃣ Abrir no Navegador

Abra seu navegador e acesse:

```
http://localhost:8000
```

---

## 👤 Usuários de Teste

| Email | Senha | Nome | Tipo | Status Inicial |
|-------|-------|------|------|---|
| admin@jhtelecom.com | admin123 | Admin | Admin | ❌ Offline |
| joao@jhtelecom.com | joao123 | João | Atendente | ❌ Offline |
| maria@jhtelecom.com | maria123 | Maria | Atendente | ❌ Offline |
| carlos@jhtelecom.com | carlos123 | Carlos | Atendente | ❌ Offline |

**Ao fazer login:** o usuário passa para ✅ **Online**  
**Ao fazer logout:** o usuário volta para ❌ **Offline**

---

## 📋 Estrutura do Projeto

```
Sistema_JH_Telecom/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica das rotas
│   │   ├── routes/          # Definição das rotas API
│   │   ├── data/            # Dados em memória (usuários)
│   │   └── models/          # Modelos (futuros)
│   ├── package.json
│   └── server.js            # Servidor Express
│
├── frontend/
│   ├── index.html           # Página principal
│   ├── app.js               # Lógica JavaScript
│   ├── styles.css           # Estilos CSS
│   └── server.js            # Servidor do frontend
│
├── prisma/                  # Configuração Prisma (futura)
├── README.md                # Este arquivo
└── SETUP.md                 # Guia de configuração adicional
```

---

## 🔌 Endpoints da API

### Autenticação
- `POST /auth/login` - Fazer login
- `POST /auth/logout` - Fazer logout (marca como offline)
- `GET /auth/users` - Listar todos os usuários

### Ordens
- `GET /orders` - Listar ordens com filtros
- `POST /orders/import-excel` - Importar backlog de ordens
- `POST /orders/import-finalizados` - Importar ordens finalizadas
- `GET /orders/agendamentos` - Listar agendamentos
- `POST /orders/agendar` - Criar novo agendamento
- `GET /orders/tipos-servico` - Listar tipos de serviço
- `GET /orders/atendente-servico` - Obter configuração de atendentes por serviço
- `POST /orders/atendente-servico` - Configurar atendentes por serviço

### Admin
- `GET /admin/dashboard` - Dados do dashboard
- `POST /admin/distribuir` - Distribuir ordens entre atendentes
- `PUT /admin/online` - Alterar status online/offline de um usuário

---

## 🎨 Páginas Disponíveis

### 1. **Login** (Bem-vindo)
- Email e Senha
- Validação de credenciais
- Redirecionamento automático após login

### 2. **Dashboard**
- Estatísticas de ordens
- Total, Pendentes, Finalizadas, Atrasadas
- Ordens por atendente

### 3. **Ordens**
- Lista completa de ordens
- Filtros: Status, Responsável, Fila, Prioridade, Bairro
- Paginação (10 itens por página)
- Ações: Editar, Finalizar, Cancelar

### 4. **Usuários**
- Lista de atendentes
- Status online/offline
- Alterar disponibilidade do usuário

### 5. **Administração** (Apenas Admin)
- Importar backlog de ordens
- Importar ordens finalizadas
- Distribuir ordens entre atendentes (round-robin)
- Configurar atendentes por tipo de serviço

---

## 🔐 Fluxo de Autenticação

```
1. Usuário digita email e senha
   ↓
2. Frontend envia para POST /auth/login
   ↓
3. Backend valida credenciais
   ↓
4. Backend marca usuário como online
   ↓
5. Frontend armazena user no localStorage
   ↓
6. Mostra Dashboard (navbar fica visível)
   ↓
7. Ao fazer Logout: marca como offline e limpa localStorage
```

---

## 💾 Status Online/Offline

- **Ao iniciar:** Todos começa **offline** (❌)
- **Ao fazer login:** Usuário fica **online** (✅)
- **Ao fazer logout:** Usuário volta para **offline** (❌)
- **Recarga da página:** Status é mantido se user estiver no localStorage

---

## 🐛 Troubleshooting

### Erro: "Erro ao conectar com o servidor"
- Verifique se o backend está rodando em `http://localhost:5000`
- Verifique se a porta 5000 não está ocupada
- Confirme que o comando `node server.js` foi executado no backend

### Dados não carregam
- Abra o console do navegador (F12)
- Verifique se há erros de conexão
- Recarregue a página (Ctrl+F5)

### Navbar aparecendo mesmo após logout
- Recarregue a página (F5)
- Limpe o cache (Ctrl+Shift+Delete)

### Usuário continua online após logout
- Reinicie o backend (`node server.js`)
- O status é armazenado em memória, então reinicia o servidor reseta tudo

---

## 📱 Tecnologias Utilizadas

**Backend:**
- Node.js + Express.js
- JavaScript (ES6+)
- CORS habilitado para desenvolvimento
- Dados em memória (futuramente: Prisma + PostgreSQL)

**Frontend:**
- HTML5 semântico
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript vanilla (sem dependências)
- LocalStorage para sessão
- Fetch API para requisições

---

## ⚙️ Próximas Implementações

- [ ] Banco de dados com Prisma (PostgreSQL/MySQL)
- [ ] Autenticação JWT
- [ ] Hash de senhas com bcrypt
- [ ] Validação com Zod/Joi
- [ ] Testes automatizados (Jest)
- [ ] Deploy em produção (Render/Vercel)
- [ ] Notificações em tempo real (WebSocket)
- [ ] Relatórios em PDF

---

## 📝 Notas Importantes

⚠️ **Dados em Memória:** O sistema armazena tudo em memória JavaScript. Ao reiniciar o servidor, todos os dados são perdidos.

💡 **Desenvolvimento:** Este é um sistema de demonstração/desenvolvimento. Para produção, use um banco de dados real e autenticação JWT.

🔒 **Segurança:** As senhas são armazenadas em plain text neste momento. Em produção, usar bcrypt.

---

## 👨‍💻 Desenvolvido por

**JH Telecom** - Sistema de Gestão de Ordens  
Versão: **1.0.0**  
Data: Abril de 2026

---

## 📄 Licença

ISC

---

**🎉 Pronto para começar! Dúvidas? Abra um issue ou Entre em contato.**
