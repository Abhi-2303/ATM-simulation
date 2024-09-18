import React from 'react';
import '../css/dashboard.css';
import { useNavigate } from 'react-router-dom';

const GRID_ITEMS = [
    { id: 'mini-statements', src: 'icons/bank.png', text: 'Mini Statements', path: '/mini-statements' },
    { id: 'withdrawal', src: 'icons/atm.png', text: 'Withdrawal', path: '/withdrawal' },
    { id: 'check-balance', src: 'icons/check-balance.png', text: 'Check Balance', path: '/check-balance' },
    { id: 'deposit', src: 'icons/piggy-bank.png', text: 'Deposit', path: '/deposit' },
    { id: 'transfers', src: 'icons/transfer.png', text: 'Transfers', path: '/transfers' },
    { id: 'change-pin', src: 'icons/reset-password.png', text: 'Change PIN', path: '/change-pin' },
];

const user = "Avi";
const tstatus = "withdrawal";
const amount = "1000.00";
const dateNtime = "23 Sep,2024 19:34:22";

const Dashboard = () => {
    const navigate = useNavigate(); // Move useNavigate inside the component

    const handleNextStep = () => {
        navigate('/withdrawal');
    };

    return (
        <div className="container">
            <h1>Welcome, {user}!</h1>
            <div className="prev-tran">
                <strong className="box box-1">{tstatus}</strong>
                <div className="box box-2">{dateNtime}</div>
                <div className="box box-3">₹{amount}</div>
            </div>
            <hr />
            <div className="grid">
                {GRID_ITEMS.map(({ id, src, text, path }) => (
                    <div className="grid-item" key={id} onClick={() => navigate(path)}>
                        <img src={src} alt={text} />
                        <sub>{text}</sub>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
