'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar, Clock, Plus, X, CheckCircle2, Trash2, Loader2, User, Scissors } from 'lucide-react';

export default function SchedulePage() {
  const supabase = createClient();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [clientName, setClientName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [startTime, setStartTime] = useState('');

  async function fetchData() {
    setLoading(true);
    const { data: svs } = await supabase.from('services').select('*').order('name');
    if (svs) setServices(svs);

    const { data: apts } = await supabase
      .from('appointments')
      .select('*, services(name, price)')
      .order('start_time', { ascending: true });

    if (apts) setAppointments(apts);
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const service = services.find(s => s.id === selectedServiceId);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('appointments').insert([{
      client_name: clientName,
      service_id: selectedServiceId,
      start_time: startTime,
      total_price: service?.price || 0,
      status: 'scheduled',
      user_id: user?.id 
    }]);

    if (!error) {
      setIsModalOpen(false);
      setClientName('');
      setSelectedServiceId('');
      setStartTime('');
      fetchData();
    }
  }

  async function completeAppointment(id: string) {
    await supabase.from('appointments').update({ status: 'completed' }).eq('id', id);
    fetchData();
  }

  async function deleteAppointment(id: string) {
    await supabase.from('appointments').delete().eq('id', id);
    fetchData();
  }

  return (
    <div className="min-h-screen p-6 md:p-8 text-zinc-100 font-sans" style={{ backgroundColor: '#18181b' }}>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda de Atendimentos</h1>
          <p className="text-zinc-500 text-sm">Controle seus horários e serviços do dia.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-orange-500/20 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Novo Agendamento
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
      ) : (
        <div className="grid gap-4">
          {appointments.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-[#1e1e24]">
              <Calendar className="mx-auto text-zinc-600 mb-3" size={32} />
              <p className="text-zinc-400 font-medium text-sm">Nenhum cliente agendado.</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className={`bg-[#1e1e24] border ${apt.status === 'completed' ? 'border-green-500/30' : 'border-zinc-800/50'} p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:border-zinc-700`}>
                
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="bg-[#18181b] border border-zinc-800 px-4 py-2.5 rounded-lg text-center min-w-[90px]">
                    <span className="block text-xs font-bold text-orange-500">
                      {new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">
                      {new Date(apt.start_time).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-bold text-white mb-0.5">{apt.client_name}</h3>
                    <p className="text-zinc-400 text-xs font-medium flex items-center gap-1.5">
                      <Scissors size={12} className="text-zinc-500" />
                      {apt.services?.name || 'Serviço Excluído'} — R$ {Number(apt.total_price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {apt.status === 'scheduled' && (
                    <button onClick={() => completeAppointment(apt.id)} className="bg-zinc-800 hover:bg-green-600/20 hover:text-green-500 text-zinc-300 px-4 py-2 rounded-lg text-xs font-semibold transition-all border border-transparent hover:border-green-500/30 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Finalizar
                    </button>
                  )}
                  {apt.status === 'completed' && (
                    <span className="text-green-500 text-xs font-semibold flex items-center gap-1.5 px-3">
                      <CheckCircle2 size={14} /> Concluído
                    </span>
                  )}
                  <button onClick={() => deleteAppointment(apt.id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e24] border border-zinc-800 w-full max-w-md rounded-xl p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Novo Agendamento</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Nome do Cliente</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input required value={clientName} onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 outline-none text-white transition-colors"
                    placeholder="Nome completo" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Serviço</label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <select required value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 outline-none text-white appearance-none cursor-pointer">
                    <option value="">Selecione o serviço...</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} — R$ {Number(s.price).toFixed(2)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Data e Hora</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input required type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 outline-none text-white [color-scheme:dark]" />
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm py-3 rounded-lg shadow-lg shadow-orange-500/20 hover:opacity-90 transition-opacity mt-4">
                Confirmar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}