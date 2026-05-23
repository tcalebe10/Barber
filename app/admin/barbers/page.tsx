'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Plus, Trash2, X, Loader2, Mail, Phone } from 'lucide-react';

export default function BarbersPage() {
  const supabase = createClient();
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchBarbers() {
    setLoading(true);
    console.log('Buscando barbeiros...');
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, Email')
      .eq('role', 'barber');

    console.log('Barbeiros encontrados:', { data, error });
    if (data) setBarbers(data);
    setLoading(false);
  }

  useEffect(() => { fetchBarbers(); }, []);

  async function handleCreateBarber(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Validar entradas
      if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        throw new Error('Todos os campos são obrigatórios');
      }

      console.log('=== INICIANDO CADASTRO DE BARBEIRO ===');
      console.log({ email, fullName, phone });

      // 2. Criar usuário no Auth
      console.log('Step 1: Criando usuário no Auth do Supabase...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('Auth response:', { 
        userId: authData?.user?.id, 
        error: authError?.message 
      });

      if (authError) throw authError;
      if (!authData?.user?.id) throw new Error('Falha ao criar usuário: ID não retornado');

      const userId = authData.user.id;
      console.log('✓ Usuário criado:', userId);

      // 3. Criar profile com role='barber'
      console.log('Step 2: Criando profile na tabela profiles...');
      
      // Dados que serão inseridos
      const profileData = {
        id: userId,
        full_name: fullName.trim(),
        phone: phone.trim(),
        Email: email.trim(),
        role: 'barber',
      };

      console.log('Profile data a ser inserido:', profileData);

      const { data: upsertData, error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select();

      console.log('Upsert response:', { 
        data: upsertData,
        error: profileError?.message,
        errorDetails: profileError
      });

      if (profileError) throw profileError;

      // 4. Verificar se o role foi realmente salvo
      console.log('Step 3: Verificando se o role foi salvo corretamente...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('id, role, Email')
        .eq('id', userId)
        .single();

      console.log('Verificação:', { 
        savedData: verifyData,
        verifyError: verifyError?.message
      });

      if (verifyData?.role !== 'barber') {
        console.warn('⚠️ ALERTA: Role não foi salvo como "barber"!');
        console.warn('Role salvo:', verifyData?.role);
      } else {
        console.log('✓ Role "barber" confirmado!');
      }

      console.log('=== CADASTRO CONCLUÍDO COM SUCESSO ===\n');

      // 5. Limpar formulário e fechar modal
      setEmail('');
      setFullName('');
      setPhone('');
      setPassword('');
      setIsModalOpen(false);
      
      // 6. Recarregar lista
      await fetchBarbers();

    } catch (err: any) {
      console.error('❌ ERRO AO CADASTRAR:', err);
      console.error('Detalhes:', err.message);
      setError(err.message || 'Erro ao cadastrar barbeiro');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteBarber(id: string) {
    if (confirm('Tem certeza que deseja deletar este barbeiro?')) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchBarbers();
      }
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-8 text-zinc-100 font-sans" style={{ backgroundColor: '#18181b' }}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Barbeiros</h1>
          <p className="text-zinc-500 text-sm">
            Cadastre e gerencie os barbeiros do sistema.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={18} /> Novo Barbeiro
        </button>
      </div>

      {/* LISTA */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : (
        <div className="bg-[#1e1e24] border border-zinc-800/50 rounded-xl overflow-hidden">
          {barbers.length === 0 ? (
            <div className="text-center py-20">
              <Users className="mx-auto text-zinc-600 mb-3" size={32} />
              <p className="text-zinc-400 text-sm">Nenhum barbeiro cadastrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#18181b] border-b border-zinc-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400">NOME</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400">E-MAIL</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-400">TELEFONE</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-zinc-400">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {barbers.map((barber) => (
                    <tr key={barber.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{barber.full_name}</td>
                      <td className="px-6 py-4 text-sm text-zinc-400 flex items-center gap-2">
                        <Mail size={14} className="text-zinc-600" />
                        {barber.Email}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400 flex items-center gap-2">
                        <Phone size={14} className="text-zinc-600" />
                        {barber.phone}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => deleteBarber(barber.id)}
                          className="text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e24] border border-zinc-800 w-full max-w-md rounded-xl p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Cadastrar Novo Barbeiro</h2>
            
            <form onSubmit={handleCreateBarber} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400">Nome Completo</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">E-mail</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@barbearia.com"
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">Telefone</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">Senha</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha segura"
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm py-3 rounded-lg shadow-lg shadow-orange-500/20 hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Barbeiro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
