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
  serverTimestamp,
  Timestamp
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
  createdAt?: Timestamp;
}

export function useConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => {
        setConnections([]);
        setLoading(false);
      });
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
    }, (_err) => {
      console.error("Erro ao buscar conexões:", _err);
      toast.error("Erro ao carregar suas conexões.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addConnection = async (name: string, phone: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "connections"), {
        name,
        phone,
        status: "active",
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Conexão criada com sucesso!");
    } catch (_err) {
      console.error("Erro ao criar conexão:", _err);
      toast.error("Erro ao criar conexão.");
      throw _err;
    }
  };

  const toggleStatus = async (id: string, currentStatus: Connection["status"]) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const docRef = doc(db, "connections", id);
      await updateDoc(docRef, { status: newStatus });
      toast.success(`Conexão ${newStatus === "active" ? "ativada" : "desativada"}!`);
    } catch (_err) {
      console.error("Erro ao atualizar status da conexão:", _err);
      toast.error("Erro ao atualizar o status.");
    }
  };

  const removeConnection = async (id: string) => {
    try {
      await deleteDoc(doc(db, "connections", id));
      toast.success("Conexão excluída permanentemente.");
    } catch (_err) {
      console.error("Erro ao excluir conexão:", _err);
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