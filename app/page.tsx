import Link from 'next/link';
import { Scissors, Calendar, LogIn, MapPin, Clock, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen text-zinc-100 font-sans" style={{ backgroundColor: '#18181b' }}>
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between p-6 md:px-12 border-b border-zinc-800/50 backdrop-blur-md sticky top-0 z-50 bg-[#18181b]/80">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg text-white">
            <Scissors size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-wide">BarberPro</h1>
        </div>
        
        {/* BOTÃO COM O CAMINHO CORRIGIDO: /auth/login */}
        <Link 
          href="/auth/login" 
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700/50"
        >
          <LogIn size={16} />
          <span>Área do Barbeiro</span>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 md:pt-32 md:pb-32 max-w-4xl mx-auto">
        <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
          A Melhor Barbearia da Região
        </span>
        
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white">
          Estilo e confiança em <br />
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            cada detalhe.
          </span>
        </h2>
        
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl">
          Agende seu horário em poucos cliques. Oferecemos cortes modernos, barba na toalha quente e um ambiente premium para você relaxar.
        </p>

        <Link 
          href="/agendar" 
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Calendar size={20} />
          Agendar meu Horário
        </Link>
      </main>

      {/* INFO CARDS */}
      <section className="px-6 pb-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e1e24] p-8 rounded-2xl border border-zinc-800/50 text-center group hover:border-orange-500/30 transition-colors">
          <Clock className="mx-auto text-orange-500 mb-4" size={32} />
          <h3 className="text-lg font-bold text-white mb-2">Horário</h3>
          <p className="text-zinc-400 text-sm font-medium">Segunda a Sábado<br/>09:00 às 20:00</p>
        </div>

        <div className="bg-[#1e1e24] p-8 rounded-2xl border border-zinc-800/50 text-center group hover:border-orange-500/30 transition-colors">
          <Star className="mx-auto text-orange-500 mb-4" size={32} />
          <h3 className="text-lg font-bold text-white mb-2">Qualidade</h3>
          <p className="text-zinc-400 text-sm font-medium">Profissionais treinados e os melhores produtos do mercado.</p>
        </div>

        <div className="bg-[#1e1e24] p-8 rounded-2xl border border-zinc-800/50 text-center group hover:border-orange-500/30 transition-colors">
          <MapPin className="mx-auto text-orange-500 mb-4" size={32} />
          <h3 className="text-lg font-bold text-white mb-2">Localização</h3>
          <p className="text-zinc-400 text-sm font-medium">Rua das Barbearias, 123<br/>Bairro Premium - Sua Cidade</p>
        </div>
      </section>

    </div>
  );
}