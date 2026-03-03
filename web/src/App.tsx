import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import { Button } from "@mui/material";

function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Painel de Conexões</h1>
      <p className="text-gray-600 mb-6">Usuário (Cliente SaaS): {user?.email}</p>
      <Button variant="contained" color="error" onClick={logout}>
        Sair
      </Button>
    </div>
  );
}

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}