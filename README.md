# 🚀 Omnisend - SaaS Broadcast Challenge

O **Omnisend** é uma plataforma SaaS de disparos de mensagens projetada para oferecer isolamento total de dados entre clientes, utilizando uma arquitetura moderna, funcional e altamente escalável.

## 🏗️ Arquitetura e Decisões Técnicas

### 🔐 Modelo SaaS e Isolamento de Dados
O sistema foi projetado sob a premissa de **multi-tenancy**. O isolamento de dados é garantido em duas camadas críticas:
1. **Application Level**: Todas as consultas ao Firestore são filtradas dinamicamente pelo `userId` do usuário autenticado através de hooks customizados.
2. **Database Level**: Implementação rigorosa de **Firestore Security Rules** que barram qualquer tentativa de leitura ou escrita em documentos que não pertençam ao `auth.uid` do remetente, garantindo que um cliente jamais acesse dados de outro.

### 📁 Estrutura de Pastas (Monorepo-ready)
Seguindo os requisitos do desafio e as boas práticas do Firebase CLI:
* `/web`: Frontend React desenvolvido com **Vite**, focado em performance e DX.
* `/functions`: Estrutura de backend preparada para expansão de Cloud Functions e integrações de APIs de mensageria.

### 💻 Paradigma Funcional & Clean Code
* **Zero OOP**: O projeto foi desenvolvido estritamente sob o paradigma funcional, utilizando **Hooks** para abstração de lógica e gerenciamento de estado.
* **Tipagem Estrita**: Uso de interfaces TypeScript em toda a aplicação para garantir a previsibilidade do fluxo de dados.
* **Firestore Real-time**: Implementação de listeners ativos (`onSnapshot`) para garantir que a lista de mensagens e conexões reflita mudanças no banco em tempo real.

## 🛠️ Tech Stack
* **Vite + React**
* **Firebase Auth & Firestore**
* **Material UI (MUI)** (Componentes de interface)
* **Tailwind CSS** (Estilização e Responsividade)
* **React Hot Toast** (Feedback de operações)

## 📦 Como rodar o projeto

1. **Configuração do Frontend**:
   ```bash
   cd web
   npm install
   npm run dev
   ```
2. **Segurança:**
As regras de acesso SaaS estão definidas no arquivo firestore.rules na raiz do projeto e devem ser aplicadas ao ambiente Firebase via CLI.
3. **Build e Deploy:**
    ```bash
    # Na pasta web
    npm run build
    # Na raiz do projeto
    firebase deploy --only firestore,hosting
   ```

