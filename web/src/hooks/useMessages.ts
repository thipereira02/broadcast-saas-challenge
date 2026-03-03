import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  text: string;
  connectionId: string;
  contactIds: string[];
  status: 'scheduled' | 'sent';
  scheduledAt: Timestamp;
  userId: string;
}

export function useMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => {
        setMessages([]);
        setLoading(false);
      });
      return;
    }

    const q = query(collection(db, 'messages'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Message[];

      data.sort((a, b) => b.scheduledAt.toMillis() - a.scheduledAt.toMillis());

      const now = Date.now();
      data.forEach(async (msg) => {
        if (msg.status === 'scheduled' && msg.scheduledAt.toDate().getTime() <= now) {
          await updateDoc(doc(db, 'messages', msg.id), { status: 'sent' });
        }
      });

      setMessages(data);
      setLoading(false);
    }, (_err) => {
      console.error('Erro ao buscar mensagens:', _err);
      toast.error('Erro ao sincronizar mensagens.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const saveMessage = async (msgData: Omit<Message, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'messages'), {
        ...msgData,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      toast.success(msgData.status === 'sent' ? 'Mensagem enviada!' : 'Mensagem agendada!');
    } catch (_err) {
      console.error('Erro ao salvar mensagem:', _err);
      toast.error('Erro ao salvar mensagem.');
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success('Mensagem removida.');
    } catch (_err) {
      console.error('Erro ao remover mensagem:', _err);
      toast.error('Erro ao remover.');
    }
  };

  return { messages, loading, saveMessage, deleteMessage };
}