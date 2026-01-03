# 🔐 Variáveis de Ambiente para Vercel

Quando você fizer o deploy na Vercel, você precisará adicionar estas variáveis de ambiente no painel de controle.

## 📋 Variáveis Obrigatórias

### 1. **DATABASE_URL** (Banco de Dados)
```
mysql://user:password@host:port/database
```
- Obtém do Supabase ou PlanetScale (veja o guia de deploy)
- Exemplo: `mysql://admin:senha123@db.supabase.co:3306/postgres`

### 2. **JWT_SECRET** (Segurança)
```
seu_jwt_secret_super_seguro_aqui
```
- Pode ser qualquer string aleatória longa
- Exemplo: `aB3xY9kL2mN5pQ8rS1tU4vW7xY0zAb3cD6eF9gH2i`

### 3. **VITE_APP_ID** (Manus OAuth)
```
seu_app_id_manus
```
- Fornecido pelo Manus quando você criou o projeto
- Procure em: Settings → Secrets (no painel Manus)

---

## 📝 Variáveis de Branding

### 4. **VITE_APP_TITLE**
```
Sistema de Gestão de Desempenho
```

### 5. **VITE_APP_LOGO**
```
https://seu-logo-url.com/logo.png
```
- URL completa da imagem do logo
- Pode ser um arquivo PNG, JPG ou SVG

---

## 🔗 Variáveis de Integração (Manus)

### 6. **OAUTH_SERVER_URL**
```
https://api.manus.im
```

### 7. **VITE_OAUTH_PORTAL_URL**
```
https://portal.manus.im
```

### 8. **BUILT_IN_FORGE_API_URL**
```
https://api.manus.im
```

### 9. **VITE_FRONTEND_FORGE_API_URL**
```
https://api.manus.im
```

### 10. **BUILT_IN_FORGE_API_KEY**
```
sua_chave_api_manus
```
- Fornecido pelo Manus
- Procure em: Settings → Secrets (no painel Manus)

### 11. **VITE_FRONTEND_FORGE_API_KEY**
```
sua_chave_frontend_manus
```
- Fornecido pelo Manus
- Procure em: Settings → Secrets (no painel Manus)

---

## 👤 Informações do Proprietário

### 12. **OWNER_NAME**
```
Seu Nome Completo
```

### 13. **OWNER_OPEN_ID**
```
seu_open_id_manus
```
- Fornecido pelo Manus
- Procure em: Settings → Secrets (no painel Manus)

---

## 📊 Analytics

### 14. **VITE_ANALYTICS_ENDPOINT**
```
https://analytics.manus.im
```

### 15. **VITE_ANALYTICS_WEBSITE_ID**
```
seu_website_id
```
- Fornecido pelo Manus
- Procure em: Settings → Secrets (no painel Manus)

---

## 🌍 Ambiente

### 16. **NODE_ENV**
```
production
```

---

## ✅ Como Adicionar na Vercel

1. Acesse seu projeto no Vercel Dashboard
2. Clique em **Settings**
3. Vá em **Environment Variables**
4. Para cada variável:
   - Digite o nome (ex: `DATABASE_URL`)
   - Cole o valor
   - Clique em **Add**
5. Clique em **Deploy** para aplicar as mudanças

---

## 🔍 Onde Encontrar Seus Valores

| Variável | Onde Encontrar |
|----------|---|
| DATABASE_URL | Supabase/PlanetScale Dashboard |
| JWT_SECRET | Gere uma string aleatória |
| VITE_APP_ID | Manus → Settings → Secrets |
| BUILT_IN_FORGE_API_KEY | Manus → Settings → Secrets |
| VITE_FRONTEND_FORGE_API_KEY | Manus → Settings → Secrets |
| OWNER_OPEN_ID | Manus → Settings → Secrets |
| VITE_ANALYTICS_WEBSITE_ID | Manus → Settings → Secrets |

---

## ⚠️ Segurança

- **Nunca compartilhe suas chaves** com ninguém
- **Nunca commite** o arquivo `.env` no Git
- **Use variáveis de ambiente** em produção, não hardcode valores
- **Rotacione as chaves** regularmente

---

## 🚀 Próximo Passo

Após adicionar todas as variáveis:
1. Clique em **Deploy** na Vercel
2. Aguarde o build completar
3. Acesse a URL do seu projeto
4. Teste a funcionalidade

Se houver erro, verifique os logs na Vercel Dashboard.
