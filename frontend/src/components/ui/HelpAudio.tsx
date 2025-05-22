import React, { useState } from 'react';

export default function HelpAudio() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          className="w-4 h-4 mr-1"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" 
            clipRule="evenodd" 
          />
        </svg>
        Como adicionar áudio
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-gray-900 rounded-lg border border-gray-700 text-sm">
          <h3 className="text-white font-medium mb-2">Como adicionar áudio corretamente:</h3>
          
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>
              <strong>Use apenas URLs diretos para arquivos de áudio</strong> - O player de áudio só suporta URLs que apontam diretamente para arquivos de formato de áudio (.mp3, .wav, .ogg).
            </li>
            <li>
              <strong>Formatos suportados:</strong> .mp3, .wav, .ogg, .m4a, .aac
            </li>
            <li>
              <strong>Não são suportados:</strong> Links do YouTube, Spotify, SoundCloud ou outras plataformas de streaming que não fornecem acesso direto ao arquivo.
            </li>
            <li>
              <strong>Hospedagem recomendada:</strong> Você pode usar serviços de armazenamento como Google Drive, Dropbox ou GitHub, mas precisa gerar um link direto para o arquivo.
            </li>
          </ul>

          <div className="mt-3">
            <h4 className="text-white font-medium mb-1">Exemplo de URLs válidas:</h4>
            <code className="block bg-gray-800 p-2 rounded overflow-x-auto text-green-400">
              https://exemplo.com/musicas/cancion.mp3<br/>
              https://storage.googleapis.com/nome-bucket/audio.wav<br/>
              https://raw.githubusercontent.com/usuario/repo/main/audio.mp3
            </code>
          </div>

          <div className="mt-3">
            <h4 className="text-white font-medium mb-1">Exemplo de URLs inválidas:</h4>
            <code className="block bg-gray-800 p-2 rounded overflow-x-auto text-red-400">
              https://www.youtube.com/watch?v=dQw4w9WgXcQ<br/>
              https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT<br/>
              https://soundcloud.com/artista/musica
            </code>
          </div>

          <div className="mt-4 bg-blue-900/30 p-3 rounded border border-blue-800/50">
            <p className="text-blue-300">
              <strong>Dica:</strong> Se você não tem onde hospedar seus arquivos de áudio, 
              considere usar o Github ou serviços como Firebase Storage, Amazon S3, ou 
              outras plataformas de armazenamento que fornecem URLs diretos para arquivos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 