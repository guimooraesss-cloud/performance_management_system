# 📋 ROTEIRO COMPLETO E DETALHADO - DEPLOYMENT INDEPENDENTE

**Sistema de Gestão de Desempenho - Do Zero ao Ar em Produção**

**Tempo Total: ~30-45 minutos**

---

## 🎯 OBJETIVO FINAL

Colocar seu sistema rodando **100% independente** na Vercel com banco de dados no Supabase, sem nenhuma dependência do Manus.

---

## ✅ PRÉ-REQUISITOS (Verifique Antes de Começar)

- [ ] Computador com Windows/Mac/Linux
- [ ] Internet funcionando
- [ ] Conta Google (para criar contas)
- [ ] Editor de texto (VS Code, Notepad++, etc)
- [ ] Git instalado (https://git-scm.com/download)
- [ ] Node.js 18+ instalado (https://nodejs.org)

**Como verificar se tem Node.js:**
```bash
node --version
npm --version
```

Se não tiver, instale em: https://nodejs.org (escolha LTS)

---

## 🚀 PASSO 1: CRIAR CONTA SUPABASE (10 minutos)

### 1.1 Acessar Supabase
1. Abra: https://supabase.com
2. Clique em **"Sign Up"** (canto superior direito)
3. Escolha **"Sign up with GitHub"** (mais fácil)
4. Autorize o Supabase

### 1.2 Criar Projeto
1. Clique em **"New Project"**
2. Preencha:
   - **Name:** `performance_management_system`
   - **Database Password:** `SenhaForte123!@#` (salve em local seguro!)
   - **Region:** Escolha a mais próxima (ex: `São Paulo` se disponível, senão `us-east-1`)
3. Clique em **"Create new project"**
4. **Aguarde 3-5 minutos** enquanto o projeto é criado

### 1.3 Copiar Credenciais
Quando terminar, você verá a tela do projeto:

1. Clique em **"Project Settings"** (engrenagem no canto inferior esquerdo)
2. Clique em **"API"** no menu esquerdo
3. **Copie e SALVE em um arquivo de texto:**

```
VITE_SUPABASE_URL = [copie aqui]
VITE_SUPABASE_ANON_KEY = [copie aqui]
SUPABASE_SERVICE_ROLE_KEY = [copie aqui]
```

**Exemplo (NÃO use esses valores!):**
```
VITE_SUPABASE_URL = https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Pronto! Supabase configurado!**

---

## 🗄️ PASSO 2: CRIAR TABELAS NO SUPABASE (5 minutos)

### 2.1 Acessar SQL Editor
1. No Supabase, clique em **"SQL Editor"** (menu esquerdo)
2. Clique em **"New Query"**

### 2.2 Copiar e Executar SQL

**Abra o arquivo `SETUP_SUPABASE.md` no seu projeto e copie TODO o SQL.**

Depois:
1. Cole no SQL Editor do Supabase
2. Clique em **"Run"** (botão azul)
3. Aguarde a execução

**Você deve ver: "Success. No rows returned"**

✅ **Pronto! Tabelas criadas!**

---

## 📥 PASSO 3: BAIXAR CÓDIGO DO GITHUB (5 minutos)

### 3.1 Criar Pasta Local
1. Abra o **File Explorer** (Windows) ou **Finder** (Mac)
2. Navegue até: `C:\Users\SEU_USUARIO\Desktop` (ou onde quiser)
3. Clique com botão direito → **"New Folder"**
4. Nome: `performance_management_system`

### 3.2 Abrir PowerShell/Terminal
1. **Windows:** Clique com botão direito na pasta → **"Open PowerShell here"**
2. **Mac:** Clique com botão direito na pasta → **"New Terminal at Folder"**

### 3.3 Clonar Repositório

**Copie e cole este comando:**

```bash
git clone https://github.com/guimooraesss-cloud/performance_management_system.git .
```

**Aguarde a clonagem terminar** (você verá `done` no final)

✅ **Pronto! Código baixado!**

---

## ⚙️ PASSO 4: CONFIGURAR VARIÁVEIS DE AMBIENTE (5 minutos)

### 4.1 Criar Arquivo .env.local
1. Abra o **VS Code** (ou editor de texto)
2. Clique em **"File"** → **"Open Folder"**
3. Selecione a pasta `performance_management_system`
4. Clique em **"File"** → **"New File"**
5. Nome: `.env.local`

### 4.2 Colar Credenciais
Cole exatamente isto (substitua pelos valores que você copiou):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=development
```

### 4.3 Salvar
Pressione **Ctrl + S** (Windows) ou **Cmd + S** (Mac)

✅ **Pronto! Variáveis configuradas!**

---

## 📦 PASSO 5: INSTALAR DEPENDÊNCIAS (10 minutos)

### 5.1 Abrir Terminal
1. No VS Code, clique em **"Terminal"** → **"New Terminal"**
2. Ou abra PowerShell na pasta do projeto

### 5.2 Instalar pnpm
```bash
npm install -g pnpm
```

### 5.3 Instalar Dependências do Projeto
```bash
pnpm install
```

**Aguarde terminar** (você verá "Done" no final)

✅ **Pronto! Dependências instaladas!**

---

## 🧪 PASSO 6: TESTAR LOCALMENTE (5 minutos)

### 6.1 Iniciar Servidor
```bash
pnpm dev
```

**Você deve ver:**
```
VITE v7.1.9 building for production...
Server running on http://localhost:5173
```

### 6.2 Acessar no Navegador
1. Abra seu navegador (Chrome, Firefox, Safari, Edge)
2. Digite: `http://localhost:5173`
3. Você deve ver a página de **LOGIN**

### 6.3 Testar Login
1. Clique em **"Sign Up"**
2. Digite seu email e crie uma senha
3. Você deve ver o **DASHBOARD**!

✅ **Pronto! Sistema rodando localmente!**

---

## 📤 PASSO 7: CRIAR REPOSITÓRIO GITHUB (5 minutos)

### 7.1 Criar Repositório
1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `performance_management_system`
   - **Description:** `Sistema de Gestão de Desempenho`
   - **Public** (deixe marcado)
3. **Não marque** "Initialize this repository"
4. Clique em **"Create repository"**

### 7.2 Fazer Push Local
No PowerShell/Terminal, execute:

```bash
git config user.name "Seu Nome"
git config user.email "seu.email@gmail.com"
git remote add origin https://github.com/SEU_USUARIO/performance_management_system.git
git branch -M main
git push -u origin main
```

**Substitua:**
- `SEU_USUARIO` → seu usuário do GitHub
- `Seu Nome` → seu nome real
- `seu.email@gmail.com` → seu email

✅ **Pronto! Código no GitHub!**

---

## 🚀 PASSO 8: DEPLOY NA VERCEL (10 minutos)

### 8.1 Acessar Vercel
1. Abra: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório `performance_management_system`
4. Clique em **"Import"**

### 8.2 Adicionar Variáveis de Ambiente
Na tela de configuração, clique em **"Environment Variables"** e adicione:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV = production
```

### 8.3 Deploy
1. Clique em **"Deploy"**
2. **Aguarde 5-10 minutos**
3. Você verá: **"Congratulations! Your site is live"**
4. Copie a URL: `https://seu-projeto-XXXXX.vercel.app`

✅ **Pronto! Site em produção!**

---

## ✅ PASSO 9: TESTAR EM PRODUÇÃO (5 minutos)

### 9.1 Acessar Site
1. Abra a URL da Vercel no navegador
2. Você deve ver a página de LOGIN
3. Crie uma conta
4. Acesse o DASHBOARD

### 9.2 Testar Módulos
- [ ] Dashboard - Métricas aparecem?
- [ ] Avaliações - Consegue criar?
- [ ] Competências - Aparecem as categorias?
- [ ] Colaboradores - Lista carrega?
- [ ] Cargos - Consegue gerenciar?

✅ **Pronto! Sistema em produção!**

---

## 🔄 PASSO 10: ATUALIZAR CÓDIGO (Contínuo)

**Toda vez que quiser fazer mudanças:**

### 10.1 Editar Código Localmente
1. Abra o arquivo no VS Code
2. Faça as mudanças
3. Teste com: `pnpm dev`

### 10.2 Fazer Push
```bash
git add .
git commit -m "Descrição da mudança"
git push
```

### 10.3 Vercel Faz Deploy Automático
- A Vercel detecta o push
- Faz build automaticamente
- Seu site é atualizado em 5-10 minutos!

---

## 📋 CHECKLIST FINAL

- [ ] Supabase configurado
- [ ] Credenciais copiadas
- [ ] Tabelas criadas no Supabase
- [ ] Código clonado do GitHub
- [ ] `.env.local` criado com credenciais
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Testado localmente (`pnpm dev`)
- [ ] Repositório GitHub criado
- [ ] Código feito push para GitHub
- [ ] Vercel conectado
- [ ] Variáveis adicionadas na Vercel
- [ ] Deploy bem-sucedido
- [ ] Site acessível e testado
- [ ] **PRONTO PARA USAR!** 🎉

---

## 🆘 TROUBLESHOOTING

### Erro: "Cannot find module 'pnpm'"
**Solução:** Instale pnpm globalmente
```bash
npm install -g pnpm
```

### Erro: "Supabase credentials missing"
**Solução:** Verifique se `.env.local` está correto e reinicie o servidor

### Erro: "Cannot connect to database"
**Solução:** Verifique se as tabelas foram criadas no Supabase

### Página em branco
**Solução:** Abra o console (F12) e veja os erros

### Site não carrega na Vercel
**Solução:** Verifique os logs da Vercel (clique em "Deployments" → "View Logs")

---

## 📞 SUPORTE

Se tiver dúvidas:

1. **Verifique a documentação:**
   - `DEPLOY_FINAL.md` - Guia de deployment
   - `SETUP_SUPABASE.md` - Setup do Supabase
   - `PROJECT_PROMPT.md` - Descrição completa do projeto

2. **Consulte os logs:**
   - Terminal local: `pnpm dev`
   - Vercel: Dashboard → Deployments → Logs
   - Supabase: Database → Logs

3. **Procure por erros:**
   - Console do navegador (F12)
   - Terminal do VS Code

---

## 🎉 PARABÉNS!

Você colocou seu **Sistema de Gestão de Desempenho** em produção! 🚀

**Próximos passos:**
1. Convide sua equipe
2. Configure ciclos de avaliação
3. Comece a usar o sistema!

---

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Status:** ✅ Pronto para Produção
