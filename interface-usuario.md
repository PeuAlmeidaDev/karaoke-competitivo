# 🎮 Interface do Usuário e Experiência de Jogo

Este documento detalha a interface do usuário e a experiência de jogo do Karaokê Competitivo, seguindo o estilo visual e interativo do Yousician.

## 📱 Fluxo de Telas

### 1. Tela Inicial

![Tela Inicial](conceitos/tela-inicial.png)

A tela inicial apresenta um design escuro e moderno com os seguintes elementos:

- Logo do Karaokê Competitivo
- Botão "Jogar" (destaque principal)
- Botão "Catálogo de Músicas"
- Botão "Rankings Locais"
- Botão "Configurações"
- Animações sutis de elementos musicais no fundo

```tsx
// Exemplo simplificado do componente da Tela Inicial
const HomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-white">
      <Logo className="w-64 mb-10 animate-pulse" />
      
      <div className="space-y-4 w-64">
        <Button 
          variant="primary" 
          fullWidth 
          size="lg"
          onClick={() => navigate('/player-selection')}
        >
          Jogar
        </Button>
        
        <Button 
          variant="secondary" 
          fullWidth
          onClick={() => navigate('/songs')}
        >
          Catálogo de Músicas
        </Button>
        
        <Button 
          variant="secondary" 
          fullWidth
          onClick={() => navigate('/rankings')}
        >
          Rankings Locais
        </Button>
        
        <Button 
          variant="outline" 
          fullWidth
          onClick={() => navigate('/settings')}
        >
          Configurações
        </Button>
      </div>
    </div>
  );
};
```

### 2. Seleção de Jogadores

![Seleção de Jogadores](conceitos/selecao-jogadores.png)

Nesta tela, os jogadores locais são configurados para a sessão atual:

- Seletor de número de jogadores (1-4)
- Campos para entrada de nomes de jogadores
- Opção para selecionar cor/avatar para cada jogador
- Configuração de número de rodadas (opcional)
- Botão "Iniciar Jogo" para prosseguir
- Botão "Voltar" para retornar à tela inicial

```tsx
// Exemplo de componente de seleção de jogadores
const PlayerSelection: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState([{ name: '', color: '#42C86A', avatar: 'default' }]);
  const [rounds, setRounds] = useState(0); // 0 = ilimitado
  
  const addPlayer = () => {
    if (playerCount < 4) {
      setPlayerCount(playerCount + 1);
      // Atribuir cor diferente para cada jogador
      const colors = ['#42C86A', '#FF5252', '#FFCD56', '#8367C7'];
      setPlayers([...players, { 
        name: '', 
        color: colors[playerCount], 
        avatar: 'default' 
      }]);
    }
  };
  
  const removePlayer = () => {
    if (playerCount > 1) {
      setPlayerCount(playerCount - 1);
      setPlayers(players.slice(0, -1));
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Selecione os Jogadores</h1>
      
      <div className="flex justify-center mb-6">
        <button onClick={removePlayer} disabled={playerCount <= 1}>-</button>
        <span className="mx-4">{playerCount} Jogador(es)</span>
        <button onClick={addPlayer} disabled={playerCount >= 4}>+</button>
      </div>
      
      <div className="space-y-6">
        {players.map((player, index) => (
          <PlayerInput 
            key={index}
            player={player}
            playerNumber={index + 1}
            onChange={(updated) => {
              const newPlayers = [...players];
              newPlayers[index] = updated;
              setPlayers(newPlayers);
            }}
          />
        ))}
      </div>
      
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">
          Número de Rodadas
        </label>
        <select 
          value={rounds} 
          onChange={(e) => setRounds(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-800"
        >
          <option value="0">Jogo Livre (sem limite)</option>
          <option value="3">3 Rodadas</option>
          <option value="5">5 Rodadas</option>
          <option value="10">10 Rodadas</option>
        </select>
        <p className="text-sm text-gray-400 mt-1">
          Cada jogador cantará {rounds > 0 ? Math.ceil(rounds / playerCount) : 'várias'} músicas
        </p>
      </div>
      
      <div className="mt-10 flex justify-between">
        <Button variant="secondary" onClick={() => navigate('/')}>
          Voltar
        </Button>
        <Button 
          variant="primary" 
          onClick={() => navigate('/select-song')}
          disabled={players.some(p => !p.name)}
        >
          Iniciar Jogo
        </Button>
      </div>
    </div>
  );
};
```

### 3. Seleção de Música (com indicação do jogador atual)

![Seleção de Música](conceitos/selecao-musica.png)

A tela de seleção de música mostra claramente qual jogador está escolhendo:

- Indicador do jogador atual (nome, cor e avatar)
- Lista de músicas disponíveis com imagens de capa
- Informações como artista, título, duração e dificuldade
- Filtros por dificuldade, gênero ou artista
- Campo de busca para encontrar músicas
- Pré-visualização de áudio ao selecionar uma música
- Botão "Cantar" para iniciar a música selecionada

```tsx
// Exemplo de componente de seleção de música com indicação do jogador atual
const SongSelection: React.FC = () => {
  const { gameState, currentPlayer } = useGameContext();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Obter jogador atual
  const player = gameState.players[currentPlayer];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="current-player-info flex items-center mb-8 p-4 rounded" style={{ backgroundColor: `${player.color}33` }}>
        <div className="avatar w-12 h-12 rounded-full bg-gray-700 mr-4" />
        <div>
          <h2 className="text-xl font-bold" style={{ color: player.color }}>
            {player.name}
          </h2>
          <p className="text-sm">Escolha uma música para cantar</p>
        </div>
      </div>
      
      <div className="flex mb-6">
        <Input 
          placeholder="Buscar música ou artista..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow mr-4"
        />
        
        <Select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos os Níveis</option>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map(song => (
          <SongCard
            key={song.id}
            song={song}
            isSelected={selectedSong?.id === song.id}
            onClick={() => setSelectedSong(song)}
          />
        ))}
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm">
          Rodada {gameState.currentRound} de {gameState.maxRounds || '∞'}
        </div>
        
        <div className="flex-grow mx-4">
          {selectedSong && (
            <div className="text-center">
              <h3 className="font-bold">{selectedSong.title}</h3>
              <p>{selectedSong.artist}</p>
            </div>
          )}
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => navigate(`/game/${selectedSong?.id}`)}
          disabled={!selectedSong}
        >
          Cantar
        </Button>
      </div>
    </div>
  );
};
```

### 4. Tela de Jogo (com indicação do jogador atual)

![Tela de Jogo](conceitos/tela-jogo.png)

A tela principal de jogo, inspirada no Yousician, contém:

- Indicador do jogador atual no canto superior
- Visualização de notas em estilo "esteira" horizontal
- Letras sincronizadas na parte inferior
- Indicador visual de tom (muito alto, muito baixo, correto)
- Pontuação atual e multiplicador de streak
- Barra de progresso da música
- Opção para abandonar ou pular a música (se necessário)

```tsx
// Exemplo simplificado do componente da tela de jogo
const GameScreen: React.FC = () => {
  const { songId } = useParams();
  const { gameState, currentPlayer } = useGameContext();
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyric, setCurrentLyric] = useState('');
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Obter jogador atual
  const player = gameState.players[currentPlayer];
  
  // Lógica de jogo e renderização omitidas para brevidade
  
  return (
    <div className="game-screen bg-dark text-white h-screen flex flex-col">
      {/* Cabeçalho com informações do jogador e pontuação */}
      <div className="game-header flex justify-between items-center p-4" style={{ borderBottom: `2px solid ${player.color}` }}>
        <div className="player-info flex items-center">
          <div className="avatar w-8 h-8 rounded-full mr-2" style={{ backgroundColor: player.color }} />
          <div>
            <div className="current-player font-bold">{player.name}</div>
            <div className="streak">
              Sequência: {streak} {streak >= 8 && `(${getStreakMultiplier(streak)}x)`}
            </div>
          </div>
        </div>
        
        <div className="score text-right">
          <div className="current-score text-2xl font-bold">{score}</div>
          <ProgressBar value={songProgress} max={100} />
        </div>
      </div>
      
      {/* Área principal de jogo com visualização de notas */}
      <div className="game-main flex-grow relative">
        <canvas 
          ref={canvasRef}
          className="note-highway w-full h-full"
        />
        
        {/* Indicador de tom (pitch) */}
        <div className="pitch-indicator absolute right-4 top-1/2 transform -translate-y-1/2">
          <PitchIndicator 
            currentPitch={detectedPitch}
            targetPitch={targetPitch}
            playerColor={player.color}
          />
        </div>
      </div>
      
      {/* Área de letras na parte inferior */}
      <div className="lyrics-container bg-opacity-50 bg-black p-4 text-center">
        <div className="current-lyric text-2xl font-bold">
          {currentLyric}
        </div>
        <div className="next-lyric text-gray-400">
          {nextLyric}
        </div>
      </div>
      
      {/* Botão para abandonar/pular */}
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowQuitDialog(true)}
        >
          Pular
        </Button>
      </div>
    </div>
  );
};
```

### 5. Tela de Resultados de Rodada

![Tela de Resultados](conceitos/tela-resultados.png)

Após cada música, uma tela mostra o desempenho do jogador atual:

- Pontuação obtida com classificação
- Estatísticas detalhadas (precisão, notas acertadas, sequência máxima)
- Gráficos de desempenho
- Botão "Próximo Jogador" para continuar com o próximo jogador
- Ou "Ver Placar Geral" ao final de uma rodada completa

```tsx
// Exemplo de componente da tela de resultados de rodada
const RoundResultScreen: React.FC = () => {
  const { gameState, currentPlayer, advanceToNextPlayer, showScoreboard } = useGameContext();
  const { songId, roundScore } = useParams();
  
  // Obter jogador atual e sua pontuação
  const player = gameState.players[currentPlayer];
  const playerScore = roundScore; // Performance na música que acabou de cantar
  
  // Verificar se todos os jogadores já cantaram nesta rodada
  const isRoundComplete = gameState.currentRound % gameState.players.length === 0;
  
  return (
    <div className="results-screen container mx-auto py-8 px-4">
      <div className="player-info flex items-center mb-6">
        <div className="avatar w-12 h-12 rounded-full mr-4" style={{ backgroundColor: player.color }} />
        <h1 className="text-3xl font-bold">{player.name}</h1>
      </div>
      
      <div className="score-display text-center mb-10">
        <div className="text-5xl font-bold mb-2">{playerScore.score}</div>
        <div className="text-xl">pontos</div>
        <div className="accuracy mt-2">
          Precisão: {playerScore.accuracyPercentage.toFixed(1)}%
        </div>
      </div>
      
      <div className="detailed-stats">
        <h2 className="text-xl font-bold mb-4">Estatísticas</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard label="Notas Acertadas" value={playerScore.noteHits} />
          <StatCard label="Notas Erradas" value={playerScore.noteMisses} />
          <StatCard label="Sequência Máxima" value={playerScore.longestStreak} />
          <StatCard label="Posição no Ranking" value={`${playerScore.rank}º`} />
        </div>
        
        <PitchChart 
          actualPitches={playerScore.actualPitches}
          expectedPitches={playerScore.expectedPitches}
          times={playerScore.pitchTimes}
          playerColor={player.color}
        />
      </div>
      
      <div className="mt-10 flex justify-center">
        {isRoundComplete ? (
          <Button 
            variant="primary" 
            onClick={showScoreboard}
          >
            Ver Placar Geral
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={advanceToNextPlayer}
          >
            Próximo Jogador
          </Button>
        )}
      </div>
    </div>
  );
};
```

### 6. Placar Geral

![Placar Geral](conceitos/placar-geral.png)

Após completar uma rodada (todos os jogadores cantaram), o placar geral é exibido:

- Ranking dos jogadores com pontuação total
- Estatísticas comparativas
- Botão "Próxima Rodada" para continuar o jogo
- Ou "Finalizar Jogo" se for a última rodada

```tsx
// Exemplo de componente de placar geral
const ScoreboardScreen: React.FC = () => {
  const { gameState, startNextRound, endGame } = useGameContext();
  
  // Ordenar jogadores por pontuação
  const sortedPlayers = [...gameState.players].sort((a, b) => b.totalScore - a.totalScore);
  
  // Verificar se é a última rodada
  const isLastRound = gameState.maxRounds > 0 && gameState.currentRound >= gameState.maxRounds;
  
  return (
    <div className="scoreboard-screen container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Placar Geral</h1>
      <h2 className="text-xl text-center mb-10">
        Após Rodada {gameState.currentRound} {gameState.maxRounds > 0 && `de ${gameState.maxRounds}`}
      </h2>
      
      <div className="podium flex justify-around items-end mb-12">
        {sortedPlayers.slice(0, 3).map((player, index) => (
          <div 
            key={player.id}
            className="podium-place flex flex-col items-center"
          >
            <div className="place-number text-2xl font-bold mb-2">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </div>
            <div 
              className="avatar w-16 h-16 rounded-full mb-2"
              style={{ backgroundColor: player.color }}
            />
            <div className="player-name font-bold">{player.name}</div>
            <div className="player-score text-2xl mt-1">{player.totalScore}</div>
            <div 
              className="podium-bar mt-2"
              style={{ 
                backgroundColor: player.color,
                height: `${80 - (index * 20)}px`,
                width: '60px'
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="all-players-scores mb-10">
        <h3 className="text-lg font-bold mb-4">Todas as Pontuações</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left pb-2">Jogador</th>
              <th className="text-right pb-2">Pontuação</th>
              <th className="text-right pb-2">Melhor Música</th>
              <th className="text-right pb-2">Precisão Média</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={player.id} className="border-b border-gray-800">
                <td className="py-3 flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: player.color }}
                  />
                  {player.name}
                </td>
                <td className="text-right">{player.totalScore}</td>
                <td className="text-right">{player.bestSongTitle}</td>
                <td className="text-right">{player.averageAccuracy.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-10 flex justify-center">
        {isLastRound ? (
          <Button 
            variant="primary" 
            onClick={endGame}
          >
            Finalizar Jogo
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={startNextRound}
          >
            Próxima Rodada
          </Button>
        )}
      </div>
    </div>
  );
};
```

### 7. Tela de Resultados Finais

Após concluir todas as rodadas, a tela de resultados finais exibe:

- Pódio dos vencedores com efeitos visuais
- Estatísticas completas da sessão
- Histórico de músicas cantadas
- Opções para "Novo Jogo" ou "Voltar ao Menu"

```tsx
// Exemplo de componente da tela de resultados finais
const FinalResultsScreen: React.FC = () => {
  const { gameState, resetGame } = useGameContext();
  
  // Ordenar jogadores por pontuação final
  const sortedPlayers = [...gameState.players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];
  
  return (
    <div className="final-results container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Fim de Jogo!</h1>
      
      <div className="winner-celebration text-center mb-12">
        <div className="text-2xl mb-2">🎉 Vencedor 🎉</div>
        <div 
          className="avatar w-24 h-24 rounded-full mx-auto mb-4"
          style={{ backgroundColor: winner.color }}
        />
        <div className="winner-name text-4xl font-bold" style={{ color: winner.color }}>
          {winner.name}
        </div>
        <div className="winner-score text-2xl mt-2">
          {winner.totalScore} pontos
        </div>
      </div>
      
      <div className="session-stats mb-10">
        <h2 className="text-xl font-bold mb-4">Estatísticas da Sessão</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded p-4">
            <h3 className="font-bold mb-2">Total de Músicas Cantadas</h3>
            <div className="text-2xl">{gameState.rounds.length}</div>
          </div>
          
          <div className="bg-gray-800 rounded p-4">
            <h3 className="font-bold mb-2">Melhor Performance</h3>
            <div className="text-lg">{gameState.bestSongPerformance.playerName}</div>
            <div className="text-sm text-gray-400">{gameState.bestSongPerformance.songTitle}</div>
            <div className="text-lg mt-1">{gameState.bestSongPerformance.score} pontos</div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 flex justify-center space-x-4">
        <Button 
          variant="secondary" 
          onClick={() => {
            resetGame();
            navigate('/player-selection');
          }}
        >
          Novo Jogo
        </Button>
        
        <Button 
          variant="primary" 
          onClick={() => {
            resetGame();
            navigate('/');
          }}
        >
          Menu Principal
        </Button>
      </div>
    </div>
  );
};
```

## 🎨 Sistema de Design

### Tema e Paleta de Cores

Inspirado no Yousician, o tema é escuro e moderno:

- **Cores Primárias**:
  - Preto: `#121212` (Fundo principal)
  - Azul Escuro: `#1A1E2A` (Elementos secundários)
  - Verde: `#42C86A` (Destaque/Acerto)
  - Roxo: `#8367C7` (Acentos/Elementos interativos)

- **Cores de Jogadores**:
  - Verde: `#42C86A` (Jogador 1)
  - Vermelho: `#FF5252` (Jogador 2)
  - Amarelo: `#FFCD56` (Jogador 3)
  - Roxo: `#8367C7` (Jogador 4)

- **Cores Funcionais**:
  - Verde: `#42C86A` (Tom correto/Acerto)
  - Vermelho: `#FF5252` (Tom incorreto/Erro)
  - Amarelo: `#FFCD56` (Aviso/Tom quase correto)
  - Cinza: `#2A2A2A` (Elementos inativos)

- **Tipografia**:
  - Primária: Montserrat (Títulos e elementos destacados)
  - Secundária: Roboto (Texto e elementos de interface)

## 🎮 Interações e Feedback

### Feedback Sonoro

Além do feedback visual, o jogo oferece feedback sonoro para diferentes eventos:

```typescript
// Sistema de feedback sonoro
const SoundEffects = {
  noteHit: new Audio('/sounds/note-hit.mp3'),
  noteMiss: new Audio('/sounds/note-miss.mp3'),
  streakMilestone: new Audio('/sounds/streak.mp3'),
  gameStart: new Audio('/sounds/game-start.mp3'),
  gameEnd: new Audio('/sounds/game-end.mp3'),
  
  playNoteHit() {
    this.noteHit.currentTime = 0;
    this.noteHit.play();
  },
  
  playNoteMiss() {
    this.noteMiss.currentTime = 0;
    this.noteMiss.play();
  },
  
  playStreakMilestone() {
    this.streakMilestone.currentTime = 0;
    this.streakMilestone.play();
  }
};
```

### Animações e Efeitos Visuais

Animações são usadas para tornar a experiência mais dinâmica:

```typescript
// Efeitos visuais para eventos de jogo
const VisualEffects = {
  // Efeito de flash na tela quando o jogador acerta uma nota perfeita
  flashScreen(color) {
    const flashOverlay = document.createElement('div');
    flashOverlay.className = 'flash-overlay';
    flashOverlay.style.backgroundColor = color;
    flashOverlay.style.opacity = '0.3';
    
    document.body.appendChild(flashOverlay);
    
    // Animar e remover
    setTimeout(() => {
      flashOverlay.style.opacity = '0';
      setTimeout(() => flashOverlay.remove(), 300);
    }, 50);
  },
  
  // Efeito de partículas para grandes sequências
  createStreakParticles(count) {
    // Implementação de sistema de partículas
    // omitida para brevidade
  },
  
  // Animação de pontuação
  animateScoreIncrease(element, amount) {
    // Clone do elemento para criar animação
    const clone = element.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.color = '#42C86A';
    clone.textContent = `+${amount}`;
    
    // Posicionar e animar
    // Implementação omitida para brevidade
  }
};
```

## 📱 Responsividade

O layout se adapta a diferentes tamanhos de tela:

```css
/* Exemplo de estilos responsivos (usando TailwindCSS) */

/* Mobile (base) */
.game-screen {
  flex-direction: column;
}

.lyrics-container {
  height: 20vh;
}

/* Tablet */
@media (min-width: 768px) {
  .game-header {
    padding: 1rem 2rem;
  }
  
  .lyrics-container {
    height: 15vh;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .game-screen {
    flex-direction: row;
  }
  
  .game-main {
    flex: 1;
  }
  
  .lyrics-container {
    width: 100%;
    height: 12vh;
  }
}
```

## 🛠️ Componentes Avançados

### Visualizador de Curva de Tom (Pitch)

Para análise pós-jogo, um componente que mostra o tom cantado vs. esperado:

```tsx
// Componente para visualização de precisão de tom
const PitchChart: React.FC<PitchChartProps> = ({ 
  actualPitches, 
  expectedPitches,
  times 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Desenhar linha de referência
    ctx.strokeStyle = '#666666';
    ctx.beginPath();
    ctx.moveTo(0, canvasRef.current.height / 2);
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
    ctx.stroke();
    
    // Desenhar linha de pitch esperado
    ctx.strokeStyle = '#AAAAAA';
    ctx.beginPath();
    expectedPitches.forEach((pitch, i) => {
      const x = (times[i] / times[times.length - 1]) * canvasRef.current!.width;
      const y = canvasRef.current!.height - ((pitch / 1000) * canvasRef.current!.height);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Desenhar linha de pitch real
    ctx.strokeStyle = '#42C86A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    actualPitches.forEach((pitch, i) => {
      if (!pitch) return; // Pular valores nulos (silêncio)
      
      const x = (times[i] / times[times.length - 1]) * canvasRef.current!.width;
      const y = canvasRef.current!.height - ((pitch / 1000) * canvasRef.current!.height);
      
      if (i === 0 || !actualPitches[i-1]) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }, [actualPitches, expectedPitches, times]);
  
  return (
    <div className="pitch-chart">
      <h3 className="text-lg font-bold mb-2">Precisão de Tom</h3>
      <canvas 
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full h-48 bg-gray-900 rounded"
      />
      <div className="flex justify-between text-xs mt-1">
        <span>Início</span>
        <span>Fim</span>
      </div>
    </div>
  );
};
```

### Heatmap de Notas

Para visualizar as áreas onde o jogador teve mais dificuldade:

```tsx
// Componente de mapa de calor de notas
const NoteHeatmap: React.FC<NoteHeatmapProps> = ({ noteScores }) => {
  // Agrupar notas por tom (pitch)
  const pitchGroups = groupByPitch(noteScores);
  
  return (
    <div className="note-heatmap">
      <h3 className="text-lg font-bold mb-2">Desempenho por Tom</h3>
      
      <div className="grid grid-cols-12 gap-1">
        {Object.entries(pitchGroups).map(([pitch, notes]) => {
          // Calcular precisão média para este tom
          const avgAccuracy = calculateAverage(notes.map(n => n.accuracy));
          
          // Determinar cor com base na precisão
          const heatColor = getHeatColor(avgAccuracy);
          
          return (
            <div 
              key={pitch}
              className="pitch-cell p-2 rounded text-center text-xs"
              style={{ backgroundColor: heatColor }}
            >
              <div className="font-bold">{pitch}</div>
              <div>{Math.round(avgAccuracy)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

## 🎨 Protótipos e Conceitos

Esta seção apresenta apenas referências visuais conceituais. Os elementos finais serão desenvolvidos durante a implementação do projeto, seguindo o estilo visual inspirado no Yousician.

---

Este documento serve como referência para a implementação da interface do usuário e experiência de jogo do projeto Karaokê Competitivo. O design visual e interativo segue a inspiração do Yousician, com um tema escuro, moderno e elementos visuais intuitivos para guiar o jogador durante o karaokê. 