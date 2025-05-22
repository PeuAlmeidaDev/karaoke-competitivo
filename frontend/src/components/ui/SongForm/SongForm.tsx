'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HelpAudio from '../HelpAudio';

// Interface para tipagem dos objetos de letra
interface LyricLine {
  startTime: number;
  endTime: number;
  text: string;
  notes: any[]; // Array vazio ou com notas
}

interface SongFormProps {
  onSuccess?: () => void;
}

export default function SongForm({ onSuccess }: SongFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    difficulty: 'medium', // easy, medium, hard
    duration: 0,
    bpm: 120, // Adicionando campo BPM
    key: 'C', // Adicionando campo key (tonalidade)
    coverImageUrl: '',
    audioUrl: '',
    lyrics: [{ 
      startTime: 0,
      endTime: 0,
      text: '',
      notes: [] // Adicionando array vazio de notas conforme exigido pelo modelo
    }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao adicionar música';
        try {
          // Tenta fazer o parse da resposta como JSON
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Se falhar no parse, usa o status text da resposta
          errorMessage = `Erro: ${response.status} ${response.statusText || 'Sem detalhes'}`;
          console.error('Erro ao fazer parse da resposta:', parseError);
        }
        throw new Error(errorMessage);
      }

      setFormData({
        title: '',
        artist: '',
        difficulty: 'medium',
        duration: 0,
        bpm: 120,
        key: 'C',
        coverImageUrl: '',
        audioUrl: '',
        lyrics: [{ startTime: 0, endTime: 0, text: '', notes: [] }]
      });

      if (onSuccess) {
        onSuccess();
      }
      
      // Opcional: redirecionar para outra página
      // router.push('/songs');
      
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao adicionar a música');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLyricsChange = (index: number, field: string, value: any) => {
    const newLyrics = [...formData.lyrics];
    newLyrics[index] = {
      ...newLyrics[index],
      [field]: value
    };
    
    // Garante que o campo notes existe
    if (!newLyrics[index].notes) {
      newLyrics[index].notes = [];
    }
    
    setFormData({
      ...formData,
      lyrics: newLyrics
    });
  };

  const addLyricLine = () => {
    const lastLyric = formData.lyrics[formData.lyrics.length - 1];
    const newEndTime = lastLyric.endTime + 3; // Adiciona 3 segundos por padrão
    
    setFormData({
      ...formData,
      lyrics: [
        ...formData.lyrics,
        {
          startTime: lastLyric.endTime,
          endTime: newEndTime,
          text: '',
          notes: []
        }
      ]
    });
  };

  const removeLyricLine = (index: number) => {
    if (formData.lyrics.length <= 1) return;
    
    const newLyrics = formData.lyrics.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      lyrics: newLyrics
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Adicionar Nova Música</h2>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-1">
              Artista
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
              Dificuldade
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
              Duração (segundos)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="0"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bpm" className="block text-sm font-medium text-gray-300 mb-1">
              BPM (Batidas por Minuto)
            </label>
            <input
              type="number"
              id="bpm"
              name="bpm"
              value={formData.bpm}
              onChange={handleChange}
              min="1"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="key" className="block text-sm font-medium text-gray-300 mb-1">
              Tonalidade
            </label>
            <input
              type="text"
              id="key"
              name="key"
              value={formData.key}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-300 mb-1">
              URL da Imagem de Capa
            </label>
            <input
              type="url"
              id="coverImageUrl"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="audioUrl" className="block text-sm font-medium text-gray-300 mb-1">
              URL do Áudio
            </label>
            <input
              type="url"
              id="audioUrl"
              name="audioUrl"
              value={formData.audioUrl}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://exemplo.com/arquivo.mp3"
            />
            <p className="mt-1 text-xs text-gray-400">
              Insira um URL direto para um arquivo de áudio (.mp3, .wav, .ogg). <br />
              Não são suportados links do YouTube ou plataformas de streaming.
            </p>
            <HelpAudio />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Letra da Música
            </label>
            <button
              type="button"
              onClick={addLyricLine}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-md"
            >
              Adicionar Linha
            </button>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto p-2">
            {formData.lyrics.map((line, index) => (
              <div key={index} className="flex flex-col space-y-2 p-3 bg-gray-700 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Linha {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeLyricLine(index)}
                    className="text-red-500 hover:text-red-400 text-sm"
                    disabled={formData.lyrics.length <= 1}
                  >
                    Remover
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400">Tempo Inicial (s)</label>
                    <input
                      type="number"
                      value={line.startTime}
                      onChange={(e) => handleLyricsChange(index, 'startTime', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      className="w-full bg-gray-600 border border-gray-600 rounded-md py-1 px-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Tempo Final (s)</label>
                    <input
                      type="number"
                      value={line.endTime}
                      onChange={(e) => handleLyricsChange(index, 'endTime', parseFloat(e.target.value))}
                      step="0.1"
                      min={line.startTime}
                      className="w-full bg-gray-600 border border-gray-600 rounded-md py-1 px-2 text-white text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400">Texto</label>
                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => handleLyricsChange(index, 'text', e.target.value)}
                    className="w-full bg-gray-600 border border-gray-600 rounded-md py-1 px-2 text-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center space-x-2 disabled:opacity-70"
          >
            {isLoading ? 'Salvando...' : 'Salvar Música'}
          </button>
        </div>
      </form>
    </div>
  );
} 