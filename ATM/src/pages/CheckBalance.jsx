import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Receipt from '../componants/reciept';
import Pininp from '../componants/pinInp';
import { useNavigate } from 'react-router-dom';

const CheckBalance = () => {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pin, setPin] = useState('');
  const [pinSubmitted, setPinSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleTokenExpiry = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchReceiptData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token has expired. Please log in again.');
        handleTokenExpiry();
        return;
      }

      if (!pinSubmitted) {
        return;
      }

      try {
        const response = await axios.post(
          '/api/balance-receipt',
          { pin },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReceiptData(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert('Token has expired. Please log in again.');
          handleTokenExpiry();
        } else if (err.response && err.response.status === 400) {
          setError('Invalid PIN. Please try again.');
          setPinSubmitted(false);
        } else {
          console.error('Error fetching receipt data:', err);
          setError('Failed to fetch data. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchReceiptData();
  }, [navigate, pin, pinSubmitted]);

  const handleSubmitPin = () => {
    if (pin === '') {
      setError('Please enter a PIN.');
      return;
    }
    setError('');
    setPinSubmitted(true);
  };

  if (loading && !pinSubmitted) {
    return (
      <div className="container">
        <h2>Enter PIN</h2>
        <Pininp value={pin} setValue={setPin} />
        <div className="button-container">
          <button className="back"
            onClick={() => navigate(-1)}
          >  Go Back</button>
          <button onClick={handleSubmitPin} className='continue' style={{ margin: 'auto' }}>Submit PIN</button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <Receipt data={receiptData} />;
};

export default CheckBalance;
