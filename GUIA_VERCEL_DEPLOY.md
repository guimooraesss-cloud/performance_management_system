# 🚀 Guia Completo: Deploy na Vercel

## 📋 Pré-requisitos

1. **Conta na Vercel** - Acesse [vercel.com](https://vercel.com) e crie uma conta (pode usar GitHub)
2. **Repositório no GitHub** - Seu código deve estar no GitHub
3. **Banco de dados externo** - Você precisa de um banco MySQL hospedado (Supabase, PlanetScale, ou similar)

---

## 🔧 Passo 1: Preparar o Banco de Dados

### Opção A: Usar Supabase (Recomendado - Gratuito)

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub
4. Crie um novo projeto:
   - **Project name**: `performance-management-db`
   - **Password**: Guarde bem (você vai precisar)
   - **Region**: Escolha a mais próxima de você
5. Clique em **"Create new project"** e aguarde (leva 2-3 minutos)
6. Quando terminar, vá em **Settings → Database → Connection string**
7. Copie a string de conexão (formato: `mysql://user:password@host:port/database`)

### Opção B: Usar PlanetScale (Gratuito)

1. Acesse [planetscale.com](https://planetscale.com)
2. Clique em **"Sign up"**
3. Crie um novo database:
   - **Database name**: `performance-management`
   - **Region**: Escolha a mais próxima
4. Clique em **"Create database"**
5. Vá em **"Connect"** e copie a connection string

---

## 📤 Passo 2: Fazer Push do Código para GitHub

Se você ainda não fez, siga estes passos:

```bash
# 1. Abra o Terminal/PowerShell na pasta do projeto
cd C:\Users\CK\Desktop\GESTÃO DE DESEMPENHO\performance_management_system

# 2. Inicialize o Git (se não tiver feito)
git init

# 3. Adicione todos os arquivos
git add .

# 4. Faça o primeiro commit
git commit -m "Initial commit: Performance Management System"

# 5. Conecte ao repositório GitHub
git remote add origin https://github.com/guimoraesss-cloud/performance_management_system.git

# 6. Faça o push
git branch -M main
git push -u origin main
```

---

## 🔗 Passo 3: Conectar GitHub com Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New..." → "Project"**
3. Clique em **"Import Git Repository"**
4. Procure por `performance_management_system` e clique em **"Import"**

---

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

Na tela de configuração do Vercel, você verá uma seção **"Environment Variables"**.

Adicione estas variáveis (copie os valores do seu `.env.example`):

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=seu_jwt_secret_aqui
VITE_APP_ID=seu_app_id
VITE_APP_TITLE=Sistema de Gestão de Desempenho
VITE_APP_LOGO=https://seu-logo-url.com/logo.png
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_open_id
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

---

## 🚀 Passo 5: Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (leva 3-5 minutos)
3. Quando terminar, você verá uma mensagem **"Congratulations! Your project has been successfully deployed"**
4. Clique em **"Visit"** para abrir o site

---

## ✅ Passo 6: Validar o Deploy

1. Acesse a URL da Vercel (algo como `https://performance-management-system-31wq.vercel.app`)
2. Você deve ver a página de login
3. Clique em **"Login with Google"** para testar a autenticação
4. Se tudo funcionar, o deploy foi bem-sucedido! 🎉

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'tsx'"
**Solução:** Adicione `tsx` ao `package.json` como dependency (não dev):
```json
"dependencies": {
  "tsx": "^4.0.0"
}
```

### Erro: "Database connection failed"
**Solução:** Verifique se a `DATABASE_URL` está correta e se o banco está acessível

### Erro: "Build failed"
**Solução:** 
1. Verifique os logs do build na Vercel
2. Rode `pnpm build` localmente para testar
3. Se houver erro, corrija e faça novo push

### Interface mostra código-fonte
**Solução:** Verifique se o `vercel.json` está na raiz do projeto e se o `outputDirectory` está correto

---

## 📝 Próximos Passos

Após o deploy bem-sucedido:

1. **Configure um domínio customizado** (opcional)
   - Vá em **Settings → Domains**
   - Adicione seu domínio

2. **Configure CI/CD** (opcional)
   - Cada push para `main` fará deploy automático

3. **Monitore a aplicação**
   - Vá em **Analytics** para ver uso e performance

---

## 💡 Dicas

- **Sempre teste localmente antes de fazer push**: `pnpm dev`
- **Use branches para desenvolvimento**: `git checkout -b feature/nova-funcionalidade`
- **Faça commits pequenos e frequentes**: Mais fácil de debugar
- **Leia os logs da Vercel**: Eles indicam o que deu errado

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:
1. Verifique os logs no Vercel Dashboard
2. Rode `pnpm build` localmente para testar
3. Verifique se todas as variáveis de ambiente estão corretas
4. Consulte a documentação do Vercel: [vercel.com/docs](https://vercel.com/docs)
