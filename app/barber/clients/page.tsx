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
              <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Gasto Médio</p>
              <h2 className="text-3xl font-bold">R$ 150</h2>
            </div>
            <div className="bg-green-500/10 p-2 rounded-lg text-green-500">
              <MoreVertical size={20} />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[55%]" />
          </div>
        </div>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-3 text-zinc-500" size={18} />
        <input 
          type="text" 
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1e1e24] border border-zinc-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-orange-500 outline-none transition-colors"
        />
      </div>

      {/* TABELA DE CLIENTES */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : (
        <div className="bg-[#1e1e24] border border-zinc-800/50 rounded-xl overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-zinc-600 mb-3" size={32} />
              <p className="text-zinc-400 text-sm">Nenhum cliente encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#18181b] border-b border-zinc-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400">NOME</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400">ÚLTIMA VISITA</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400">VISITAS</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400">GASTO TOTAL</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-zinc-400">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredClients.map((client) => (
                    <tr key={client.name} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{client.name}</td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{new Date(client.lastVisit).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-500">{client.appointmentsCount}x</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">R$ {client.totalSpent.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-zinc-500 hover:text-orange-500 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
