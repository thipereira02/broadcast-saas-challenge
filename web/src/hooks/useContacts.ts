import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  connectionId: string;
  userId: string;
  createdAt?: any;
}

export function useContacts(connectionId: string | undefined) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !connectionId) {
      setContacts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "contacts"),
      where("connectionId", "==", connectionId),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];
      
      setContacts(data);
      setLoading(false);
    }, (err) => {
      console.error("Erro ao buscar contatos:", err);
      toast.error("Erro ao carregar os contatos.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, connectionId]);

  const addContact = async (name: string, phone: string) => {
    if (!user || !connectionId) return;

    try {
      await addDoc(collection(db, "contacts"), {
        name,
        phone,
        connectionId,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Contato adicionado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar o contato.");
      throw err;
    }
  };

  // DELETE
  const removeContact = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      toast.success("Contato removido.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover o contato.");
    }
  };

  return { 
    contacts, 
    loading, 
    addContact, 
    removeContact 
  };
}