# 🎤 Karaokê Competitivo

Aplicativo web de karaokê competitivo inspirado no Yousician, permitindo que múltiplos jogadores compitam cantando músicas e recebam pontuação com base na precisão do tom e ritmo.

## 🚀 Funcionalidades

* **Interface estilo Yousician:** Design moderno e escuro com visualização de notas e letras
* **Multiplayer local:** Até 4 jogadores podem competir simultaneamente no mesmo dispositivo
* **Sistema de pontuação:** Avaliação em tempo real da precisão vocal
* **Ranking de jogadores:** Classificação após cada música e placar geral
* **Biblioteca de músicas:** Seleção de músicas com diferentes níveis de dificuldade

## 🛠️ Tecnologias

### Frontend

* NextJS 14+
* ReactJS 18+
* TypeScript
* TailwindCSS
* Web Audio API
* D3.js/Canvas para visualizações

### Backend

* NodeJS
* ExpressJS
* TypeScript
* MongoDB
* REST API

## ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/karaoke-competitivo.git
cd karaoke-competitivo
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

### Backend

```bash
cd backend
npm install
npm run dev
```

A API estará disponível em `http://localhost:5000`

## 📱 Uso

1. Inicie a aplicação frontend e backend
2. Na tela inicial, selecione o número de jogadores (1-4)
3. Adicione um nome para cada jogador
4. Os jogadores se alternam para escolher músicas e cantar
5. Siga as letras e notas na tela para cantar
6. Veja os resultados e rankings após cada música
7. Continue jogando com todos os participantes usando o mesmo dispositivo

## 📂 Estrutura do Projeto

```
karaoke-app/
├── frontend/                # Aplicação NextJS
│   ├── public/              # Arquivos estáticos
│   └── src/                 # Código fonte
│       ├── components/      # Componentes React
│       ├── pages/           # Páginas da aplicação
│       ├── hooks/           # Custom hooks
│       ├── context/         # Contextos React
│       ├── services/        # Serviços e API
│       └── styles/          # Estilos globais
│
├── backend/                 # API NodeJS
│   └── src/
│       ├── controllers/     # Controladores
│       ├── models/          # Modelos de dados
│       ├── routes/          # Rotas da API
│       ├── services/        # Serviços
│       └── utils/           # Utilitários
│
└── shared/                  # Código compartilhado
    └── types/               # Tipos compartilhados
```

## 📝 Documentação

Este projeto inclui documentação detalhada nos seguintes arquivos:

1. [**Lista de Documentos**](lista-documentos.md) - Índice da documentação completa
2. [**Modelos de Dados**](modelos-dados.md) - Estruturas e esquemas de dados
3. [**Sistema de Áudio**](sistema-audio.md) - Análise de áudio e algoritmos de pontuação
4. [**Interface do Usuário**](interface-usuario.md) - Design e experiência do usuário
5. [**Plano de Desenvolvimento**](plano-desenvolvimento.md) - Fases e cronograma
6. [**Regras de Desenvolvimento**](agente-cursor-regras.md) - Diretrizes e padrões de código

A pasta `conceitos/` contém imagens conceituais para a interface do usuário.

## 🔧 Configuração de Ambiente

Crie um arquivo `.env.local` no diretório `frontend` com as seguintes variáveis:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Crie um arquivo `.env` no diretório `backend` com as seguintes variáveis:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/karaoke
NODE_ENV=development
```

## 📈 Próximos Passos

* Adicionar mais músicas e categorias
* Desenvolver estatísticas detalhadas de performance
* Implementar modos de jogo adicionais (torneios, duelos)
* Aprimorar feedback visual durante o canto

## 📄 Licença

MIT © [Seu Nome](https://github.com/seu-usuario) 