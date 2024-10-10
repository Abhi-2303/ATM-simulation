import DepositConfirm from '../componants/depositConfirm';
import DepositAmount from '../componants/depositAmount';
import React, { useState, useEffect } from 'react';
import DepositImg from '../componants/depositImg';
import Pininp from '../componants/pinInp';
import '../css/withdraw.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const getTitle = () => {
    switch (step) {
      case 1:
        return 'Enter Deposit Amount';
      case 2:
        return 'Confirm Deposit';
      case 3:
        return 'Enter PIN';
      case 4:
        return 'Inserting Cash';
      default:
        return 'Deposit Funds';
    }
  };

  useEffect(() => {
    if (step === 4) {
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

  const handleTokenExpiry = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDeposit = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Token has expired. Please log in again.');
      handleTokenExpiry();
      return;
    }

    try {
      const response = await axios.post(
        '/api/deposit',
        { amount, pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      nextStep();
      setErrorMessage(response.data.message);
      if (response.data.message === "Deposit successful") {
        alert('Deposit successful');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        alert('Token has expired. Please log in again.');
        handleTokenExpiry();
      } else {
        setErrorMessage(error.response?.data?.message || 'Deposit error: An unknown error occurred');
      }
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
        {step === 2 && <DepositConfirm amount={amount} />}
        {step === 3 && <Pininp value={pin} setValue={setPin} />}
        {step === 4 && <DepositImg />}
      </div>
      <div className="button-container">
        {step === 1 && (
          <>
            <button className="back"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button className="continue"
              onClick={() => {
                (!amount || amount <= 0)
                  ? setErrorMessage('Please enter a valid amount')
                  : nextStep();
              }}
            >
              Continue
            </button>
          </>

        )}
        {step === 2 && (
          <>
            <button className="back" onClick={prevStep}>Back</button>
            <button className="continue" onClick={nextStep}>Confirm</button>
          </>
        )}
        {step === 3 && (
          <button className="continue" onClick={handleDeposit}>
            Submit PIN
          </button>
        )}

      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Deposit;
