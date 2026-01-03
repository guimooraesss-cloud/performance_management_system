# 🚀 Setup Completo - Supabase + Vercel + GitHub

Este guia vai te levar passo a passo para ter seu Sistema de Gestão de Desempenho rodando **100% gratuito** em produção.

---

## 📋 Pré-requisitos

- ✅ Conta no GitHub (gratuita)
- ✅ Conta na Vercel (gratuita)
- ✅ Conta no Supabase (gratuita)
- ✅ Git instalado

---

## 🔧 Passo 1: Criar Projeto no Supabase

### 1.1 Criar Conta
1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado)

### 1.2 Criar Novo Projeto
1. Clique em **"New project"**
2. Nome: `performance_management_system`
3. Senha do banco: **Salve em local seguro!**
4. Região: Escolha a mais próxima de você
5. Clique em **"Create new project"**

### 1.3 Copiar Credenciais
1. Vá em **"Project Settings"** (engrenagem)
2. Clique em **"API"**
3. Copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (para servidor)

**Salve essas credenciais em um local seguro!**

---

## 🗄️ Passo 2: Criar Tabelas no Supabase

### 2.1 Criar Tabela de Usuários

No Supabase, vá em **"SQL Editor"** e execute:

```sql
-- Criar tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'leader')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Admins can read all data
CREATE POLICY "Admins can read all data" ON users
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
```

### 2.2 Criar Tabela de Avaliações

```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  evaluator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cycle_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  score DECIMAL(5, 2),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own evaluations" ON evaluations
  FOR SELECT USING (
    auth.uid() = employee_id OR auth.uid() = evaluator_id
  );

CREATE POLICY "Admins can read all evaluations" ON evaluations
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
```

### 2.3 Criar Tabela de Competências

```sql
CREATE TABLE competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read competencies" ON competencies
  FOR SELECT USING (true);
```

---

## 📤 Passo 3: Fazer Push para GitHub

### 3.1 Criar Repositório

1. Acesse: https://github.com/new
2. Nome: `performance_management_system`
3. Deixe vazio (não inicialize com README)
4. Clique em **"Create repository"**

### 3.2 Fazer Push Local

Abra PowerShell na pasta do projeto:

```bash
# Configurar git
git config user.name "Seu Nome"
git config user.email "seu.email@gmail.com"

# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/performance_management_system.git

# Renomear branch
git branch -M main

# Fazer push
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu usuário do GitHub!**

---

## 🌐 Passo 4: Deploy na Vercel

### 4.1 Conectar Vercel

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório GitHub
4. Clique em **"Import"**

### 4.2 Adicionar Variáveis de Ambiente

Na tela de configuração, adicione:

```
VITE_SUPABASE_URL = (copie do Supabase)
VITE_SUPABASE_ANON_KEY = (copie do Supabase)
SUPABASE_SERVICE_ROLE_KEY = (copie do Supabase)
NODE_ENV = production
```

### 4.3 Deploy

1. Clique em **"Deploy"**
2. Aguarde 5-10 minutos
3. Você receberá uma URL como: `https://performance-management-system-XXXXX.vercel.app`

---

## ✅ Passo 5: Testar

1. Acesse sua URL da Vercel
2. Clique em **"Sign up"**
3. Crie uma conta com seu email
4. Você deve ver o dashboard!

---

## 🔄 Atualizar o Código

Toda vez que quiser fazer mudanças:

```bash
# Edite os arquivos localmente
# Teste com: pnpm dev

# Faça commit
git add .
git commit -m "Descrição da mudança"

# Faça push
git push

# Vercel faz deploy automaticamente!
```

---

## 🆘 Troubleshooting

### Erro: "Cannot find module '@supabase/supabase-js'"
- Execute: `pnpm install`
- Aguarde a instalação completar

### Erro: "Supabase environment variables missing"
- Verifique se as variáveis foram adicionadas na Vercel
- Redeploy o projeto

### Erro: "RLS policy violation"
- Verifique as políticas de segurança no Supabase
- Certifique-se de que o usuário tem permissão

### Página mostra erro de autenticação
- Verifique se o Supabase Auth está habilitado
- Confirme as credenciais na Vercel

---

## 📞 Recursos Úteis

- Documentação Supabase: https://supabase.com/docs
- Documentação Vercel: https://vercel.com/docs
- Documentação Supabase Auth: https://supabase.com/docs/guides/auth

---

## 💰 Custo Total

- **Vercel**: Gratuito (até 100GB/mês)
- **Supabase**: Gratuito (até 500MB banco de dados)
- **GitHub**: Gratuito (repositórios ilimitados)

**Total: R$ 0,00** 🎉

---

**Pronto para começar!** 🚀
