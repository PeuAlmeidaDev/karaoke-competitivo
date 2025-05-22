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

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

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

  const filteredSongs = songs.filter(song => {
    const matchesText = song.title.toLowerCase().includes(filter.toLowerCase()) || 
                       song.artist.toLowerCase().includes(filter.toLowerCase());
                        
    const matchesDifficulty = difficultyFilter === null || song.difficulty === difficultyFilter;
    
    return matchesText && matchesDifficulty;
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold text-white mb-6">Biblioteca de Músicas</h1>
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input 
                  type="text" 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  placeholder="Buscar por título ou artista..." 
                />
              </div>
            </div>
            
            <div>
              <select 
                value={difficultyFilter || ""}
                onChange={(e) => setDifficultyFilter(e.target.value === "" ? null : e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Todas dificuldades</option>
                <option value="Fácil">Fácil</option>
                <option value="Médio">Médio</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Carregando músicas...</p>
            </div>
          ) : filteredSongs.length === 0 ? (
            <div className="text-center py-16 bg-black/30 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-400">Nenhuma música encontrada</p>
              <div className="mt-4">
                <Link 
                  href="/admin" 
                  className="inline-block text-purple-400 hover:text-purple-300"
                >
                  Adicionar músicas no painel administrativo
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-800 rounded-lg">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-l-lg">Título</th>
                    <th scope="col" className="px-6 py-3">Artista</th>
                    <th scope="col" className="px-6 py-3">Duração</th>
                    <th scope="col" className="px-6 py-3">Dificuldade</th>
                    <th scope="col" className="px-6 py-3 rounded-r-lg">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSongs.map((song) => (
                    <tr key={song.id} className="border-b border-gray-700 bg-black/30 hover:bg-black/50">
                      <td className="px-6 py-4 font-medium text-white">{song.title}</td>
                      <td className="px-6 py-4">{song.artist}</td>
                      <td className="px-6 py-4">{formatTime(song.duration)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${song.difficulty === 'Fácil' ? 'bg-green-900 text-green-300' :
                            song.difficulty === 'Médio' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-red-900 text-red-300'}`
                        }>
                          {song.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/game/play?songId=${song.id}&players=1`}
                          className="text-blue-500 hover:text-blue-400 mr-4 transition-colors"
                        >
                          Cantar
                        </Link>
                        <Link 
                          href={`/game/new?songId=${song.id}`}
                          className="text-purple-500 hover:text-purple-400 transition-colors"
                        >
                          Jogar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <Link 
              href="/game/new"
              className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Iniciar Novo Jogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 