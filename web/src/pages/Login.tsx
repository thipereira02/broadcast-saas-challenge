import { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { login, register, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const handleSubmit = async () => {
    setLoadingAction(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
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

          {error && (
            <Typography variant="body2" color="error" className="text-center">
              {error}
            </Typography>
          )}

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