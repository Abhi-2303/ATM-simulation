import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Receipt from '../componants/reciept';
import { useNavigate } from 'react-router-dom';
import Pininp from '../componants/pinInp';

const MiniStatements = () => {
    const [miniStatementData, setMiniStatementData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [pin, setPin] = useState('');

    const handleTokenExpiry = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const fetchMiniStatement = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Token has expired. Please log in again.');
            handleTokenExpiry();
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/mini-statement', { pin },
                {
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
            console.log()
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert('Token has expired. Please log in again.');
                handleTokenExpiry();
            } else if (error.response && error.response.status === 400) {
                setError('Invalid PIN. Please try again.');
                setPinSubmitted(false);
            } else {
                setError('Error fetching mini-statement.');
                setLoading(false);
            }
        }
    };


    const handleSubmit = () => {
        if (pin.length !== 4) {
            setError('Please enter a valid 4-digit PIN');
            return;
        }
        setError('');
        fetchMiniStatement();
    };

    return (
        <>
            {!miniStatementData ? (
                <div className="container">
                    <h2>Enter PIN </h2>
                    <Pininp value={pin} setValue={setPin} />
                    <div className="button-container">
                        <button className="back"
                            onClick={() => navigate(-1)}
                        >Go Back</button>

                        <button onClick={handleSubmit} className='continue' style={{ margin: '0 auto' }}>Submit PIN</button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </div>
            ) : (
                <Receipt data={miniStatementData} />
            )}
            {(error !== "Invalid PIN. Please try again.") ? (loading && <div>Loading...</div>) : null}

        </>
    );
};

export default MiniStatements;
