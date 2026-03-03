import { useState } from "react";
import { toast } from "react-hot-toast";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoadingAction(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Bem-vindo de volta!");
      } else {
        await register(email, password);
        toast.success("Conta criada com sucesso! Faça o login para continuar.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Paper elevation={3} className="p-8 w-full max-w-md flex flex-col gap-6">
        <Typography variant="h4" component="h1" className="text-center font-bold text-gray-800">
          Broadcast SaaS
        </Typography>
        
        <Typography variant="subtitle1" className="text-center text-gray-600 mb-4">
          {isLogin ? "Acesse sua conta" : "Crie uma nova conta"}
        </Typography>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }} 
          className="flex flex-col gap-4"
          noValidate
        >
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={loadingAction}
            className="mt-2 h-12"
          >
            {loadingAction ? "Processando..." : (isLogin ? "Entrar" : "Cadastrar")}
          </Button>
        </form>

        <div className="text-center mt-4">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
          </button>
        </div>
      </Paper>
    </div>
  );
}