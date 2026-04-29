'use client';

import { LoginForm } from "@/components/login-form";
import { Scissors } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-10 bg-[#09090b] overflow-hidden">
      
      {/* Efeito de luz de fundo para combinar com a Home */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]" />

      <div className="w-full max-w-sm z-10">
        {/* Cabeçalho minimalista antes do card */}
        <div className="flex flex-col items-center mb-8">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl mb-4 shadow-2xl">
                <Scissors className="text-orange-500" size={32} />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">BarberPro</h1>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mt-1">Acesse sua conta</p>
        </div>

        {/* Chamada do componente que acabamos de ajustar */}
        <LoginForm />
        
        <div className="mt-12 text-center">
          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.3em] font-bold">
            Bem-vindo
          </p>
        </div>
      </div>
    </div>
  );
}