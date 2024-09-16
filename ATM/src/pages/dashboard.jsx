import React from 'react';
import '../css/dashboard.css';

const GRID_ITEMS = [
    { id: 'mini-statements', src: 'icons/bank.png', text: 'Mini Statements' },
    { id: 'withdrawal', src: 'icons/atm.png', text: 'Withdrawal' },
    { id: 'check-balance', src: 'icons/check-balance.png', text: 'Check Balance' },
    { id: 'deposit', src: 'icons/piggy-bank.png', text: 'Deposit' },
    { id: 'transfers', src: 'icons/transfer.png', text: 'Transfers' },
    { id: 'change-pin', src: 'icons/reset-password.png', text: 'Change PIN' },
];

const user ="Avi";
const tstatus = "withdrawal";
const amount = "1000.00";
const dateNtime = "23 Sep,2024 19:34:22 "


const Dashboard = () => {
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
                {GRID_ITEMS.map(({ id, src, text }) => (
                    <div className="grid-item" key={id}>
                        <img src={src} alt={text} />
                        <sub>{text}</sub>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
