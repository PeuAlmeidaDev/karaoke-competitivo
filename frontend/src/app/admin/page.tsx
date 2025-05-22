'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SongForm } from '@/components/ui';

export default function AdminPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    setSuccessMessage('Música adicionada com sucesso!');
    
    // Limpar a mensagem após 3 segundos
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administração</h1>
          <Link href="/" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm">
            Voltar para Home
          </Link>
        </div>

        {successMessage && (
          <div className="bg-green-600 text-white p-4 rounded-md mb-6 animate-fade-in-out">
            {successMessage}
          </div>
        )}

        <SongForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
} 