import React, { useState } from 'react';
import Input from './input';
import Pininp from './pinInp';
import '../css/cardpin.css';

function CardPin() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const titles = ["Enter Card Number", "Enter Your PIN"];

  const handleNextStep = () => {
    if (currentStep === 0 && cardNumber.length === 12) {
      setCurrentStep(1);
    } else if (currentStep === 1 && pin.length === 4) {
      // Handle form submission here
      alert('Form Submitted');
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
