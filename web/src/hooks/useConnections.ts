import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export interface Connection {
  id: string;
  name: string;
  phone: string;
  status: "active" | "inactive";
  userId: string;
  createdAt?: any;
}

export function useConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "connections"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Connection[];
      
      setConnections(data);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao buscar conexões:", err);
      toast.error("Erro ao carregar suas conexões.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addConnection = async (name: string, phone: string) => {
    if (!user) return;

    const isDuplicate = connections.some(
      (c) => c.phone === phone || c.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Você já possui uma conexão com este nome ou telefone.");
      return;
    }

    try {
      await addDoc(collection(db, "connections"), {
        name,
        phone,
        status: "active",
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Conexão criada com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar conexão.");
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const docRef = doc(db, "connections", id);
      await updateDoc(docRef, { status: newStatus });
      toast.success(`Conexão ${newStatus === "active" ? "ativada" : "desativada"}!`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar o status.");
    }
  };

  const removeConnection = async (id: string) => {
    try {
      await deleteDoc(doc(db, "connections", id));
      toast.success("Conexão excluída permanentemente.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir conexão.");
    }
  };

  return { 
    connections, 
    loading, 
    addConnection, 
    toggleStatus, 
    removeConnection 
  };
}