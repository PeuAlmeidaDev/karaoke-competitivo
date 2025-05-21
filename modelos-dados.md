# 📊 Modelos de Dados - Karaokê Competitivo

Este documento descreve em detalhes os modelos de dados que serão utilizados no projeto de Karaokê Competitivo, tanto no frontend quanto no backend.

## 🎵 Música (Song)

O modelo principal que representa uma música no sistema.

```typescript
interface Song {
  id: string;               // Identificador único da música
  title: string;            // Título da música
  artist: string;           // Nome do artista/banda
  duration: number;         // Duração em segundos
  difficulty: 'easy' | 'medium' | 'hard';  // Nível de dificuldade
  bpm: number;              // Batidas por minuto (tempo da música)
  key: string;              // Tom da música (ex: "C", "Am")
  audioUrl: string;         // URL para o arquivo de áudio (instrumental)
  coverImageUrl: string;    // URL para a imagem de capa
  lyrics: LyricLine[];      // Array de linhas de letra sincronizadas
  createdAt: Date;          // Data de criação no sistema
  updatedAt: Date;          // Data da última atualização
}
```

## 📝 Linha de Letra (LyricLine)

Representa uma linha de letra da música com sua sincronização temporal.

```typescript
interface LyricLine {
  id: string;               // Identificador único da linha
  text: string;             // Texto completo da linha
  startTime: number;        // Tempo de início em milissegundos
  endTime: number;          // Tempo de fim em milissegundos
  notes: Note[];            // Array de notas musicais nesta linha
}
```

## 🎼 Nota Musical (Note)

Representa uma nota individual dentro de uma linha de letra, com informações de tom e tempo.

```typescript
interface Note {
  id: string;               // Identificador único da nota
  pitch: string;            // Tom da nota (ex: "C4", "A3")
  startTime: number;        // Tempo de início em milissegundos
  duration: number;         // Duração em milissegundos
  lyricSegment: string;     // Segmento da letra associado a esta nota
  intensity: number;        // Intensidade/volume esperado (0-100)
}
```

## 👤 Jogador Local (LocalPlayer)

Representa um jogador durante uma sessão de jogo local.

```typescript
interface LocalPlayer {
  id: string;               // Identificador único para a sessão atual
  name: string;             // Nome do jogador
  color: string;            // Cor que representa o jogador na interface
  avatar?: string;          // Avatar opcional (pode ser um índice de avatar predefinido)
  scores: LocalPlayerScore[]; // Pontuações nesta sessão de jogo
  totalScore: number;       // Pontuação total na sessão atual
}
```

## 🎮 Sessão de Jogo Local (LocalGame)

Representa uma sessão de jogo local completa.

```typescript
interface LocalGame {
  id: string;               // Identificador único da sessão
  players: LocalPlayer[];   // Array de jogadores locais
  currentRound: number;     // Rodada atual do jogo
  maxRounds: number;        // Número máximo de rodadas (opcional)
  rounds: GameRound[];      // Rodadas jogadas
  date: Date;               // Data/hora da sessão
  isComplete: boolean;      // Se o jogo foi finalizado
  settings: GameSettings;   // Configurações do jogo
}

interface GameRound {
  songId: string;           // ID da música desta rodada
  playerScores: LocalPlayerScore[]; // Pontuações dos jogadores nesta rodada
  roundNumber: number;      // Número da rodada
}
```

## ⚙️ Configurações de Jogo (GameSettings)

Configurações específicas para uma sessão de jogo.

```typescript
interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';  // Dificuldade aplicada
  micSensitivity: number;   // Sensibilidade do microfone (0-100)
  scoreMultiplier: number;  // Multiplicador de pontuação
  visualEffects: boolean;   // Ativar/desativar efeitos visuais
  turnOrder: 'sequential' | 'random'; // Ordem de jogadas (sequencial ou aleatória)
}
```

## 🏆 Pontuação de Jogador Local (LocalPlayerScore)

Representa a pontuação e desempenho de um jogador em uma rodada específica.

```typescript
interface LocalPlayerScore {
  playerId: string;         // ID do jogador local
  playerName: string;       // Nome do jogador (para fácil acesso)
  songId: string;           // ID da música cantada
  score: number;            // Pontuação total
  accuracyPercentage: number;  // Porcentagem de precisão geral (0-100)
  noteHits: number;         // Quantidade de notas acertadas
  noteMisses: number;       // Quantidade de notas erradas
  longestStreak: number;    // Maior sequência de acertos
  noteScores: NoteScore[];  // Pontuações detalhadas por nota
  rank: number;             // Classificação nesta rodada
}
```

## 🎯 Pontuação de Nota (NoteScore)

Representa o desempenho do jogador em uma nota específica.

```typescript
interface NoteScore {
  noteId: string;           // ID da nota
  hit: boolean;             // Se a nota foi acertada
  accuracy: number;         // Precisão do acerto (0-100)
  timingDifference: number; // Diferença de tempo em ms (positivo = atrasado, negativo = adiantado)
  pitchDifference: number;  // Diferença de tom em cents
  points: number;           // Pontos ganhos nesta nota
}
```

## 🏅 Histórico Local (LocalHistory)

Representa o histórico de jogos armazenados localmente.

```typescript
interface LocalHistory {
  games: LocalGameSummary[];  // Resumos de jogos passados
  lastPlayed: Date;         // Data do último jogo
  highScores: LocalHighScore[]; // Melhores pontuações por música
}

interface LocalGameSummary {
  id: string;               // ID do jogo
  date: Date;               // Data do jogo
  playerCount: number;      // Número de jogadores
  playerNames: string[];    // Nomes dos jogadores
  winner: string;           // Nome do vencedor
  rounds: number;           // Número de rodadas jogadas
}

interface LocalHighScore {
  songId: string;           // ID da música
  songTitle: string;        // Título da música
  playerName: string;       // Nome do jogador
  score: number;            // Pontuação
  accuracy: number;         // Precisão (0-100)
  date: Date;               // Data do recorde
}
```

## 🗄️ Relacionamentos

### Diagrama Simplificado de Relacionamentos

```
Song 1──n LyricLine 1──n Note
                      
LocalGame 1──n LocalPlayer
    │      
    │      
    └──n GameRound
```

### Índices Principais

Para otimizar o desempenho do banco de dados, os seguintes índices são recomendados:

1. `songs`: índices em `title`, `artist` e `difficulty`
2. `localGames`: índices em `date` e `isComplete` 

## 🔄 Fluxo de Dados

### Criação de uma Sessão de Jogo Local

1. Seleção do número de jogadores (1-4)
2. Entrada dos nomes de jogadores
3. Criação da entidade `LocalGame` com status `isComplete: false`
4. Inicialização das entidades `LocalPlayer` para cada jogador
5. Para cada rodada:
   - Seleção de música
   - Execução da música e captura da performance
   - Registro de `NoteScore` para cada nota cantada
   - Cálculo de `LocalPlayerScore` ao final da música
   - Atualização do ranking da rodada
6. Ao final de todas as rodadas desejadas, atualização de `LocalGame` com `isComplete: true` e cálculo das estatísticas finais

### Cálculo de Pontuação

1. Para cada nota cantada:
   - Análise do áudio do jogador para extrair tom (pitch)
   - Comparação com a nota esperada (modelo `Note`)
   - Cálculo da diferença de tom (`pitchDifference`)
   - Cálculo da diferença de tempo (`timingDifference`)
   - Determinação da precisão geral (`accuracy`)
   - Atribuição de pontos com base na precisão

2. Para a pontuação final:
   - Soma dos pontos de todas as notas
   - Cálculo de estatísticas (acertos, erros, sequências)
   - Aplicação de multiplicadores e bônus
   - Determinação do ranking entre os jogadores

## 🔌 Interfaces de API

### API de Músicas

- `GET /api/songs` - Listar todas as músicas
- `GET /api/songs/:id` - Obter detalhes de uma música
- `GET /api/songs/:id/lyrics` - Obter letras sincronizadas

### API de Histórico Local

- `POST /api/local/history` - Salvar um novo jogo no histórico
- `GET /api/local/history` - Obter histórico de jogos
- `GET /api/local/highscores` - Obter melhores pontuações

---

Este documento serve como referência para a implementação do banco de dados e das estruturas de dados no frontend e backend do projeto Karaokê Competitivo. Os modelos enfatizam o aspecto local do jogo multiplayer, sem necessidade de contas de usuário online ou sincronização em nuvem. 