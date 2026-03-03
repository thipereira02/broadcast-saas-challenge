import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, TextField } from "@mui/material";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(false);

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    await login(email, password);
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">OmniSend</span>
          </div>
          
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Simplifique seus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              disparos em massa.
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            A plataforma definitiva para gerenciar suas conexões e alcançar seus clientes em tempo recorde e sem estresse.
          </p>
        </div>
        
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 OmniSend. Todos os direitos reservados.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Bem-vindo</h2>
            <p className="text-slate-500 font-medium">Acesse sua conta para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <TextField
              label="E-mail profissional"
              type="email"
              fullWidth
              required
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(false);
              }}
              error={emailError}
              helperText={emailError ? "Por favor, insira um e-mail válido." : ""}
              InputProps={{ className: "bg-slate-50 rounded-xl" }}
            />
            
            <TextField
              label="Senha"
              type="password"
              fullWidth
              required
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ className: "bg-slate-50 rounded-xl" }}
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth 
              disableElevation
              className="py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 capitalize text-[15px] font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              Entrar no Painel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}