import React, { useState } from 'react';
import axios from 'axios';
import Input from './input';
import Pininp from './pinInp';
import '../css/cardpin.css';
import { useNavigate } from 'react-router-dom';

function CardPin() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const titles = ["Enter Card Number", "Enter Your PIN"];

  const handleNextStep = async () => {
    if (currentStep === 0 && cardNumber.length === 12) {
      try {
        const response = await axios.post('http://localhost:5000/api/login', { cardNumber });
        if (response.status === 200 && response.data.message === 'Card found, please enter your PIN') {
          setCurrentStep(1);
          setError("");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Card not found');
        } else {
          setError('Error connecting to server');
        }
      }
    } else if (currentStep === 1 && pin.length === 4) {
      try {
        const response = await axios.post('http://localhost:5000/api/login', { cardNumber, pin });
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token); 
          navigate('/dashboard');
        }
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setError('Invalid PIN');
        } else {
          setError('Error connecting to server');
        }
      }
    } else {
      setError("Please complete the required input");
    }
  };

  const steps = [
    <Input key="cardinp" value={cardNumber} setValue={setCardNumber} nextStep={handleNextStep} />,
    <Pininp key="pininp" value={pin} setValue={setPin} />
  ];

  return (
    <div className="card-container">
      <h1>{titles[currentStep]}</h1>
      <div className="input">
        {steps[currentStep]}
      </div>
      <div className="button">
        <button onClick={handleNextStep}>
          {currentStep === 1 ? "Submit" : "Continue"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CardPin;
