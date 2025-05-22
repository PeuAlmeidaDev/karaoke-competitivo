import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karaokê Competitivo",
  description: "Aplicativo de karaokê competitivo inspirado no Yousician",
  keywords: ["karaokê", "música", "competição", "canto", "multiplayer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white min-h-screen`}
      >
        {/* Fundo gradiente principal */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-gray-950 to-black -z-10" />
        
        {/* Padrão de pontos */}
        <div className="fixed inset-0 bg-black/20 -z-10" style={{ 
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, 
          backgroundSize: '30px 30px' 
        }} />
        
        {/* Brilhos */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl -z-10" />
        <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl -z-10" />
        <div className="fixed bottom-1/3 left-1/3 w-64 h-64 bg-pink-500 rounded-full opacity-10 blur-3xl -z-10" />
        
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
