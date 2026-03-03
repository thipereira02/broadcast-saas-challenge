import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Contacts } from "./pages/Contacts"
import { PrivateRoute } from "./components/PrivateRoute";
import { Messages } from "./pages/Messages";
import { useAuth } from "./hooks/useAuth";

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
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/conexoes/:id/contatos" 
          element={
            <PrivateRoute>
              <Contacts />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/mensagens" 
          element={
            <PrivateRoute>
                <Messages />
              </PrivateRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}