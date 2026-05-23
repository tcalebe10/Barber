'use client';

import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-6 md:p-8 text-zinc-100 font-sans" style={{ backgroundColor: '#18181b' }}>
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-zinc-500 text-sm">
          Gerencie as configurações do sistema.
        </p>
      </div>

      {/* CARDS DE CONFIGURAÇÕES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-zinc-800/50">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-orange-500/10 p-3 rounded-lg text-orange-500">
              <SettingsIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sistema</h3>
              <p className="text-zinc-500 text-sm">Configurações gerais do sistema</p>
            </div>
          </div>
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-sm font-medium transition-colors mt-4">
            Configurar
          </button>
        </div>

        <div className="bg-[#1e1e24] p-6 rounded-xl border border-zinc-800/50">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-500/10 p-3 rounded-lg text-blue-500">
              <SettingsIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Segurança</h3>
              <p className="text-zinc-500 text-sm">Gerencie segurança e permissões</p>
            </div>
          </div>
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-sm font-medium transition-colors mt-4">
            Configurar
          </button>
        </div>
      </div>
    </div>
  );
}
