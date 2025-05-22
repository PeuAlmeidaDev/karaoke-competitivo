import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="flex flex-col items-center max-w-4xl px-6 py-12 mx-auto space-y-12 bg-gradient-to-b from-purple-900/40 to-blue-900/40 rounded-2xl backdrop-blur-sm border border-purple-500/20">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          <span className="block text-purple-400">Karaokê</span>
          <span className="block text-blue-400">Competitivo</span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-xl">
          Cante, compita e mostre seu talento em uma experiência de karaokê multiplayer inspirada no Yousician.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md">
          <Link 
            href="/game/new" 
            className="w-full px-8 py-4 font-bold text-center text-white transition-all bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Iniciar Jogo
          </Link>
          
          <Link 
            href="/songs" 
            className="w-full px-8 py-4 font-bold text-center text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Ver Músicas
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-3">
          <div className="p-6 transition-all bg-black/30 rounded-xl hover:bg-black/40">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">Multiplayer Local</h3>
            <p className="text-gray-400">Até 4 jogadores competindo no mesmo dispositivo</p>
          </div>
          
          <div className="p-6 transition-all bg-black/30 rounded-xl hover:bg-black/40">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">Análise Vocal</h3>
            <p className="text-gray-400">Avaliação precisa de tom e ritmo em tempo real</p>
          </div>
          
          <div className="p-6 transition-all bg-black/30 rounded-xl hover:bg-black/40">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">Ranking e Pontuação</h3>
            <p className="text-gray-400">Compare desempenhos e acompanhe sua evolução</p>
          </div>
        </div>
      </div>
      
      <footer className="py-6 mt-12 text-sm text-gray-500">
        <div className="flex flex-col items-center space-y-2">
          <div>
            &copy; {new Date().getFullYear()} Karaokê Competitivo - Todos os direitos reservados
          </div>
          <div>
            <Link 
              href="/admin" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Administração
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
