'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Users, 
  Search, 
  UserPlus, 
  MoreVertical,
  Loader2
} from 'lucide-react';

// O "export default" aqui é o que resolve o seu erro!
export default function ClientsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchClients() {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('client_name, start_time, total_price')
      .order('start_time', { ascending: false });

    if (!error && data) {
      const uniqueClients = data.reduce((acc: any[], curr: any) => {
        const existing = acc.find((c: any) => c.name === curr.client_name);
        if (existing) {
          existing.totalSpent += Number(curr.total_price);
          existing.appointmentsCount += 1;
        } else {
          acc.push({
            name: curr.client_name,
            lastVisit: curr.start_time,
            totalSpent: Number(curr.total_price),
            appointmentsCount: 1
          });
        }
        return acc;
      }, []);
      
      setClients(uniqueClients);
    }
    setLoading(false);
  }

  useEffect(() => { fetchClients(); }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 text-zinc-100" style={{ backgroundColor: '#18181b' }}>
      
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Clientes</h1>
          <p className="text-zinc-500 text-sm">Visualize e gerencie a base de clientes da sua barbearia.</p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-orange-500/20 hover:opacity-90 transition-all flex items-center gap-2">
          <UserPlus size={18} /> + Novo Cliente
        </button>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-zinc-800/50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Total de Clientes</p>
              <h2 className="text-3xl font-bold">{clients.length}</h2>
            </div>
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[70%]" />
          </div>
        </div>

        <div className="bg-[#1e1e24] p-6 rounded-xl border border-zinc-800/50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Novos este Mês</p>
              <h2 className="text-3xl font-bold">12</h2>
            </div>
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-500">
              <UserPlus size={20} />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[40%]" />
          </div>
        </div>

        <div className="bg-[#1e1e24] p-6 rounded-xl border border-zinc-800/50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Ticket Médio</p>
              <h2 className="text-3xl font-bold">
                R$ {clients.length > 0 ? (clients.reduce((acc, c) => acc + c.totalSpent, 0) / clients.length).toFixed(2) : '0,00'}
              </h2>
            </div>
            <div className="bg-green-500/10 p-2 rounded-lg text-green-500">
              <span className="font-bold text-sm">R$</span>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[55%]" />
          </div>
        </div>
      </div>

      {/* FILTRO E TABELA */}
      <div className="bg-[#1e1e24] rounded-xl border border-zinc-800/50 overflow-hidden">
        <div className="p-6 border-b border-zinc-800/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="Buscar cliente pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-500 text-[11px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-4 border-b border-zinc-800/50">Cliente</th>
                  <th className="px-6 py-4 border-b border-zinc-800/50">Atendimentos</th>
                  <th className="px-6 py-4 border-b border-zinc-800/50">Última Visita</th>
                  <th className="px-6 py-4 border-b border-zinc-800/50">Total Gasto</th>
                  <th className="px-6 py-4 border-b border-zinc-800/50 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredClients.map((client, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-orange-500 border border-zinc-700 uppercase">
                          {client.name.substring(0, 2)}
                        </div>
                        <span className="text-sm font-semibold text-zinc-200">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      <span className="bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold">
                        {client.appointmentsCount}x
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {new Date(client.lastVisit).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-white">
                      R$ {client.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}