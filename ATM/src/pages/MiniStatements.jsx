import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Receipt from '../componants/reciept';
import { useNavigate } from 'react-router-dom'; 

const MiniStatements = () => {
    const [miniStatementData, setMiniStatementData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleTokenExpiry = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const fetchMiniStatement = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Token has expired. Please log in again.');
                handleTokenExpiry();
                return;
            }

            try {
                const response = await axios.get('/api/mini-statement', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setMiniStatementData({
                    bankName: response.data.bankName,
                    currentDate: response.data.currentDate,
                    atmId: response.data.atmId,
                    branch: response.data.branch,
                    ITEMS: [
                        { tag: 'Account Number', value: response.data.accountNumber },
                        { tag: 'Customer Name', value: response.data.customerName },
                    ],
                    trans: response.data.transactions,
                    availBAL: response.data.availableBalance,
                    CONT: response.data.contactInfo,
                    website: response.data.website,
                });

                setLoading(false);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    alert('Token has expired. Please log in again.');
                    handleTokenExpiry();
                } else {
                    setError('Error fetching mini-statement.');
                    setLoading(false);
                }
            }
        };

        fetchMiniStatement();
    }, [navigate]); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <Receipt data={miniStatementData} />;
};

export default MiniStatements;
