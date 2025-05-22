"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSongById, getLyricsBySongId } from "@/services/songService";

interface LyricLine {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
  audioUrl?: string;
  lyrics?: any[];
}

interface Player {
  id: number;
  name: string;
  score: number;
  turn: boolean;
}

export default function PlayGame() {
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId");
  const numPlayers = parseInt(searchParams.get("players") || "1");
  
  const [song, setSong] = useState<Song | null>(null);
  const [lyrics, setLyrics] = useState<string>('');
  const [parsedLyrics, setParsedLyrics] = useState<LyricLine[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<"setup" | "playing" | "paused" | "finished">("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const [microphone, setMicrophone] = useState<MediaStreamAudioSourceNode | null>(null);
  const [volume, setVolume] = useState(0.7);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Referência para a linha atual das letras
  const currentLineRef = useRef<HTMLDivElement>(null);
  
  // Carregar a música selecionada
  useEffect(() => {
    const fetchSong = async () => {
      if (!songId) return;
      
      try {
        const songData = await getSongById(songId);
        console.log('Dados da música:', songData);
        setSong(songData);
        
        // Buscar as letras da música
        if (songData) {
          try {
            const lyricsData = await getLyricsBySongId(songId);
            console.log('Dados da letra:', lyricsData);
            
            if (lyricsData && lyricsData.length > 0) {
              // Extrair o texto das linhas da letra
              const lyricsText = lyricsData.map((line: any) => line.text).join('\n');
              setLyrics(lyricsText);
              
              // Usar os tempos reais das letras do backend
              const processedLyrics = lyricsData.map((line: any, index: number) => {
                return {
                  id: index,
                  text: line.text,
                  startTime: line.startTime,
                  endTime: line.endTime
                };
              });
              
              setParsedLyrics(processedLyrics);
              console.log('Letras processadas com tempos reais:', processedLyrics);
            } else {
              setLyrics('Letra não disponível para esta música.');
              setParsedLyrics([]);
            }
          } catch (lyricsError) {
            console.error('Erro ao buscar letra:', lyricsError);
            setLyrics('Não foi possível carregar a letra desta música.');
            setParsedLyrics([]);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar música:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSong();
  }, [songId]);
  
  // Inicializar os jogadores
  useEffect(() => {
    const initialPlayers: Player[] = Array.from({ length: numPlayers }, (_, i) => ({
      id: i + 1,
      name: `Jogador ${i + 1}`,
      score: 0,
      turn: i === 0
    }));
    
    setPlayers(initialPlayers);
  }, [numPlayers]);
  
  // Função para iniciar o microfone
  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();
      
      analyserNode.fftSize = 2048;
      source.connect(analyserNode);
      
      setAudioContext(context);
      setAnalyzer(analyserNode);
      setMicrophone(source);
      setIsRecording(true);
      
      // Iniciar a visualização de áudio
      visualizeAudio();
      
    } catch (error) {
      console.error("Erro ao acessar o microfone:", error);
    }
  };
  
  // Visualização do áudio
  const visualizeAudio = () => {
    if (!analyzer || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    canvasContext.clearRect(0, 0, width, height);
    
    const draw = () => {
      if (!isRecording) return;
      
      requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);
      
      canvasContext.fillStyle = "#000";
      canvasContext.fillRect(0, 0, width, height);
      
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        
        // Gradiente baseado na frequência
        const hue = i / bufferLength * 360;
        canvasContext.fillStyle = `hsl(${hue}, 100%, 50%)`;
        
        canvasContext.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    
    draw();
  };
  
  // Função para atualizar o tempo da música usando o tempo real do áudio
  const updateAudioTime = () => {
    if (audioRef.current && gameState === "playing") {
      const currentTime = audioRef.current.currentTime;
      setGameTime(currentTime);
      
      // Verificar se a música está próxima do fim
      if (song && currentTime >= song.duration * 0.98) {
        setGameState("finished");
      } else {
        requestAnimationFrame(updateAudioTime);
      }
    } else {
      requestAnimationFrame(updateAudioTime);
    }
  };
  
  // Iniciar a atualização do tempo quando o áudio começar a tocar
  useEffect(() => {
    if (gameState === "playing" && audioRef.current) {
      requestAnimationFrame(updateAudioTime);
    }
  }, [gameState]);
  
  const startGame = () => {
    setGameState("playing");
    startMicrophone();
    
    // Reproduzir o áudio se disponível
    if (audioRef.current && song?.audioUrl) {
      audioRef.current.play().catch(err => {
        console.error('Erro ao reproduzir áudio:', err);
      });
    }
    
    // Iniciar o timer do jogo não é mais necessário, pois usamos o tempo real do áudio
    // O tempo será atualizado pelo efeito updateAudioTime
  };
  
  const pauseGame = () => {
    setGameState("paused");
    setIsRecording(false);
    
    if (microphone) {
      microphone.disconnect();
    }
    
    // Pausar o áudio
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  const resumeGame = () => {
    setGameState("playing");
    startMicrophone();
    
    // Retomar o áudio
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Erro ao retomar áudio:', err);
      });
    }
  };
  
  const nextPlayer = () => {
    setPlayers(currentPlayers => 
      currentPlayers.map((player, index) => ({
        ...player,
        turn: index === (currentPlayerIndex + 1) % numPlayers
      }))
    );
    
    setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % numPlayers);
  };
  
  const updatePlayerName = (id: number, name: string) => {
    setPlayers(currentPlayers => 
      currentPlayers.map(player => 
        player.id === id ? { ...player, name } : player
      )
    );
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Efeito para atualizar o volume quando ele mudar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Função para atualizar o volume
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };
  
  // Atualizar linha atual da letra com base no tempo
  useEffect(() => {
    if (gameState !== "playing" || parsedLyrics.length === 0) return;
    
    // Encontrar a linha atual com base no tempo do jogo
    const currentLine = parsedLyrics.findIndex(
      line => gameTime >= line.startTime && gameTime <= line.endTime
    );
    
    if (currentLine !== -1 && currentLine !== currentLyricIndex) {
      setCurrentLyricIndex(currentLine);
    } else if (gameTime > 0 && currentLine === -1 && currentLyricIndex !== -1) {
      // Se não encontrarmos uma linha ativa, verificar se passamos da última linha
      const lastLine = parsedLyrics[parsedLyrics.length - 1];
      if (gameTime > lastLine.endTime) {
        setCurrentLyricIndex(-1); // Nenhuma linha ativa
      }
    }
  }, [gameTime, parsedLyrics, gameState, currentLyricIndex]);
  
  // Efeito para rolar automaticamente para a linha atual
  useEffect(() => {
    if (currentLineRef.current && currentLyricIndex >= 0) {
      currentLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentLyricIndex]);
  
  // Efeito para debugar a sincronização do tempo
  useEffect(() => {
    if (gameState === "playing" && parsedLyrics.length > 0) {
      console.log(`Tempo atual: ${gameTime}s, Linha atual: ${currentLyricIndex}`);
      
      if (currentLyricIndex >= 0 && currentLyricIndex < parsedLyrics.length) {
        console.log(`Linha: "${parsedLyrics[currentLyricIndex].text}", Tempo: ${parsedLyrics[currentLyricIndex].startTime.toFixed(1)}s - ${parsedLyrics[currentLyricIndex].endTime.toFixed(1)}s`);
      }
    }
  }, [gameTime, currentLyricIndex, parsedLyrics, gameState]);
  
  // Exibir as letras no estilo karaokê
  const renderLyrics = () => {
    if (parsedLyrics.length === 0) {
      return <p className="text-xl text-gray-400 my-8">Letra não disponível</p>;
    }
    
    return (
      <div className="flex flex-col items-center w-full h-full overflow-y-auto py-8 px-4 karaoke-scroll">
        {/* Espaço vazio no início para centralizar melhor */}
        <div className="h-40"></div>
        
        {parsedLyrics.map((line, index) => {
          // Definir a aparência da linha com base no estado atual
          const isPrevious = index < currentLyricIndex;
          const isCurrent = index === currentLyricIndex;
          const isNext = index > currentLyricIndex && index <= currentLyricIndex + 3;
          const isDistant = !isPrevious && !isCurrent && !isNext;
          
          // Estilizar a linha com base na sua posição relativa à linha atual
          let lineStyle = "transition-all duration-500 my-4 text-2xl max-w-3xl text-center ";
          
          if (isCurrent) {
            lineStyle += "text-purple-300 font-bold scale-110 text-3xl";
          } else if (isPrevious) {
            lineStyle += "text-gray-500 opacity-60";
          } else if (isNext) {
            lineStyle += "text-gray-300";
          } else {
            lineStyle += "text-gray-600 opacity-30";
          }
          
          return (
            <div 
              key={line.id} 
              ref={isCurrent ? currentLineRef : null}
              className={lineStyle}
            >
              {line.text}
            </div>
          );
        })}
        
        {/* Espaço vazio no final para centralizar melhor */}
        <div className="h-40"></div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Carregando jogo...</p>
        </div>
      </div>
    );
  }
  
  if (!song) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-red-900/40 rounded-2xl backdrop-blur-sm border border-red-500/20 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-white mt-4">Música não encontrada</h1>
          <p className="text-gray-400 mt-2">Não foi possível carregar a música selecionada.</p>
          <Link 
            href="/game/new" 
            className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Voltar para seleção de músicas
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Elemento de áudio oculto */}
      {song?.audioUrl && (
        <audio 
          ref={audioRef}
          src={song.audioUrl}
          preload="auto"
          style={{ display: 'none' }}
          onEnded={() => {
            if (gameState === "playing") {
              setGameState("finished");
            }
          }}
        />
      )}
      
      <div className="max-w-6xl mx-auto">
        {gameState === "setup" && (
            <div className="bg-gradient-to-b from-purple-900/40 to-blue-900/40 rounded-2xl backdrop-blur-sm border border-purple-500/20 p-8">
                <h1 className="text-3xl font-bold text-white mb-6">Configuração do Jogo</h1>
                
            <div className="mb-6">
              <h2 className="text-xl text-white mb-3">Detalhes da música</h2>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h3 className="text-lg font-medium text-white">{song.title}</h3>
                    <p className="text-gray-400">{song.artist}</p>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <span className="text-gray-400">Duração: {formatTime(song.duration)}</span>
                    <span className={`ml-4 
                      ${song.difficulty === 'Fácil' ? 'text-green-400' : 
                        song.difficulty === 'Médio' ? 'text-yellow-400' : 'text-red-400'}
                    `}>
                      {song.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl text-white mb-3">Jogadores</h2>
              <div className="space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center space-x-4 bg-black/30 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {player.id}
                    </div>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayerName(player.id, e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nome do jogador"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Link 
                href="/game/new" 
                className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                Voltar
              </Link>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Iniciar Jogo
              </button>
            </div>
          </div>
        )}
        
        {(gameState === "playing" || gameState === "paused") && (
          <div className="bg-gradient-to-b from-purple-900/40 to-blue-900/40 rounded-2xl backdrop-blur-sm border border-purple-500/20 p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">{song.title} - {song.artist}</h1>
              <div className="flex items-center space-x-4">
                {/* Controle de Volume */}
                <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-3 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    {volume === 0 ? (
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    ) : volume < 0.4 ? (
                      <path fillRule="evenodd" d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25v-12.5zM11.5 10a2.25 2.25 0 001.248-4.119.75.75 0 00-.752 1.298A.75.75 0 1111.5 10z" />
                    ) : volume < 0.7 ? (
                      <path fillRule="evenodd" d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25v-12.5zM12.5 10a3.75 3.75 0 002.083-6.865.75.75 0 10-.833 1.248 2.25 2.25 0 01-1.25 4.117z" />
                    ) : (
                      <path fillRule="evenodd" d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25v-12.5zM14.324 4.615a.75.75 0 011.06 0 8.25 8.25 0 010 11.67.75.75 0 11-1.06-1.06 6.75 6.75 0 000-9.55.75.75 0 010-1.06zM11.54 7.399a.75.75 0 011.06 0 4.5 4.5 0 010 6.363.75.75 0 01-1.06-1.06 3 3 0 000-4.242.75.75 0 010-1.06z" />
                    )}
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-purple-500"
                  />
                </div>
                
                <div className="text-lg text-white font-mono">
                  {formatTime(gameTime)} / {formatTime(song.duration)}
                </div>
                {gameState === "playing" ? (
                  <button 
                    onClick={pauseGame}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                ) : (
                  <button 
                    onClick={resumeGame}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-9">
                {/* Visualização do karaokê */}
                <div className="bg-black rounded-lg p-4 h-[450px] mb-4 flex flex-col">
                  <div className="text-center text-white flex-1 overflow-hidden relative">
                    {renderLyrics()}
                    
                    {/* Indicador da linha atual */}
                  </div>
                  
                  <canvas 
                    ref={canvasRef} 
                    className="rounded w-full h-36 bg-black/50 mt-4"
                    width={800}
                    height={200}
                  />
                  
                  <div className="mt-4 flex justify-center">
                    <div className="bg-gray-800 rounded-full px-4 py-2 flex items-center space-x-2">
                      <span className="text-white">Microfone: </span>
                      <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-white">{isRecording ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-12 lg:col-span-3">
                <div className="bg-black/50 rounded-lg p-4 h-full">
                  <h2 className="text-lg font-bold text-white mb-3">Jogadores</h2>
                  <div className="space-y-3">
                    {players.map((player) => (
                      <div 
                        key={player.id} 
                        className={`p-3 rounded-lg ${player.turn ? 'bg-purple-900/60 border border-purple-500' : 'bg-gray-800/60'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{player.name}</span>
                          <span className="text-yellow-400 font-bold">{player.score}</span>
                        </div>
                        {player.turn && (
                          <div className="mt-2 text-sm text-purple-300">
                            Cantando agora...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {players.length > 1 && (
                    <button
                      onClick={nextPlayer}
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Próximo Jogador
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {gameState === "finished" && (
          <div className="bg-gradient-to-b from-purple-900/40 to-blue-900/40 rounded-2xl backdrop-blur-sm border border-purple-500/20 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Jogo Finalizado!</h1>
            
            <div className="bg-black/30 p-6 rounded-lg mb-8">
              <h2 className="text-2xl text-white mb-4">Pontuações</h2>
              
              <div className="space-y-4">
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between bg-gray-800/60 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3
                          ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-purple-600'}
                        `}>
                          {index + 1}
                        </div>
                        <span className="text-white text-lg font-medium">{player.name}</span>
                      </div>
                      <span className="text-yellow-400 text-xl font-bold">{player.score}</span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/game/new" 
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Jogar Outra Música
              </Link>
              <Link 
                href="/" 
                className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 