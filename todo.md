# Sistema de Gestão de Desempenho - TODO

**Status:** Sistema funcionando 100% no sandbox. Deploy na Vercel em progresso.

## Fase 14: Persistência de Dados do Wizard
- [x] Conectar formulário de avaliação ao banco de dados
- [x] Implementar salvamento automático em rascunho
- [x] Permitir retomar avaliações incompletas
- [x] Salvar histórico de versões das avaliações
- [x] Testes unitários para persistência (24 testes)

## Fase 15: Relatórios e Exportação
- [ ] Gerar PDF com avaliação completa
- [ ] Exportar em Excel
- [ ] Matriz Nine Box com todos os colaboradores
- [ ] Armazenar no S3
- [ ] Testes unitários para exportação

## Fase 16: Robustez, Auditoria e Logs
- [ ] Logs de todas as ações
- [ ] Rastreamento de edições
- [ ] Compliance e segurança
- [ ] Impedir edição de avaliações já submetidas
- [ ] Testes unitários para auditoria

## Fase 17: Melhorias de Competências e Segurança de Pesos
- [x] Adicionar dropdown com 7 categorias na aba Competência
- [x] Implementar busca de colaboradores na Avaliação Avançada
- [x] Criar estrutura de 6-7 competências por cargo
- [x] Implementar pesos configuráveis apenas para RH Master
- [x] Ocultar pesos para líderes durante avaliação
- [x] Permitir que líderes vejam resultado após submissão
- [x] Testes de segurança e validação

## Fase 18: Correção de Deploy na Vercel
- [x] Criar arquivo vercel.json com configuração de build
- [x] Criar guia completo de deploy (GUIA_VERCEL_DEPLOY.md)
- [x] Documentar variáveis de ambiente (ENV_VARIABLES_VERCEL.md)
- [x] Criar arquivo .vercelignore para otimizar build
- [x] Fazer push com configuração definitiva
- [ ] Validar interface funcionando na Vercel
