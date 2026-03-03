import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useConnections } from "../hooks/useConnections";
import { useNavigate } from "react-router-dom";
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton,
  Switch, FormControlLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import toast from "react-hot-toast";

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

    if (duplicateName) { setNameError(true); toast.error(`O nome "${name}" já está em uso.`); return; }
    if (duplicatePhone) { setPhoneError(true); toast.error(`O número ${phone} já está cadastrado.`); return; }

    try {
      await addConnection(name, phone);
      setOpen(false);
      setName("");
      setPhone("");
      setNameError(false);
      setPhoneError(false);
    } catch (_err) {
      console.error("Erro ao adicionar conexão:", _err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-500">Carregando painel...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
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

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 mt-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Conexões</h1>
            <p className="text-slate-500 mt-1 font-medium">Gerencie os números remetentes para os seus disparos.</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outlined"
              onClick={() => navigate("/mensagens")}
              startIcon={<SendIcon />}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-xl px-5 py-2.5 font-bold capitalize"
            >
              Ir para Mensagens
            </Button>
            <Button 
              variant="contained" 
              disableElevation 
              onClick={() => setOpen(true)}
              startIcon={<AddCircleOutlineIcon />}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-2.5 shadow-md shadow-blue-500/20 font-bold capitalize"
            >
              Nova Conexão
            </Button>
          </div>
        </div>

        <TableContainer component={Paper} className="shadow-sm border border-slate-200 rounded-2xl overflow-hidden bg-white">
          <Table>
            <TableHead className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableCell className="font-bold text-slate-600 uppercase text-xs tracking-wider">Nome da Conexão</TableCell>
                <TableCell className="font-bold text-slate-600 uppercase text-xs tracking-wider">Telefone</TableCell>
                <TableCell className="font-bold text-slate-600 uppercase text-xs tracking-wider">Status</TableCell>
                <TableCell align="right" className="font-bold text-slate-600 uppercase text-xs tracking-wider">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" className="py-20">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <PeopleAltOutlinedIcon fontSize="large" className="text-slate-400" />
                      </div>
                      <p className="text-lg font-bold text-slate-600">Nenhuma conexão ativa</p>
                      <p className="text-sm max-w-sm text-center">Comece adicionando um número de WhatsApp ou telefone para ser o remetente das suas campanhas.</p>
                      <Button variant="outlined" className="mt-4 rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50 font-bold" onClick={() => setOpen(true)}>
                        Adicionar a primeira
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                connections.map((conn) => (
                  <TableRow key={conn.id} hover className="transition-colors hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-800">{conn.name}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{conn.phone}</TableCell>
                    <TableCell>
                      <Chip 
                        label={conn.status === "active" ? "Ativo" : "Inativo"} 
                        size="small"
                        className={`font-bold text-[11px] rounded-lg transition-all ${
                          conn.status === "active" 
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                            : "bg-slate-100 text-slate-400 border border-slate-200 opacity-60" 
                        }`}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1 md:gap-3">
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/conexoes/${conn.id}/contatos`)}
                          startIcon={<PeopleAltOutlinedIcon />}
                          className="font-bold capitalize text-blue-600 hover:bg-blue-50 rounded-lg px-3"
                        >
                          Contatos
                        </Button>

                        <FormControlLabel
                          control={
                            <Switch
                              checked={conn.status === "active"}
                              onChange={() => toggleStatus(conn.id, conn.status)}
                              color="success"
                              size="small"
                            />
                          }
                          label={
                            <span className={`text-[11px] font-bold uppercase tracking-tighter hidden sm:block ${
                              conn.status === "active" ? "text-emerald-600" : "text-slate-400"
                            }`}>
                              {conn.status === "active" ? "Online" : "Offline"}
                            </span>
                          }
                          labelPlacement="start"
                          className="m-0"
                        />

                        <IconButton color="error" size="small" onClick={() => removeConnection(conn.id)} className="hover:bg-red-50">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-2xl shadow-xl" }}>
          <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} noValidate>
            <DialogTitle className="font-extrabold text-slate-800 text-xl pt-6 pb-2">Nova Conexão</DialogTitle>
            <DialogContent className="flex flex-col gap-5 mt-2">
              <TextField
                label="Nome de identificação (ex: Filial Sul)"
                fullWidth required error={nameError} value={name}
                onChange={(e) => { setName(e.target.value); if(nameError) setNameError(false); }}
                autoFocus className="mt-2"
                slotProps={{ input: { className: "rounded-xl" } }}
              />
              <TextField
                label="Número com DDD (ex: 11999999999)"
                fullWidth required error={phoneError} helperText={phoneError ? "Telefone já cadastrado" : ""} value={phone}
                onChange={(e) => { setPhone(e.target.value); if(phoneError) setPhoneError(false); }}
                slotProps={{ input: { className: "rounded-xl" } }}
              />
            </DialogContent>
            <DialogActions className="p-6 pt-4">
              <Button onClick={() => setOpen(false)} className="text-slate-500 font-bold capitalize rounded-lg">Cancelar</Button>
              <Button type="submit" variant="contained" disableElevation className="bg-blue-600 hover:bg-blue-700 font-bold capitalize rounded-lg px-6">
                Salvar Conexão
              </Button>
            </DialogActions>
          </form>
        </Dialog>

      </main>
    </div>
  );
}