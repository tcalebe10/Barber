'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Calendar, Scissors, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: 0,
    totalClients: 0,
    todayCount: 0,
    servicesCount: 0
  });

  async function fetchDashboardData() {
    setLoading(true);
    
    // Pega o dia de hoje formatado
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    // 1. Busca agendamentos do mês para receita e atividades
    const { data: apts } = await supabase
      .from('appointments')
      .select('*, services(name)')
      .gte('start_time', startOfMonth)
      .order('start_time', { ascending: false });

    // 2. Busca quantidade de serviços cadastrados
    const { count: srvCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });

    if (apts) {
      // Receita total de concluídos
      const revenue = apts.filter(a => a.status === 'completed').reduce((acc, curr) => acc + Number(curr.total_price), 0);
      
      // Agendamentos de hoje
      const todayCount = apts.filter(a => a.start_time.startsWith(today)).length;

      // Clientes únicos no mês
      const uniqueClients = new Set(apts.map(a => a.client_name)).size;

      setStats({
        revenue,
        totalClients: uniqueClients,
        todayCount,
        servicesCount: srvCount || 0
      });
      setAppointments(apts.slice(0, 5)); // Pega os 5 últimos para "Atividades Recentes"
    }
    
    setLoading(false);
  }

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <div className="min-h-screen p-6 md:p-8 text-zinc-100 font-sans" style={{ backgroundColor: '#18181b' }}>
      
      {/* BANNER DE BOAS VINDAS */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 mb-8 shadow-lg shadow-orange-500/10">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo ao Painel do Barbeiro</h1>
        <p className="text-orange-100 text-sm">Gerencie sua barbearia com eficiência. Confira os dados abaixo.</p>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-zinc-400 text-xs font-medium">Total de Clientes (Mês)</p>
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Users size={16} /></div>
          </div>
          <h2 className="text-2xl font-bold">{stats.totalClients}</h2>
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[60%]" />
          </div>
        </div>

        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-zinc-400 text-xs font-medium">Agendamentos Hoje</p>
            <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Calendar size={16} /></div>
          </div>
          <h2 className="text-2xl font-bold">{stats.todayCount}</h2>
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[80%]" />
          </div>
        </div>

        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-zinc-400 text-xs font-medium">Serviços Oferecidos</p>
            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400"><Scissors size={16} /></div>
          </div>
          <h2 className="text-2xl font-bold">{stats.servicesCount}</h2>
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[40%]" />
          </div>
        </div>

        <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-zinc-400 text-xs font-medium">Receita do Mês</p>
            <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><TrendingUp size={16} /></div>
          </div>
          <h2 className="text-2xl font-bold text-white">R$ {stats.revenue.toFixed(2)}</h2>
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[75%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ATIVIDADES RECENTES */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Atividades Recentes</h3>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500" /></div>
          ) : (
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <p className="text-zinc-500 text-sm">Nenhuma atividade recente.</p>
              ) : (
                appointments.map((apt, idx) => (
                  <div key={apt.id} className="bg-[#1e1e24] p-4 rounded-xl border border-zinc-800/50 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${apt.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        0{idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{apt.client_name}</p>
                        <p className="text-xs text-zinc-500">
                          {apt.status === 'completed' ? 'Atendimento finalizado' : 'Novo agendamento'} - {apt.services?.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-zinc-500">
                      {new Date(apt.start_time).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div>
          <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
          <div className="bg-[#1e1e24] p-5 rounded-xl border border-zinc-800/50 space-y-3">
            <Link href="/barber/schedule" className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 hover:opacity-90 transition-all">
              + Novo Agendamento
            </Link>
            <Link href="/barber/clients" className="block w-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 text-center py-3 rounded-lg text-sm font-semibold transition-all">
              + Novo Cliente
            </Link>
            <Link href="/barber/services" className="block w-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 text-center py-3 rounded-lg text-sm font-semibold transition-all">
              Gerenciar Serviços
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
