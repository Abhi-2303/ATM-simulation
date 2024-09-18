import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const Dashboard = () => {
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); 

            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/dashboard', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        setUserData(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            else {
                navigate('/cardpin'); 
                return;
            }
        };

        fetchData();
    }, []);
    return (
        <div className="container">
            <h1>Welcome, {userData.customer_name}!</h1>
            <div className="prev-tran">
                <strong className="box box-1">{userData.transaction_type}</strong>
                <div className="box box-2">{userData.date_time}</div>
                <div className="box box-3">₹{userData.amount}</div>
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
