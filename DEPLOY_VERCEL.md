# 🚀 Guia de Deploy no Vercel

## **IMPORTANTE: Leia antes de começar!**

Você precisa fazer o Deploy em DUAS ETAPAS:
1. **Backend** no Vercel
2. **Frontend** no Vercel

---

## **ETAPA 1: Deploy do Backend**

### **1.1 Criar repositório GitHub para o Backend**

```powershell
# Acesse a pasta backend
cd backend

# Iniciar git
git init
git add .
git commit -m "Backend inicial"
git branch -M main

# Criar repositório vazio no GitHub e fazer push
# Substitua SEU_USUARIO pelo seu usuário GitHub
git remote add origin https://github.com/SEU_USUARIO/sistema-jh-telecom-backend.git
git push -u origin main
```

### **1.2 Deploy no Vercel**

1. Acesse [https://vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**
4. Selecione o repositório `sistema-jh-telecom-backend`
5. Configure:
   - **Root Directory:** `.` (raiz)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Output Directory:** `.`
6. Clique em **"Deploy"**

### **1.3 Copiar URL do Backend Deployado**

Após o deploy, você receberá uma URL como:
```
https://sistema-jh-telecom-backend.vercel.app
```

**GUARDE ESSA URL!** Você precisará dela no frontend.

---

## **ETAPA 2: Deploy do Frontend**

### **2.1 Atualizar URL do Backend no Frontend**

Abra `frontend/app.js` e atualize a linha:

```javascript
const API_BASE = isProduction 
  ? 'https://SEU-BACKEND-URL-AQUI.vercel.app' // ← SUBSTITUA AQUI
  : 'http://localhost:5000';
```

**Substitua** `SEU-BACKEND-URL-AQUI.vercel.app` pela URL que copiou acima.

### **2.2 Criar repositório GitHub para o Frontend**

```powershell
# Acesse a raiz do projeto
cd Sistema_JH_Telecom

# Iniciar git na raiz
git init
git add .
git commit -m "Sistema JH Telecom - versão completa"
git branch -M main

# Criar repositório vazio no GitHub
git remote add origin https://github.com/SEU_USUARIO/sistema-jh-telecom.git
git push -u origin main
```

### **2.3 Deploy do Frontend no Vercel**

1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Selecione o repositório `sistema-jh-telecom`
4. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** deixe em branco
   - **Output Directory:** `.`
5. Clique em **"Deploy"**

### **2.4 Seu Frontend agora está publicado!**

Você receberá uma URL como:
```
https://sistema-jh-telecom.vercel.app
```

---

## **Dicas Importantes:**

### **Para atualizar o código após deploy:**

```powershell
# Fazer mudanças nos arquivos
# Depois executar:

git add .
git commit -m "Descrição da mudança"
git push origin main
```

O Vercel detectará automaticamente a mudança e fará redeploy!

### **Se der erro de CORS:**

Adicione isto no `backend/server.js` (já está lá, mas confirme):

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

### **Variaveis de Ambiente (se necessário):**

Se precisar de variáveis de ambiente, adicione em:
`Vercel Dashboard → Project Settings → Environment Variables`

---

## **Checklist Final:**

- [ ] Backend deployado no Vercel
- [ ] URL do backend copiada
- [ ] Frontend atualizado com URL do backend
- [ ] Frontend deployado no Vercel
- [ ] Testado login
- [ ] Testado importação de dados
- [ ] Testado botões e filtros

---

## **Pronto! 🎉**

Seu sistema está ao vivo na internet!

**Frontend:** https://seu-frontend.vercel.app
**Backend:** https://seu-backend.vercel.app

