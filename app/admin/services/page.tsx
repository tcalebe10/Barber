'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Scissors, Plus, Trash2, X, Loader2, DollarSign, Type } from 'lucide-react';

export default function ServicesPage() {
  const [supabase, setSupabase] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Inicializa supabase no client
  useEffect(() => {
    const client = createClient();
    setSupabase(client);
  }, []);

  async function fetchServices(client: any) {
    setLoading(true);

    const { data, error } = await client
      .from('services')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) {
      setServices(data);
    }

    setLoading(false);
  }

  // Só roda quando supabase estiver pronto
  useEffect(() => {
    if (supabase) {
      fetchServices(supabase);
    }
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    const numericPrice = parseFloat(price.replace(',', '.'));

    const { error } = await supabase.from('services').insert([
      {
        name,
        price: numericPrice,
      },
    ]);

    if (!error) {
      setIsModalOpen(false);
      setName('');
      setPrice('');
      fetchServices(supabase);
    }
  }

  async function deleteService(id: string) {
    if (!supabase) return;

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (!error) {
      fetchServices(supabase);
    }
  }

  // 🔴 evita render quebrado
  if (!supabase) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#18181b]">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 text-zinc-100 font-sans bg-[#18181b]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Catálogo de Serviços</h1>
          <p className="text-zinc-500 text-sm">
            Gerencie os procedimentos e valores da barbearia.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={18} /> Novo Serviço
        </button>
      </div>

      {/* LISTA */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-[#1e1e24]">
              <Scissors className="mx-auto text-zinc-600 mb-3" size={32} />
              <p className="text-zinc-400 text-sm">
                Nenhum serviço cadastrado ainda.
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-[#1e1e24] p-6 rounded-xl border border-zinc-800 flex flex-col justify-between"
              >
                <div className="flex justify-between mb-6">
                  <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500">
                    <Scissors size={24} />
                  </div>

                  <button
                    onClick={() => deleteService(service.id)}
                    className="text-zinc-500 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    {service.name}
                  </h3>

                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-sm text-zinc-500">R$</span>
                    <span className="text-2xl font-bold text-zinc-200">
                      {Number(service.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-[#1e1e24] border border-zinc-800 w-full max-w-md rounded-xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              Cadastrar Serviço
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-2 text-white"
              />

              <input
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Preço"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-2 text-white"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg"
              >
                Salvar Serviço
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}