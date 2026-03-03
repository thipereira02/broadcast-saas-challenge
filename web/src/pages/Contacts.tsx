import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContacts } from "../hooks/useContacts";
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";

export function Contacts() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      toast.error(`O número ${phone} já está cadastrado nesta conexão.`);
      return;
    }

    try {
      await addContact(name, phone);
      setOpen(false);
      setName("");
      setPhone("");
    } catch (err) {
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando contatos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <IconButton onClick={() => navigate("/")} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gerenciar Contatos</h1>
              <p className="text-sm text-gray-500 mt-1">Adicione os destinatários desta conexão.</p>
            </div>
          </div>
          <Button variant="contained" disableElevation onClick={() => setOpen(true)}>
            + Novo Contato
          </Button>
        </div>

        <TableContainer component={Paper} className="shadow-sm border border-gray-100 rounded-xl overflow-hidden">
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-semibold text-gray-600">Nome do Contato</TableCell>
                <TableCell className="font-semibold text-gray-600">Telefone</TableCell>
                <TableCell align="right" className="font-semibold text-gray-600">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" className="py-12 text-gray-500">
                    Nenhum contato adicionado ainda.
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id} hover className="transition-colors">
                    <TableCell className="font-medium text-gray-800">{contact.name}</TableCell>
                    <TableCell className="text-gray-600">{contact.phone}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" size="small" onClick={() => removeContact(contact.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal de Criação */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} noValidate>
            <DialogTitle className="font-bold text-gray-800">Adicionar Contato</DialogTitle>
            <DialogContent className="flex flex-col gap-4 mt-2">
              <TextField
                label="Nome do Contato"
                fullWidth
                required
                error={nameError}
                value={name}
                onChange={(e) => { setName(e.target.value); if(nameError) setNameError(false); }}
                autoFocus
                className="mt-2"
              />
              <TextField
                label="Telefone (ex: 11999999999)"
                fullWidth
                required
                error={phoneError}
                helperText={phoneError ? "Este número já existe nesta conexão" : ""}
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if(phoneError) setPhoneError(false); }}
              />
            </DialogContent>
            <DialogActions className="p-4 border-t border-gray-100 mt-2">
              <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
              <Button type="submit" variant="contained" disableElevation>Salvar</Button>
            </DialogActions>
          </form>
        </Dialog>

      </div>
    </div>
  );
}