import React, { useState } from 'react';
import '../css/transfer.css';
import BankList from '../componants/BankList';
import PaymentForm from '../componants/PaymentForm';
import Amount from '../componants/Amount';
import ConfirmTransfer from '../componants/ConfirmTransfer';

const Transfer = () => {
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(prevStep => prevStep + 1);

  const prevStep = () => setStep(prevStep => prevStep - 1);

  const getTitle = () => {
    switch (step) {
      case 1:
        return 'Select Beneficiary Bank';
      case 2:
        return 'Enter Beneficiary Details';
      case 3:
        return 'Enter Transfer Amount';
      case 4:
        return 'Confirm Transfer Details';
      default:
        return 'Transfer Money';
    }
  };

  return (
    <div className="container">
      <h2>{getTitle()}</h2>
      <div className={`details ${step === 4 ? 'disable' : ''}`}>
        {step === 1 && <BankList />}
        {step === 2 && <PaymentForm />}
        {step === 3 && <Amount />}
        {step === 4 && <ConfirmTransfer />}
      </div>
      <div className="button-container">
        {step > 1 && <button className="back" onClick={prevStep}>Back</button>}
        {step < 4 ? (
          <button className="continue" onClick={nextStep}>Continue</button>
        ) : (
          <button className="continue">Confirm</button>
        )}
      </div>
    </div>
  );
}

export default Transfer;
