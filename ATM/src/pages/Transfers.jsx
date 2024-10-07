import React, { useState } from 'react';
import axios from 'axios';
import '../css/transfer.css';
import BankList from '../componants/BankList';
import PaymentForm from '../componants/PaymentForm';
import Amount from '../componants/Amount';
import ConfirmTransfer from '../componants/ConfirmTransfer';
import { useNavigate } from 'react-router-dom';  

const Transfer = () => {
  const [step, setStep] = useState(1);
  const [transferData, setTransferData] = useState({
    bank: '',
    beneficiaryName: '',
    reciverAccNo: '',
    amount: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); 
  const handleTokenExpiry = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const nextStep = async () => {
    if (validateStep(step)) {
      if (step === 2 || step === 3 || step === 4) {
        try {
          const response = await axios.post('/api/transfer', {
            bank: transferData.bank,
            name: transferData.beneficiaryName,
            reciverAccNo: transferData.accountNumber,
            ...(step === 3 && { amount: transferData.amount })
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.data.message === 'The selected bank does not correspond to the beneficiary’s bank.') {
            setErrorMessage(response.data.message);
          } else if (step === 3 && response.data.message === 'Invalid amount') {
            setErrorMessage(response.data.message);
          } else {
            setStep(prevStep => prevStep + 1);
          }

        } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            handleTokenExpiry(); 
          } else if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('Error during the transfer process.');
          }
          console.error(error);
        }
      } else {
        setStep(prevStep => prevStep + 1);
      }
    }
  };

  const prevStep = () => setStep(prevStep => prevStep - 1);

  const validateStep = (currentStep) => {
    const { bank, beneficiaryName, accountNumber, amount } = transferData;

    if (currentStep === 1 && !bank) {
      setErrorMessage('Please select a bank.');
      return false;
    }
    if (currentStep === 2 && (!beneficiaryName || !accountNumber)) {
      setErrorMessage('Please enter all beneficiary details.');
      return false;
    }
    if (currentStep === 3 && (!amount || isNaN(amount) || parseFloat(amount) <= 0)) {
      setErrorMessage('Please enter a valid transfer amount.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

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
        {step === 1 && (
          <BankList
            selectedBank={transferData.bank}
            setTransferData={setTransferData}
          />
        )}
        {step === 2 && (
          <PaymentForm
            beneficiaryName={transferData.beneficiaryName}
            accountNumber={transferData.accountNumber}
            setTransferData={setTransferData}
          />
        )}
        {step === 3 && (
          <Amount
            amount={transferData.amount}
            setTransferData={setTransferData}
          />
        )}
        {step === 4 && <ConfirmTransfer transferData={transferData} />}
      </div>
      <div className="button-container">
        {step > 1 && <button className="back" onClick={prevStep}>Back</button>}
        {step < 4 ? (
          <button className="continue" onClick={nextStep}>Continue</button>
        ) : (
          <button className="continue" onClick={() => alert('Transfer confirmed!')}>Confirm</button>
        )}
      </div>
      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
}

export default Transfer;
