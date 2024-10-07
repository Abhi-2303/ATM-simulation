import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Receipt from '../componants/reciept';
import { useNavigate } from 'react-router-dom'; 

const CheckBalance = () => {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  const handleTokenExpiry = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchReceiptData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        handleTokenExpiry();
        return;
      }

      try {
        const response = await axios.get('/api/balance-receipt', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReceiptData(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          handleTokenExpiry();
        } else {
          console.error('Error fetching receipt data:', err);
          setError('Failed to fetch data. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchReceiptData();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <Receipt data={receiptData} />;
};

export default CheckBalance;
