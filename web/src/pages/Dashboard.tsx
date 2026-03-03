import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useConnections } from "../hooks/useConnections";
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { user, logout } = useAuth();
  const { connections, loading, addConnection, toggleStatus, removeConnection } = useConnections();
  const navigate = useNavigate();
  
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

    const duplicateName = connections.find(c => c.name.toLowerCase() === name.toLowerCase());
    const duplicatePhone = connections.find(c => c.phone === phone);

    if (duplicateName) {
      setNameError(true);
      toast.error(`O nome "${name}" já está em uso.`);
      return;
    }

    if (duplicatePhone) {
      setPhoneError(true);
      toast.error(`O número ${phone} já está cadastrado.`);
      return;
    }

    try {
      await addConnection(name, phone);
      
      setOpen(false); 
      setName("");
      setPhone("");
      setNameError(false);
      setPhoneError(false);
    } catch (err) {
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando painel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Minhas Conexões</h1>
            <p className="text-sm text-gray-500 mt-1">SaaS Workspace: {user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="contained" disableElevation onClick={() => setOpen(true)}>
              + Nova Conexão
            </Button>
            <Button variant="outlined" color="inherit" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>

        <TableContainer component={Paper} className="shadow-sm border border-gray-100 rounded-xl overflow-hidden">
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-semibold text-gray-600">Nome da Conexão</TableCell>
                <TableCell className="font-semibold text-gray-600">Telefone</TableCell>
                <TableCell className="font-semibold text-gray-600">Status</TableCell>
                <TableCell align="right" className="font-semibold text-gray-600">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" className="py-12 text-gray-500">
                    Nenhuma conexão encontrada. Clique em "Nova Conexão" para começar.
                  </TableCell>
                </TableRow>
              ) : (
                connections.map((conn) => (
                  <TableRow key={conn.id} hover className="transition-colors">
                    <TableCell className="font-medium text-gray-800">{conn.name}</TableCell>
                    <TableCell className="text-gray-600">{conn.phone}</TableCell>
                    <TableCell>
                      <Chip 
                        label={conn.status === "active" ? "Ativo" : "Inativo"} 
                        color={conn.status === "active" ? "success" : "default"} 
                        size="small"
                        className="font-medium"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        onClick={() => navigate(`/conexoes/${conn.id}/contatos`)}
                        className="mr-2 lowercase"
                      >
                        Contatos
                      </Button>
                      <Button 
                        size="small" 
                        color={conn.status === "active" ? "warning" : "success"}
                        onClick={() => toggleStatus(conn.id, conn.status)}
                        className="mr-2 lowercase"
                      >
                        {conn.status === "active" ? "Desativar" : "Ativar"}
                      </Button>
                      <IconButton color="error" size="small" onClick={() => removeConnection(conn.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} noValidate>
            <DialogTitle className="font-bold text-gray-800">Adicionar Conexão</DialogTitle>
            <DialogContent className="flex flex-col gap-4 mt-2">
              <TextField
                label="Nome (ex: WhatsApp Matriz)"
                fullWidth
                required
                error={nameError}
                helperText={nameError ? "Nome duplicado ou inválido" : ""}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if(nameError) setNameError(false);
                }}
                autoFocus
                className="mt-2"
              />
              <TextField
                label="Telefone (ex: 11999999999)"
                fullWidth
                required
                error={phoneError}
                helperText={phoneError ? "Telefone já cadastrado" : ""}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if(phoneError) setPhoneError(false);
                }}
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