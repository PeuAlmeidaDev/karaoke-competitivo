interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
  audioUrl?: string;
  lyrics?: any[]; // Tipo array para corresponder ao formato do backend
}

const API_URL = 'http://localhost:5000/api';

export const getSongs = async (): Promise<Song[]> => {
  try {
    const response = await fetch(`${API_URL}/songs`);
    console.log('Resposta da API:', response);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar músicas: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Dados recebidos:', responseData);
    
    // Mapeia os dados recebidos para o formato esperado pelo frontend
    const songs = responseData.data ? responseData.data.map((song: any) => ({
      id: song._id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      audioUrl: song.audioUrl,
      // Converte a dificuldade do formato do backend para o formato do frontend
      difficulty: convertDifficulty(song.difficulty)
    })) : [];
    
    return songs;
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
    return [];
  }
};

// Função auxiliar para converter o formato de dificuldade
const convertDifficulty = (difficulty: string): "Fácil" | "Médio" | "Difícil" => {
  switch (difficulty) {
    case 'easy':
      return 'Fácil';
    case 'medium':
      return 'Médio';
    case 'hard':
      return 'Difícil';
    default:
      return 'Médio';
  }
};

export const getSongById = async (id: string): Promise<Song | null> => {
  try {
    const response = await fetch(`${API_URL}/songs/${id}`);
    console.log('Resposta da API (getSongById):', response);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar música: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Dados recebidos (getSongById):', responseData);
    
    if (!responseData.data) {
      return null;
    }
    
    const song = responseData.data;
    return {
      id: song._id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      difficulty: convertDifficulty(song.difficulty),
      audioUrl: song.audioUrl,
      lyrics: song.lyrics
    };
  } catch (error) {
    console.error(`Erro ao buscar música com ID ${id}:`, error);
    return null;
  }
};

// Função para obter apenas a letra de uma música
export const getLyricsBySongId = async (id: string): Promise<any[] | null> => {
  try {
    const response = await fetch(`${API_URL}/songs/${id}/lyrics`);
    console.log('Resposta da API (getLyricsBySongId):', response);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar letras: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Dados de letras recebidos:', responseData);
    
    if (!responseData.data) {
      return null;
    }
    
    return responseData.data;
  } catch (error) {
    console.error(`Erro ao buscar letras da música ${id}:`, error);
    return null;
  }
}; 