"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Lock, Loader2, Scissors } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? "Acesso negado. Credenciais inválidas." : "Erro ao conectar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden relative border-t-0">
        {/* Linha de degradê no topo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600" />
        
        <CardHeader className="space-y-1 pt-8">
          <div className="flex justify-between items-start mb-6">
            {/* BOTÃO VOLTAR PARA HOME */}
            <Link 
              href="/" 
              className="text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-zinc-800/40 px-3 py-1.5 rounded-lg border border-zinc-700/50 hover:bg-zinc-800"
            >
              <ArrowLeft size={14} />
              Voltar
            </Link>
            <div className="text-orange-500/50">
              <Lock size={20} />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="text-orange-500" size={20} />
            <CardTitle className="text-xl font-bold text-white tracking-tight">Login Administrativo</CardTitle>
          </div>
          <CardDescription className="text-zinc-500 text-sm">
            Área exclusiva para barbeiros e gerentes.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-zinc-400 text-[10px] uppercase font-black tracking-widest">E-mail Profissional</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@barbearia.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-orange-500 h-12 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-zinc-400 text-[10px] uppercase font-black tracking-widest">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-orange-500 h-12 rounded-xl"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white" size={20} />
              ) : (
                "Entrar no Painel"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-zinc-700 text-[10px] uppercase tracking-[0.4em] font-bold">
          Acesso Restrito
        </p>
      </div>
    </div>
  );
}