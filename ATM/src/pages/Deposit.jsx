import React, { useState, useEffect } from 'react';
import DepositAmount from '../componants/depositAmount';
import DepositImg from '../componants/depositImg';
import DepositConfirm from '../componants/depositConfirm';
import '../css/withdraw.css';
import axios from 'axios';

const Deposit = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 2);

  const getTitle = () => {
    switch (step) {
      case 1:
        return 'Enter Deposit Amount';
      case 2:
        return 'Inserting Cash';
      case 3:
        return 'Confirm Deposit';
      default:
        return 'Deposit Funds';
    }
  };

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        nextStep();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setAmount(value);
      setErrorMessage(''); 
    }
  };

  const handleDeposit = async () => {
    try {
      const response = await axios.post(
        '/api/deposit',{ amount },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      nextStep();
      setErrorMessage(response.data.message)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Deposit error: An unknown error occurred');
    }
  };

  return (
    <div className="container">
      <h2>{getTitle()}</h2>
      <div className={`details ${step === 3 ? 'disable' : ''}`}>
        {step === 1 && (
          <DepositAmount
            amount={amount}
            onAmountChange={handleAmountChange}
          />
        )}
        {step === 2 && <DepositImg />}
        {step === 3 && <DepositConfirm amount={amount} />}
      </div>
      <div className="button-container">
        {step === 1 && (
          <button
            className="continue"
            onClick={nextStep}
            disabled={!amount || amount <= 0}
          >
            Insert Cash
          </button>
        )}
        {step === 3 && (
          <>
            <button className="back" onClick={prevStep}>Back</button>
            <button className="continue" onClick={handleDeposit}>Confirm</button>
          </>
        )}
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Deposit;
