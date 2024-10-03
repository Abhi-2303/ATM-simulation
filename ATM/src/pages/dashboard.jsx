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
                    const response = await axios.get('/api/dashboard', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 200) {
                        setUserData(response.data);
                    } else {
                        // Handle other non-200 responses
                        handleTokenExpiry();
                    }
                } catch (error) {
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        // Token expired or unauthorized, handle expiration
                        handleTokenExpiry();
                    } else {
                        console.error('Error fetching data:', error);
                    }
                }
            }
            else {
                navigate('/');

            }
        };

        const handleTokenExpiry = () => {
            localStorage.removeItem('token');
            navigate('/');
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="container">
            <h2>Welcome, {userData.customer_name || 'User'}!</h2>
            <div className="prev-tran">
                <strong className="box box-1">{userData.transaction_type || 'Transaction'}</strong>
                <div className="box box-2">{userData.date_time || 'Date'}</div>
                <div className="box box-3">₹{userData.amount || '0.00'}</div>
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
