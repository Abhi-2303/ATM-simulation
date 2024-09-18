import React, { useState } from 'react';
import '../css/cardpin.css';
import Pininp from '../componants/pinInp';

function ChangePIN() {
  const [currentStep, setCurrentStep] = useState(0);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [reenterPin, setReenterPin] = useState('');

  const titles = ["Enter Old PIN", "Enter New PIN", "Re-enter New PIN"];

  const handleContinue = () => {
    if (currentStep === 0 && oldPin.length === 4) {
      setCurrentStep(1);
    } else if (currentStep === 1 && newPin.length === 4) {
      setCurrentStep(2);
    } else if (currentStep === 2 && reenterPin.length === 4) {
      if (newPin === reenterPin) {
        alert("PIN successfully changed!");
        setCurrentStep(0);
      } else {
        alert("Pins do not match. Please try again.");
      }
    }
  };

  const handlePinInput = (pin) => {
    if (currentStep === 0) {
      setOldPin(pin);
    } else if (currentStep === 1) {
      setNewPin(pin);
    } else if (currentStep === 2) {
      setReenterPin(pin);
    }
  };

  return (
    <div className="card-container">
      <h1>{titles[currentStep]}</h1>
      <div className="input">
        <Pininp key="pininp" value={currentStep === 0 ? oldPin : currentStep === 1 ? newPin : reenterPin} setValue={handlePinInput} />
      </div>
      <div className="button">
        <button onClick={handleContinue}>
          {currentStep === 2 ? 'Submit' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default ChangePIN;
