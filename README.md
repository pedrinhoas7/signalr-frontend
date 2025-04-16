# 💸 SignalR Banking Frontend (React)

Este é um projeto de front-end desenvolvido com **React** que utiliza **SignalR** para comunicação em tempo real com um webservice de backend. Ele simula um sistema bancário básico, permitindo consulta de saldo, extrato e realização de transações como **depósito** e **pagamento**.

## 🚀 Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/) (opcional, mas recomendado)
- [@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr) – para comunicação em tempo real com o backend

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/pedrinhoas7/signalr-frontend.git
   cd signalr-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com a variável de ambiente da URL do backend:
   ```
   REACT_APP_API_URL=https://localhost:58886
   ```

4. Execute o projeto:
   ```bash
   npm start
   ```
5. Execulte o [backend](https://github.com/pedrinhoas7/signalr-backend)

## 🧪 Funcionalidades

- **Login** via CPF e Email (apenas campos de entrada, sem autenticação real)
- **Conexão com SignalR Hub** usando os parâmetros do usuário
- **Consulta de dados da conta**: saldo e extrato bancário
- **Envio de transações**:
  - Depósito
  - Pagamento
- **Recebimento em tempo real** de atualizações da conta

## 🖼️ Captura de Tela

![image](https://github.com/user-attachments/assets/8049e702-cb0a-4b66-8ad1-d65a96f7dfaf)


## 🧠 Como Funciona

A conexão com o SignalR é feita logo após o login com o seguinte endpoint:
```
<REACT_APP_API_URL>/ws/transactions?document=<cpf>&email=<email>
```

Eventos escutados:
- `ReceiveAccountDetails`: recebe saldo e extrato
- `Error`: exibe alertas de erro

Evento enviado:
- `ProcessTransaction`: envia a operação (depósito ou pagamento) com valor e descrição

## 📁 Estrutura Simples

Atualmente, o projeto possui apenas um componente principal chamado `Example.tsx`, que pode ser estruturado em múltiplos componentes futuramente.

## 👨‍💻 Autor

Desenvolvido com 💙 por Pedro Henrique
