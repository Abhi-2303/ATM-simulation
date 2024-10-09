import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from './input';
import Pininp from './pinInp';
import '../css/card.css';
import '../css/pin.css';
import { useNavigate } from 'react-router-dom';

function CardPin() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);
  const navigate = useNavigate();

  const titles = ["Enter Card Number", "Enter Your PIN"];

  const handleNextStep = async () => {
    if (currentStep === 0 && cardNumber.length === 12) {
      try {
        const response = await axios.post('/api/login', { cardNumber });

        // Check for expired card
        if (response.data.message === 'Card is expired') {
          setError(response.data.message);
        }

        if (response.status === 200 && response.data.message === 'Card found, please enter your PIN') {
          setCurrentStep(1);
          setError("");
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError('Card not found');
          } else if (err.response.status === 429) {
            const retryTime = err.response.headers['retry-after'] || 60;
            setRetryAfter(parseInt(retryTime, 10));
            setError(`Too many login attempts. Please try again in ${retryTime} seconds.`);
          } else {
            setError('Error connecting to server');
          }
        } else {
          setError('Error connecting to server');
        }
      }
    } else if (currentStep === 1 && pin.length === 4) {
      try {
        const response = await axios.post('/api/login', { cardNumber, pin });

        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          navigate('/dashboard');
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 400) {
            setError('Invalid PIN');
          } else if (err.response.status === 429) {
            const retryTime = err.response.headers['retry-after'] || 60;

            setRetryAfter(parseInt(retryTime, 10));
            setError(`Too many login attempts. Please try again in ${retryTime} seconds.`);
          } else {
            setError('Error connecting to server');
          }
        } else {
          setError('Error connecting to server');
        }
      }
    } else {
      setError("Please complete the required input");
    }
  };

  useEffect(() => {
    let timer;
    if (retryAfter > 0) {
      timer = setInterval(() => {
        setRetryAfter(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [retryAfter]);

  const steps = [
    <Input key="cardinp" value={cardNumber} setValue={setCardNumber} nextStep={handleNextStep} />,
    <Pininp key="pininp" value={pin} setValue={setPin} />
  ];

  return (
    <div className="card-container">
      <h2>{titles[currentStep]}</h2>
      <div className="input">
        {steps[currentStep]}
      </div>
      <div className="button-container" style={{ justifyContent: 'center' }}>
        {currentStep > 0 && <button className="back" onClick={() => setCurrentStep((prevStep) => prevStep - 1)}>Back</button>}
        <button className="continue" onClick={handleNextStep}>
          {currentStep === 1 ? "Submit" : "Continue"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {retryAfter > 0 && <p className="retry-timer">Retry in {retryAfter} seconds.</p>}
    </div>
  );
}

export default CardPin;
