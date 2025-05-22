import { ApiResponse } from '../../../shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Função genérica para fazer requisições à API
 */
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao conectar com o servidor');
    }

    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
    };
  }
}

/**
 * Serviços da API organizados por recursos
 */
export const api = {
  songs: {
    getAll: () => fetchApi('/songs'),
    getById: (id: string) => fetchApi(`/songs/${id}`),
    getLyrics: (id: string) => fetchApi(`/songs/${id}/lyrics`),
    create: (song: any) => 
      fetchApi('/songs', {
        method: 'POST',
        body: JSON.stringify(song),
      }),
    update: (id: string, song: any) =>
      fetchApi(`/songs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(song),
      }),
    delete: (id: string) =>
      fetchApi(`/songs/${id}`, {
        method: 'DELETE',
      }),
  },
};

export default api; 