# 📤 Como Fazer Push para GitHub

## 🔑 Passo 1: Configurar Git (Primeira Vez)

Abra PowerShell na pasta do projeto e execute:

```bash
git config user.name "Seu Nome"
git config user.email "seu.email@gmail.com"
```

---

## 🚀 Passo 2: Fazer Push Inicial (Primeira Vez)

```bash
# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/performance_management_system.git

# Renomear branch para main
git branch -M main

# Fazer push
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu usuário do GitHub!**

---

## 🔄 Passo 3: Fazer Push das Atualizações (Próximas Vezes)

```bash
# Ver o status
git status

# Adicionar todos os arquivos
git add .

# Fazer commit com descrição
git commit -m "Descrição da mudança aqui"

# Fazer push
git push
```

---

## 📝 Exemplos de Commits

```bash
# Adicionar nova funcionalidade
git commit -m "Adicionar página de relatórios"

# Corrigir bug
git commit -m "Corrigir erro de validação no formulário"

# Melhorar performance
git commit -m "Otimizar query do banco de dados"

# Atualizar documentação
git commit -m "Atualizar README com instruções"
```

---

## ✅ Verificar Push

Após fazer push, acesse seu repositório no GitHub:
```
https://github.com/SEU_USUARIO/performance_management_system
```

Você deve ver seus commits lá!

---

## 🆘 Se der Erro

### Erro: "fatal: 'origin' does not appear to be a 'git' repository"

Execute:
```bash
git remote add origin https://github.com/SEU_USUARIO/performance_management_system.git
```

### Erro: "Permission denied (publickey)"

Você precisa configurar SSH no GitHub:
1. Acesse: https://github.com/settings/keys
2. Clique em "New SSH key"
3. Siga as instruções

Ou use HTTPS com token:
```bash
git remote set-url origin https://SEU_TOKEN@github.com/SEU_USUARIO/performance_management_system.git
```

---

**Pronto para fazer push!** 🚀
