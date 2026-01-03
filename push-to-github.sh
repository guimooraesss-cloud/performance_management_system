#!/bin/bash

# Script para fazer push do projeto para GitHub
# Uso: ./push-to-github.sh

set -e

echo "🚀 Iniciando push para GitHub..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não está instalado. Por favor, instale git primeiro.${NC}"
    exit 1
fi

# Verificar se estamos em um repositório git
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  Não é um repositório git. Inicializando...${NC}"
    git init
    echo -e "${GREEN}✅ Repositório git inicializado${NC}"
fi

# Adicionar todos os arquivos
echo -e "${YELLOW}📝 Adicionando arquivos...${NC}"
git add .
echo -e "${GREEN}✅ Arquivos adicionados${NC}"

# Criar commit
echo -e "${YELLOW}💾 Criando commit...${NC}"
git commit -m "Initial commit: Sistema de Gestão de Desempenho completo

- Dashboard com métricas
- Gestão de cargos e competências
- Sistema de avaliação em 6 etapas
- Matriz Nine Box
- Timeline de ciclo semestral
- PDI e feedback estruturado
- 97 testes unitários
- Pronto para deploy zero-cost" || echo -e "${YELLOW}ℹ️  Nada para commitar${NC}"

echo -e "${GREEN}✅ Commit criado${NC}"

# Instruções para adicionar remote
echo ""
echo -e "${YELLOW}📌 Próximas etapas:${NC}"
echo ""
echo "1. Crie um repositório no GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Após criar o repositório, execute:"
echo "   git remote add origin https://github.com/SEU_USUARIO/performance_management_system.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo -e "${GREEN}✅ Pronto para fazer push!${NC}"
