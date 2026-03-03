import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useContacts } from "../hooks/useContacts";
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import toast from "react-hot-toast";

export function Contacts() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { contacts, loading, addContact, removeContact } = useContacts(id);
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleAdd = async () => {
    setNameError(false);
    setPhoneError(false);

    if (!name) { setNameError(true); toast.error("Nome é obrigatório"); return; }
    if (!phone) { setPhoneError(true); toast.error("Telefone é obrigatório"); return; }

    const duplicatePhone = contacts.find(c => c.phone === phone);
    if (duplicatePhone) {
      setPhoneError(true);
      toast.error(`O número ${phone} já existe nesta lista.`);
      return;
    }

    try {
      await addContact(name, phone);
      setOpen(false);
      setName("");
      setPhone("");
    } catch (_err) {
      console.error("Erro ao adicionar contato:", _err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-500">Carregando contatos...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <IconButton 
            onClick={() => navigate("/")} 
            size="small" 
            className="text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-slate-800 text-xl font-extrabold tracking-tight">Omnisend</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500 hidden sm:block">{user?.email}</span>
          <Button variant="outlined" size="small" onClick={logout} className="text-slate-600 border-slate-300 hover:bg-slate-50 rounded-lg capitalize">
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 mt-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Lista de Contatos</h1>
            <p className="text-slate-500 mt-1 font-medium">Destinatários que receberão as mensagens desta conexão.</p>
          </div>
          <Button 
            variant="contained" 
            disableElevation 
            onClick={() => setOpen(true)}
            startIcon={<AddCircleOutlineIcon />}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-2.5 shadow-md shadow-blue-500/20 font-bold capitalize"
          >
            Novo Contato
          </Button>
        </div>

        <TableContainer component={Paper} className="shadow-sm border border-slate-200 rounded-2xl overflow-hidden bg-white">
          <Table>
            <TableHead className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableCell className="font-bold text-slate-600 uppercase text-xs tracking-wider">Nome do Cliente</TableCell>
                <TableCell className="font-bold text-slate-600 uppercase text-xs tracking-wider">Telefone</TableCell>
                <TableCell align="right" className="font-bold text-slate-600 uppercase text-xs tracking-wider">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" className="py-20">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <ContactPageOutlinedIcon fontSize="large" className="text-slate-400" />
                      </div>
                      <p className="text-lg font-bold text-slate-600">Nenhum contato encontrado</p>
                      <p className="text-sm max-w-sm text-center">Esta conexão ainda não possui destinatários. Adicione contatos para iniciar seus disparos.</p>
                      <Button 
                        variant="outlined" 
                        className="mt-4 rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50 font-bold" 
                        onClick={() => setOpen(true)}
                      >
                        Cadastrar Primeiro Contato
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id} hover className="transition-colors hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-800">{contact.name}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{contact.phone}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" size="small" onClick={() => removeContact(contact.id)} className="hover:bg-red-50">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-2xl shadow-xl" }}>
          <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} noValidate>
            <DialogTitle className="font-extrabold text-slate-800 text-xl pt-6 pb-2">Adicionar Contato</DialogTitle>
            <DialogContent className="flex flex-col gap-5 mt-2">
              <TextField
                label="Nome do cliente"
                fullWidth required error={nameError} value={name}
                onChange={(e) => { setName(e.target.value); if(nameError) setNameError(false); }}
                autoFocus className="mt-2"
                slotProps={{ input: { className: "rounded-xl" } }}
              />
              <TextField
                label="Telefone com DDD"
                fullWidth required error={phoneError} helperText={phoneError ? "Este número já está na lista" : ""} value={phone}
                onChange={(e) => { setPhone(e.target.value); if(phoneError) setPhoneError(false); }}
                slotProps={{ input: { className: "rounded-xl" } }}
              />
            </DialogContent>
            <DialogActions className="p-6 pt-4">
              <Button onClick={() => setOpen(false)} className="text-slate-500 font-bold capitalize rounded-lg">Cancelar</Button>
              <Button type="submit" variant="contained" disableElevation className="bg-blue-600 hover:bg-blue-700 font-bold capitalize rounded-lg px-6">
                Salvar Contato
              </Button>
            </DialogActions>
          </form>
        </Dialog>

      </main>
    </div>
  );
}