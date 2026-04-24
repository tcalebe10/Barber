'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Scissors, Users, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Rotas atualizadas com os nomes exatos das suas pastas em inglês
  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Agenda', href: '/admin/schedule', icon: Calendar },
    { name: 'Serviços', href: '/admin/services', icon: Scissors },
    { name: 'Clientes', href: '/admin/clients', icon: Users },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="min-h-screen flex text-zinc-100 font-sans" style={{ backgroundColor: '#18181b' }}>
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1e1e24] border-r border-zinc-800 flex flex-col justify-between hidden md:flex h-screen sticky top-0">
        
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-800/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              BarberPro
            </h2>
            <button className="text-zinc-500 hover:text-zinc-300">
              <X size={20} />
            </button>
          </div>

          {/* Navegação */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              // Deixa o botão aceso se a URL atual contiver o href
              const isActive = pathname.includes(item.href);
              const Icon = item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}>
                    <Icon size={18} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Perfil / Sair */}
        <div className="p-4 border-t border-zinc-800/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 w-full"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-zinc-700">
              N
            </div>
            Sair
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto custom-scrollbar h-screen pb-10">
        {children}
      </main>

    </div>
  );
}