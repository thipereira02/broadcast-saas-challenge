import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useConnections } from '../hooks/useConnections';
import { useContacts, type Contact } from '../hooks/useContacts';
import { useMessages, type Message } from '../hooks/useMessages';
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton,
  Tabs, Tab, Box, MenuItem, Checkbox, ListItemText, OutlinedInput, Select, FormControl, InputLabel,
  Collapse, Typography
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

function MessageRow({ msg, onDelete, allContacts }: { msg: Message, onDelete: (id: string) => void, allContacts: Contact[] }) {
  const [open, setOpen] = useState(false);

  const contactNames = useMemo(() => {
    return msg.contactIds.map(id => {
      const contact = allContacts.find(c => c.id === id);
      return contact ? contact.name : 'Contato removido';
    }).join(', ');
  }, [msg.contactIds, allContacts]);

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width={50}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className="max-w-[300px] truncate font-medium text-slate-700">
          {msg.text}
        </TableCell>
        <TableCell className="text-slate-500 font-bold">
          {msg.contactIds.length} pessoas
        </TableCell>
        <TableCell className="text-slate-500">
          {msg.scheduledAt.toDate().toLocaleString('pt-BR')}
        </TableCell>
        <TableCell align="right">
          <IconButton color="error" size="small" onClick={() => onDelete(msg.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="p-6 bg-slate-50/50 rounded-2xl my-3 border border-slate-100 shadow-inner">
              <div className="space-y-5">
                <div>
                  <Typography className="text-blue-600 font-black uppercase text-[10px] tracking-[2px] mb-1">
                    Para
                  </Typography>
                  <Typography className="text-slate-800 font-semibold text-sm leading-relaxed">
                    {contactNames}
                  </Typography>
                </div>

                <div>
                  <Typography className="text-blue-600 font-black uppercase text-[10px] tracking-[2px] mb-1">
                    Mensagem
                  </Typography>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                    {msg.text}
                  </div>
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function Messages() {
  const { user, logout } = useAuth();
  const { connections } = useConnections();
  const { messages, saveMessage, deleteMessage } = useMessages();
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedConnId, setSelectedConnId] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const { contacts: modalContacts } = useContacts(selectedConnId || undefined);
  
  const { contacts: allContacts } = useContacts(undefined);

  const filteredMessages = useMemo(() => {
    const status = tabValue === 0 ? 'sent' : 'scheduled';
    return messages.filter(m => m.status === status);
  }, [messages, tabValue]);

  const handleSend = async () => {
    if (!selectedConnId || selectedContactIds.length === 0 || !text) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const isScheduling = !!scheduleTime;
    const scheduledAtDate = isScheduling ? new Date(scheduleTime) : new Date();

    if (isScheduling && scheduledAtDate <= new Date()) {
      toast.error('O agendamento precisa ser para uma data futura.');
      return;
    }

    await saveMessage({
      text,
      connectionId: selectedConnId,
      contactIds: selectedContactIds,
      status: isScheduling ? 'scheduled' : 'sent',
      scheduledAt: Timestamp.fromDate(scheduledAtDate)
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedConnId('');
    setSelectedContactIds([]);
    setText('');
    setScheduleTime('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <IconButton onClick={() => navigate('/')} size="small" className="text-slate-400 hover:text-blue-600">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
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

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Central de Disparos</h1>
            <p className="text-slate-500 font-medium mt-1">Gerencie suas campanhas instantâneas ou agendadas.</p>
          </div>
          <Button 
            variant="contained" 
            startIcon={<SendIcon />}
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 font-bold capitalize"
          >
            Novo Disparo
          </Button>
        </div>

        <Box className="border-b border-slate-200">
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} textColor="primary" indicatorColor="primary">
            <Tab label="Enviadas" className="font-bold capitalize" />
            <Tab label="Agendadas" className="font-bold capitalize" />
          </Tabs>
        </Box>

        <TableContainer component={Paper} className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
          <Table>
            <TableHead className="bg-slate-50">
              <TableRow>
                <TableCell width={50} />
                <TableCell className="font-bold text-slate-600 text-xs uppercase tracking-widest">Resumo</TableCell>
                <TableCell className="font-bold text-slate-600 text-xs uppercase tracking-widest">Alvo</TableCell>
                <TableCell className="font-bold text-slate-600 text-xs uppercase tracking-widest">Horário</TableCell>
                <TableCell align="right" className="font-bold text-slate-600 text-xs uppercase tracking-widest">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="py-16 text-slate-400">Nenhuma mensagem aqui.</TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((msg) => (
                  <MessageRow key={msg.id} msg={msg} onDelete={deleteMessage} allContacts={allContacts} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ className: 'rounded-2xl' }}>
          <DialogTitle className="font-extrabold text-slate-800 text-xl">Configurar Disparo</DialogTitle>
          <DialogContent className="flex flex-col gap-6 pt-4">
            <TextField
              select label="Selecione o Remetente"
              fullWidth value={selectedConnId}
              onChange={(e) => setSelectedConnId(e.target.value)}
              slotProps={{ input: { className: 'rounded-xl' } }}
            >
              {connections.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name} ({c.phone})</MenuItem>
              ))}
            </TextField>

            <FormControl fullWidth disabled={!selectedConnId}>
              <InputLabel>Selecionar Destinatários</InputLabel>
              <Select
                multiple value={selectedContactIds}
                onChange={(e) => setSelectedContactIds(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Selecionar Destinatários" className="rounded-xl" />}
                renderValue={(selected) => `${selected.length} contatos selecionados`}
              >
                {modalContacts.map((contact) => (
                  <MenuItem key={contact.id} value={contact.id}>
                    <Checkbox checked={selectedContactIds.indexOf(contact.id) > -1} />
                    <ListItemText primary={contact.name} secondary={contact.phone} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Texto da Mensagem"
              multiline rows={4} fullWidth value={text}
              onChange={(e) => setText(e.target.value)}
              slotProps={{ input: { className: 'rounded-xl' } }}
            />

            <TextField
              label="Agendar para (opcional)"
              type="datetime-local"
              fullWidth value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              slotProps={{ 
                input: { className: 'rounded-xl' },
                inputLabel: { shrink: true } 
              }}
              helperText="Deixe vazio para enviar agora"
            />
          </DialogContent>
          <DialogActions className="p-6">
            <Button onClick={() => setOpen(false)} className="text-slate-500 font-bold capitalize">Cancelar</Button>
            <Button variant="contained" onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold capitalize">
              {scheduleTime ? 'Confirmar Agendamento' : 'Enviar Agora'}
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}