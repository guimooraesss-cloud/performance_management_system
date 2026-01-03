# 🚀 Deploy na Vercel - Guia Completo

Este projeto está **100% pronto para rodar na Vercel** sem dependências do Manus.

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta na Vercel
- ✅ Git instalado no seu computador

---

## 🔧 Passo 1: Criar Novo Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `performance_management_system`
3. Descrição: `Sistema de Gestão de Desempenho`
4. Clique em **"Create repository"**
5. **NÃO** inicialize com README (deixe vazio)

---

## 📤 Passo 2: Fazer Push do Código Local

Abra PowerShell na pasta do projeto e execute:

```bash
# Adicionar o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/performance_management_system.git

# Renomear branch para main
git branch -M main

# Fazer push
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu usuário do GitHub!**

---

## 🌐 Passo 3: Deploy na Vercel

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Cole a URL do seu repositório GitHub
4. Clique em **"Import"**
5. Vercel vai detectar automaticamente:
   - ✅ Framework: Vite
   - ✅ Build Command: `pnpm install && pnpm build`
   - ✅ Output Directory: `dist`
6. Clique em **"Deploy"**

---

## ⏱️ Tempo de Deploy

- **Build**: 3-5 minutos
- **Deploy**: Automático
- **Total**: 5-10 minutos

---

## 🎯 Após o Deploy

Você receberá uma URL como: `https://performance-management-system-XXXXX.vercel.app`

### ✅ Verificar se Funciona:

1. Acesse a URL
2. Você deve ver a **página de login**
3. Clique em **"Continue with Google"**
4. Faça login com sua conta Google
5. Você verá o **dashboard** com todos os módulos

---

## 🔄 Atualizar o Código

Toda vez que você quer fazer uma mudança:

```bash
# 1. Edite os arquivos localmente
# 2. Teste com: pnpm dev

# 3. Faça commit
git add .
git commit -m "Descrição da mudança"

# 4. Faça push
git push

# 5. Vercel faz deploy automaticamente!
```

---

## 🗄️ Banco de Dados (Importante!)

**Atualmente:** O sistema usa banco de dados em memória (dados não persistem)

**Para Produção:** Configure um banco externo:

### Opção 1: Supabase (Recomendado)

1. Acesse: https://supabase.com
2. Crie uma conta
3. Crie um novo projeto
4. Copie a `DATABASE_URL`
5. Na Vercel:
   - Vá em Settings → Environment Variables
   - Adicione: `DATABASE_URL` = sua URL do Supabase
   - Redeploy

### Opção 2: PlanetScale

1. Acesse: https://planetscale.com
2. Crie uma conta
3. Crie um novo banco de dados MySQL
4. Copie a `DATABASE_URL`
5. Na Vercel:
   - Vá em Settings → Environment Variables
   - Adicione: `DATABASE_URL` = sua URL do PlanetScale
   - Redeploy

---

## 🆘 Troubleshooting

### Erro: "Build failed"
- Verifique se o `package.json` está correto
- Tente rodar `pnpm install && pnpm build` localmente

### Erro: "Cannot find module"
- Verifique se todas as dependências estão no `package.json`
- Rode `pnpm install` localmente

### Página mostra código-fonte
- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Aguarde 5 minutos para o cache da Vercel expirar

---

## 📞 Suporte

Se tiver dúvidas, consulte:
- Documentação Vercel: https://vercel.com/docs
- Documentação Supabase: https://supabase.com/docs
- GitHub Issues: https://github.com/SEU_USUARIO/performance_management_system/issues

---

**Pronto para deploy!** 🚀
