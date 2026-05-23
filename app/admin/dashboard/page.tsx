'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, BarChart3, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBarbers: 0,
    totalClients: 0,
    totalRevenue: 0,
    totalAppointments: 0
  });

  async function fetchDashboardData() {
    setLoading(true);
    
    // 1. Total de barbeiros
    const { count: barbersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'barber');

    // 2. Total de clientes (profiles com role 'client')
    const { count: clientsCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'client');

    // 3. Total de agendamentos
    const { data: appointments, count: appointmentsCount } = await supabase
      .from('appointments')
      .select('total_price', { count: 'exact' });

    // Receita total
    const totalRevenue = appointments?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0;

    setStats({
      totalBarbers: barbersCount || 0,
      totalClients: clientsCount || 0,
      totalRevenue,
      totalAppointments: appointmentsCount || 0
    });
    
    setLoading(false);
  }

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <div className="min-h-screen p-6 md:p-8 text-zinc-100 font-sans" style={{ backgroundColor: '#18181b' }}>
      
      {/* BANNER */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 mb-8 shadow-lg shadow-orange-500/10">
        <h1 className="text-3xl font-bold text-white mb-2">Painel do Administrador</h1>
        <p className="text-orange-100 text-sm">Gerencie barbeiros, clientes e acompanhe a performance do sistema.</p>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-zinc-400 text-xs font-medium">Total de Barbeiros</p>
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Users size={16} /></div>
          </div>
          <h2 className="text-2xl font-bold">{stats.totalBarbers}</h2>
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[60%]" />
          </div>
        </div>

        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-zinc-400 text-xs font-medium">Total de Clientes</p>
            <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Users size={16} /></div>
          </div>
          <h2 className="text-2xl font-bold">{stats.totalClients}</h2>
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[80%]" />
          </div>
        </div>

        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-zinc-400 text-xs font-medium">Total de Agendamentos</p>
            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400"><BarChart3 size={16} /></div>
          </div>
          <h2 className="text-2xl font-bold">{stats.totalAppointments}</h2>
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[40%]" />
          </div>
        </div>

        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-zinc-400 text-xs font-medium">Receita Total</p>
            <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><TrendingUp size={16} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white">R$ {stats.totalRevenue.toFixed(2)}</h2>
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[75%]" />
          </div>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div>
        <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 space-y-3">
          <Link href="/admin/barbers" className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 hover:opacity-90 transition-all">
            + Cadastrar Barbeiro
          </Link>
          <Link href="/admin/barbers" className="block w-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 text-center py-3 rounded-lg text-sm font-semibold transition-all">
            Gerenciar Barbeiros
          </Link>
        </div>
      </div>
    </div>
  );
}
