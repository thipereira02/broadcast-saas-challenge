import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error('Erro ao fazer login. Verifique suas credenciais.');
      } else {
        toast.error('Ocorreu um erro desconhecido no login.');
      }
      throw err;
    }
  };

  const register = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      await signOut(auth);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error('Erro ao criar conta. Tente uma senha mais forte.');
      } else {
        toast.error('Ocorreu um erro desconhecido no cadastro.');
      }
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, login, register, logout };
}