import React, { useState } from 'react';
import axios from 'axios';
import '../css/admin.css'; 

function AdminPage() {
    const [cardNumber, setCardNumber] = useState('');
    const [cardData, setCardData] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setError('');
        setSuccessMessage('');
        setCardData(null);

        if (cardNumber.length !== 12) {
            setError('Please enter a valid 12-digit card number.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`/api/cards/${cardNumber}`);
            setCardData(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Card not found.');
            } else {
                setError('Error connecting to the server.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCardAction = async (action) => {
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('/api/update-card-status', { cardNumber, action });
            setSuccessMessage(response.data.message);
            handleSearch(); 
        } catch (err) {
            setError('Failed to update card status.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div className="container">
                <h2>Admin Dashboard</h2>
            <div className="details" >
                <input id="searchInput"
                    type="text"
                    placeholder="Enter card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: '70%' }}
                />
                <button className='continue' onClick={handleSearch} style={{ width: '30%' }} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            {cardData && (
                <div className="card-info">
                    <p><strong>Card Number:</strong> {cardData.card_no}</p>
                    <p><strong>Status:</strong> {cardData.status}</p>
                    <p><strong>Owner:</strong> {cardData.customer_name}</p>
                    <p><strong>Expiration:</strong> {cardData.expiry_date}</p>

                    <div className="action-buttons">
                        {cardData.status === 'blocked' ? (
                            <button className='continue' style={{width:'60%'}} onClick={() => handleCardAction('unblock')}>Unblock Card</button>
                        ) : (
                                <button className='continue' onClick={() => handleCardAction('block')}>Block Card</button>
                        )}
                    </div>
                </div>
            )}
            <div className="logout"><button className="back" onClick={handleLogout}>Logout</button></div>
        </div>
    );
}

export default AdminPage;
