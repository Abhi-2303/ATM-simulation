import axios from 'axios';
import '../css/transfer.css';
import React, { useState } from 'react';
import Amount from '../componants/Amount';
import Pininp from '../componants/pinInp';
import BankList from '../componants/BankList';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../componants/PaymentForm';
import ConfirmTransfer from '../componants/ConfirmTransfer';


const Transfer = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [transferData, setTransferData] = useState({
    bank: '',
    beneficiaryName: '',
    reciverAccNo: '',
    amount: ''
  });

  const handleTokenExpiry = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const nextStep = async () => {
    if (validateStep(step)) {
      if (step === 2 || step === 5) {
        try {
          const response = await axios.post('/api/transfer', {
            bank: transferData.bank,
            name: transferData.beneficiaryName,
            reciverAccNo: transferData.accountNumber,
            ...(step === 5 && { amount: transferData.amount, pin: pin })
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.data.message === 'The selected bank does not correspond to the beneficiary’s bank.') {
            setErrorMessage(response.data.message);
          } else if (response.data.message === 'Invalid amount') {
            setErrorMessage(response.data.message);
          }
          else if (response.data.message === 'Transfer successful') {
            alert(response.data.message);
            navigate('/dashboard');
          }
          else {
            setStep(prevStep => prevStep + 1);
          }

        } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            alert('Token has expired. Please log in again.');
            handleTokenExpiry();
          } else if (error.response.data.message === 'Insufficient balance') {
            alert(error.response.data.message);
            navigate('/dashboard');
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
      case 5:
        return 'Enter PIN';
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
        {step === 5 && (
          <Pininp value={pin} setValue={setPin} />
        )}
      </div>
      <div className="button-container">
        {step === 1 && <button className="back"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>}
        {step > 1 && <button className="back" onClick={prevStep}>Back</button>}
        <button className="continue" onClick={nextStep}>
          {step === 5 ? 'Submit' : step < 4 ? 'Continue' : 'Confirm'}
        </button>
      </div>
      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
}

export default Transfer;
