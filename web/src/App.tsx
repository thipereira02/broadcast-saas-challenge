import { useAuth } from "./hooks/useAuth";
import { Login } from "./pages/Login";
import { Button } from "@mui/material";

export function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-blue-600">
        Welcome to Broadcast SaaS!
      </h1>
      <p className="text-gray-700">Logado como: {user.email}</p>
      <Button variant="outlined" color="error" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}