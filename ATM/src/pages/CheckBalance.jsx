import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Receipt from '../componants/reciept';

const CheckBalance = () => {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/balance-receipt', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReceiptData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching receipt data:', err);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Receipt data={receiptData} />
  );
};

export default CheckBalance;
 