# 📝 Regras para o Agente Cursor - Projeto Karaokê Competitivo

Este documento estabelece as regras e padrões a serem seguidos pelo Agente Cursor durante o desenvolvimento do projeto de Karaokê Competitivo no estilo "vibe coding".

## 🌟 Princípios Gerais

1. **Seguir o paradigma "vibe coding"**: 
   - Auxiliar na geração de código de forma conversacional
   - Focar em soluções completas e robustas
   - Priorizar explicações claras em português
   - Adaptar a comunicação ao nível técnico do usuário

2. **Priorizar a qualidade do código**:
   - Preferir legibilidade sobre código excessivamente "inteligente"
   - Seguir práticas modernas de desenvolvimento
   - Criar código resiliente e manutenível
   - Pensar na experiência do desenvolvedor e do usuário final

## 🧩 Padrões de Projeto

### Frontend (React/Next.js)

1. **Arquitetura de Componentes**:
   - Adotar o padrão de Componentes Funcionais com Hooks
   - Implementar Atomic Design (átomos, moléculas, organismos)
   - Separar componentes de UI de componentes de lógica
   - Usar Context API para gerenciamento de estado global

2. **Gerenciamento de Estado**:
   - Preferir React Context + useReducer para estados complexos
   - Evitar prop drilling (mais de 2 níveis de props)
   - Usar React Query para cache e gerenciamento de dados remotos
   - Implementar estados locais com useState para componentes isolados

3. **Estilização**:
   - Usar TailwindCSS de forma consistente
   - Criar sistemas de design com variáveis CSS/Tailwind
   - Implementar responsividade desde o início
   - Aplicar o tema escuro semelhante ao Yousician

4. **Performance**:
   - Implementar Code Splitting e Lazy Loading
   - Usar memo, useMemo e useCallback estrategicamente
   - Otimizar renderizações com virtualizações para listas longas
   - Priorizar Web Vitals (LCP, FID, CLS)

### Backend (Node.js/Express)

1. **Arquitetura**:
   - Implementar arquitetura em camadas (MVC ou similar)
   - Aplicar injeção de dependências sempre que possível
   - Usar Factory Pattern para criação de instâncias complexas
   - Separar regras de negócio da infraestrutura

2. **APIs**:
   - Seguir princípios RESTful com consistência
   - Documentar endpoints com OpenAPI/Swagger
   - Implementar versionamento de API
   - Padronizar respostas de erro e sucesso

3. **Banco de Dados**:
   - Implementar Repository Pattern
   - Usar migrations para controle de schema
   - Aplicar índices para consultas frequentes
   - Implementar transações para operações relacionadas

4. **Segurança**:
   - Validar todas as entradas com bibliotecas como Joi/Zod
   - Sanitizar dados para prevenir injeções
   - Implementar rate limiting e CORS apropriados
   - Seguir OWASP Top 10 para prevenção de vulnerabilidades

## 🧪 Testes e Qualidade

1. **Testes Automatizados**:
   - Implementar testes unitários para funções críticas
   - Criar testes de integração para fluxos principais
   - Testar componentes com React Testing Library
   - Manter cobertura mínima de 70% para código crítico

2. **Qualidade**:
   - Configurar ESLint com regras rigorosas
   - Implementar Prettier para formatação consistente
   - Usar TypeScript com tipos estritos (strict: true)
   - Seguir convenções de nomenclatura consistentes

## 🚨 Prevenção de Problemas Comuns

1. **Evitar duplicação de código**:
   - **Antes de criar qualquer novo componente ou função, verificar se já existe algo similar**
   - Extrair lógica comum para hooks ou utilitários
   - Implementar componentes genéricos e reutilizáveis
   - Refatorar código duplicado assim que identificado

2. **Evitar complexidade desnecessária**:
   - Preferir funções puras quando possível
   - Limitar aninhamento de condicionais (máximo 2-3 níveis)
   - Dividir funções grandes em funções menores e específicas
   - Limitar responsabilidades de cada componente/classe

3. **Prevenir memory leaks**:
   - Limpar event listeners e subscriptions com useEffect
   - Gerenciar conexões assíncronas adequadamente
   - Verificar vazamentos com ferramentas de profiling
   - Evitar closures que retêm grandes estruturas de dados

## 📚 Convenções de Nomenclatura

1. **Nomes de Arquivos**:
   - Componentes React: PascalCase (Button.tsx)
   - Hooks: camelCase com prefixo "use" (useAudio.ts)
   - Utilitários: camelCase (formatTime.ts)
   - Páginas: kebab-case ou index.tsx dentro de diretórios

2. **Nomes de Funções/Variáveis**:
   - Funções: camelCase, verbo + substantivo (fetchSongs, calculateScore)
   - Handlers: handle + Evento (handleClick, handleSubmit)
   - Booleanos: prefixo is/has/should (isLoading, hasError)
   - Props de componentes: descritivas, específicas (songTitle, playerScore)

3. **Comentários**:
   - Priorizar código auto-explicativo sobre comentários
   - Documentar apenas decisões complexas ou não-óbvias
   - Usar JSDoc para interfaces/tipos complexos
   - Manter TODOs concisos e acionáveis

## 🌐 Estrutura de Pastas

1. **Manter estrutura intuitiva**:
   - Agrupar por funcionalidade primeiro, depois por tipo
   - Evitar aninhamento excessivo (máximo 3-4 níveis)
   - Co-localizar arquivos relacionados (componente + teste + estilos)
   - Usar barrel files (index.ts) para exportações limpas

2. **Localização de código**:
   - Guardar componentes genéricos em `/components/ui`
   - Implementar componentes específicos de feature em suas pastas
   - Manter hooks em `/hooks` (exceto hooks específicos de feature)
   - Centralizar tipos em `/types` ou junto aos componentes

## 🚀 Desenvolvimento Iterativo

1. **Abordagem modular**:
   - Desenvolver MVP com funcionalidades core primeiro
   - Adicionar recursos incrementalmente
   - Validar cada recurso completamente antes de avançar
   - Refatorar continuamente sem acumular dívida técnica

2. **Feedback contínuo**:
   - Criar componentes visuais com exemplos/storybook
   - Implementar feedback visual durante desenvolvimento
   - Testar em diferentes dispositivos/browsers
   - Solicitar revisão após completar cada módulo

## 🛡️ Segurança e Melhores Práticas

1. **Segurança**:
   - **Nunca armazenar segredos/chaves diretamente no código**
   - Implementar autenticação segura se necessário
   - Validar estritamente todas as entradas do usuário
   - Seguir o princípio do menor privilégio

2. **Acessibilidade**:
   - Usar elementos semânticos HTML
   - Implementar ARIA quando necessário
   - Garantir contraste adequado para texto
   - Testar com ferramentas de acessibilidade

3. **Internacionalização**:
   - Preparar para i18n desde o início, mesmo se não for implementado imediatamente
   - Evitar textos hardcoded na UI
   - Considerar diferentes formatos de data/hora/números

## 🧠 Abordagem Inteligente

1. **Aprender com o código existente**:
   - Analisar estruturas e padrões já estabelecidos no projeto
   - Adaptar-se ao estilo de código existente
   - Manter consistência com decisões anteriores
   - Sugerir melhorias apenas quando trouxerem valor significativo

2. **Resolução de problemas**:
   - Entender completamente o problema antes de propor soluções
   - Considerar trade-offs (performance vs. legibilidade)
   - Oferecer alternativas quando relevante
   - Explicar raciocínio por trás das decisões importantes

## 📈 Otimização e Performance

1. **Frontend**:
   - Otimizar carregamento de assets
   - Minimizar main-thread blocking
   - Implementar web workers para processamento pesado de áudio
   - Usar Canvas para visualizações complexas de notas

2. **Backend**:
   - Implementar caching estratégico
   - Otimizar queries de banco de dados
   - Usar análise de complexidade para algoritmos críticos
   - Considerar paginação para conjuntos grandes de dados

## ✅ Checklist de Desenvolvimento

Antes de cada entrega/contribuição, verificar:

1. O código segue os padrões do projeto?
2. Existe código duplicado que pode ser refatorado?
3. Os tipos estão bem definidos e utilizados?
4. Os testes cobrem casos de borda e fluxos principais?
5. A solução é performática e escalável?
6. Há melhorias de UX que podem ser implementadas?
7. A documentação está atualizada?
8. O código é acessível e inclusivo?

## 💯 Compromisso com Excelência

1. **Sempre privilegiar qualidade sobre velocidade**
2. **Documentar decisões importantes e trade-offs**
3. **Manter o design system consistente em toda a aplicação**
4. **Priorizar experiência do usuário em todas as decisões**
5. **Considerar o projeto como um produto de qualidade profissional**

---

Este documento serve como guia para o desenvolvimento do projeto Karaokê Competitivo e deve ser consultado regularmente durante o processo de "vibe coding". O objetivo é garantir que, mesmo com desenvolvimento assistido por IA, o código mantenha alta qualidade, siga padrões da indústria e resulte em um produto final robusto e manutenível. 