"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSongs } from "@/services/songService";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
}

export default function NewGame() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [players, setPlayers] = useState(1);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const fetchedSongs = await getSongs();
        setSongs(fetchedSongs);
      } catch (error) {
        console.error("Erro ao buscar músicas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleStartGame = () => {
    if (!selectedSong) return;
    // Implementação futura: redirecionamento para a página do jogo com a música selecionada
    window.location.href = `/game/play?songId=${selectedSong}&players=${players}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Voltar para a página inicial
          </Link>
        </div>

        <div className="bg-gradient-to-b from-purple-900/40 to-blue-900/40 rounded-2xl backdrop-blur-sm border border-purple-500/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Novo Jogo</h1>
          
          <div className="mb-8">
            <h2 className="text-xl text-white mb-4">Número de Jogadores</h2>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setPlayers(num)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all
                    ${players === num 
                      ? 'bg-purple-600 text-white ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl text-white mb-4">Selecione uma música</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Carregando músicas...</p>
              </div>
            ) : songs.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-400">Nenhuma música encontrada</p>
                <Link 
                  href="/admin" 
                  className="mt-4 inline-block text-purple-400 hover:text-purple-300"
                >
                  Adicionar músicas no painel administrativo
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => setSelectedSong(song.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all
                      ${selectedSong === song.id
                        ? 'bg-purple-700/60 border-2 border-purple-500'
                        : 'bg-gray-800/60 hover:bg-gray-700/60 border-2 border-transparent'}`}
                  >
                    <h3 className="text-lg font-medium text-white">{song.title}</h3>
                    <p className="text-gray-400">{song.artist}</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-400">Duração: {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                      <span className={`
                        ${song.difficulty === 'Fácil' ? 'text-green-400' : 
                          song.difficulty === 'Médio' ? 'text-yellow-400' : 'text-red-400'}
                      `}>
                        {song.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleStartGame}
              disabled={!selectedSong}
              className={`px-8 py-3 rounded-full font-bold transition-all
                ${selectedSong
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            >
              Iniciar Jogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 