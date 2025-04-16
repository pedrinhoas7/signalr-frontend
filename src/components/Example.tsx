import { useState } from 'react';
import * as signalR from '@microsoft/signalr';

export default function Example() {
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [saldo, setSaldo] = useState(0);
    const [extrato, setExtrato] = useState<string[]>([]);
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionDescription, setTransactionDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'deposito' | 'pagamento' | ''>('');
    const [showExtrato, setShowExtrato] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    console.log("Environment Variables:", process.env.REACT_APP_API_URL);

    const login = async () => {
        if (!cpf || !email) {
            alert("Por favor, preencha CPF e Email.");
            return;
        }

        const conn = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_API_URL}/ws/transactions?document=${cpf}&email=${email}`)
            .build();

        conn.on("ReceiveAccountDetails", (newSaldo: number, newExtrato: string[]) => {
            setSaldo(newSaldo);
            setExtrato(newExtrato);
        });

        conn.on("Error", (message: string) => {
            alert(message);
        });

        try {
            await conn.start();
            await conn.invoke("GetAccountDetails");
            setConnection(conn);
            setIsLoggedIn(true);
        } catch (err) {
            console.error("Erro ao conectar ao SignalR:", err);
            alert("Falha ao fazer login.");
        }
    };

    const logout = () => {
        connection?.stop();
        setIsLoggedIn(false);
        setCpf('');
        setEmail('');
        setSaldo(0);
        setExtrato([]);
    };

    const openModal = (type: 'deposito' | 'pagamento') => {
        setModalType(type);
        setTransactionAmount("");
        setTransactionDescription('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const submitTransaction = async () => {
        if (Number(transactionAmount) <= 0 || !transactionDescription) {
            alert("Por favor, insira um valor e descrição válidos.");
            return;
        }

        try {
            await connection?.invoke("ProcessTransaction", modalType, Number(transactionAmount.replace(".", "").replace(",", "")), transactionDescription);
            closeModal();
        } catch (err) {
            console.error("Erro ao processar transação:", err);
        }
    };

    return (
        <div className="page-container">
            {!isLoggedIn ? (
                <div className="login-container">
                    <h2 className="login-title">🔐 Login</h2>
                    <input
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="Digite seu CPF"
                        type="text"
                        className="input-field"
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu Email"
                        type="email"
                        className="input-field"
                    />
                    <button onClick={login} className="login-button">
                        Entrar
                    </button>
                </div>
            ) : (
                <div className="account-container">
                    <div className="account-header">
                        <div>
                            <p className="account-info">Logado como:</p>
                            <p className="account-info">CPF: {cpf}</p>
                            <p className="account-info">Email: {email}</p>
                        </div>
                        <button onClick={logout} className="logout-button">Sair</button>
                    </div>
    
                    <h2 className="account-title">💳 Conta Corrente</h2>
    
                    <div className="balance-container">
                        <p className="balance-text"><strong>Saldo Atual:</strong></p>
                        <p className="balance-amount">R$ {saldo.toFixed(2)}</p>
                    </div>
    
                    <div className="action-buttons">
                        <button onClick={() => openModal('deposito')} className="action-button">
                            <span className="action-icon">💰</span>
                            <span className="action-label">Depositar</span>
                        </button>
                        <button onClick={() => openModal('pagamento')} className="action-button">
                            <span className="action-icon">💸</span>
                            <span className="action-label">Pagar</span>
                        </button>
                        <button onClick={() => setShowExtrato(!showExtrato)} className="action-button">
                            <span className="action-icon">📄</span>
                            <span className="action-label">Extrato</span>
                        </button>
                    </div>
    
                    {showExtrato && (
                        <div className="extrato-container">
                            <p className="extrato-title">Últimas movimentações:</p>
                            <ul className="extrato-list">
                                {extrato.map((transaction, index) => (
                                    <li key={index} className="extrato-item">{transaction}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
    
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">
                            {modalType === 'deposito' ? 'Depositar Dinheiro' : 'Pagar Conta'}
                        </h3>
                        <input
                            value={transactionAmount}
                            onChange={(e) => setTransactionAmount(e.target.value)}
                            placeholder="Valor"
                            type="text"
                            className="input-field"
                        />
                        <input
                            value={transactionDescription}
                            onChange={(e) => setTransactionDescription(e.target.value)}
                            placeholder="Descrição"
                            type="text"
                            className="input-field"
                        />
                        <div className="modal-actions">
                            <button
                                onClick={submitTransaction}
                                className="submit-button"
                            >
                                Confirmar
                            </button>
                            <button onClick={closeModal} className="cancel-button">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
}
