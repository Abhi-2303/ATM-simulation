import React, { useState } from 'react';
import WithdrawAmount from '../componants/withdrawAmount';
import WithdrawConfirm from '../componants/withdrawConfirm';
import '../css/Withdraw.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  

const Withdrawal = () => {
    const [step, setStep] = useState(1);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [accountType, setAccountType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    const handleTokenExpiry = () => {
        localStorage.removeItem('token');
        navigate('/');  
    };

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleAmountSelection = async (amount) => {
        setSelectedAmount(amount);

        try {
            const response = await axios.get(
                'http://localhost:5000/api/account-type',
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.accountType) {
                setAccountType(response.data.accountType);
                setErrorMessage('');
                nextStep();
            } else {
                setErrorMessage('Failed to retrieve account type.');
            }
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                handleTokenExpiry();  
            } else if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Something went wrong. Please try again.');
            }
        }
    };

    const handleWithdrawal = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/withdraw',
                { amount: selectedAmount, type: accountType },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.message === 'Withdrawal successful') {
                alert(response.data.message);
            }

            setErrorMessage('');
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                handleTokenExpiry(); 
            } else if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Something went wrong. Please try again.');
            }
        }
    };

    const getTitle = () => {
        switch (step) {
            case 1:
                return 'Select Withdrawal Amount';
            case 2:
                return 'Confirm Withdrawal';
            default:
                return 'Withdrawal';
        }
    };

    return (
        <div className="container">
            <h2>{getTitle()}</h2>
            {step === 1 && (
                <WithdrawAmount onSelectAmount={handleAmountSelection} />
            )}
            {step === 2 && (
                <WithdrawConfirm amount={selectedAmount} accountType={accountType} />
            )}
            <div className="button-container">
                {step > 1 && <button className="back" onClick={prevStep}>Back</button>}
                {step === 1 && (
                    <button
                        className="continue"
                        onClick={() => handleAmountSelection(document.getElementById('amount').value)}
                    >
                        Proceed ➡
                    </button>
                )}
                {step === 2 && (
                    <button className="continue" onClick={handleWithdrawal}>
                        Confirm
                    </button>
                )}
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
};

export default Withdrawal;
