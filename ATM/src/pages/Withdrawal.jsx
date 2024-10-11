import React, { useState } from 'react';
import WithdrawAmount from '../componants/withdrawAmount';
import WithdrawConfirm from '../componants/withdrawConfirm';
import Pininp from '../componants/pinInp';
import '../css/Withdraw.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Withdrawal = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(null);

    const handleTokenExpiry = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleAmountSelection = async (amount) => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setErrorMessage('Please enter a valid amount.');
            return;
        }

        if (amount > 20000) {
            setErrorMessage('Maximum withdrawal limit is ₹20,000');
            return;
        }

        setSelectedAmount(amount);
        setErrorMessage('');

        try {
            const response = await axios.get(
                '/api/account-type',
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.accountType) {
                setAccountType(response.data.accountType);
                setErrorMessage('');
                nextStep();
            } else {
                setErrorMessage('Failed to retrieve account details.');
            }
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert('Token has expired. Please log in again.');
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
                '/api/withdraw',
                { amount: selectedAmount, type: accountType, pin: pin },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.message === 'Withdrawal successful') {
                alert(response.data.message);
                navigate('/dashboard');
            }

            setErrorMessage('');
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert('Token has expired. Please log in again.');
                handleTokenExpiry();
            } else if (error.response.data.message === "Insufficient balance") {
                alert(error.response.data.message);
                navigate('/dashboard');
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
            case 3:
                return 'Enter PIN';
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
            {step === 3 && (
                <Pininp value={pin} setValue={setPin} />
            )}
            <div className="button-container">
                {step === 1 && <button className="back"
                    onClick={() => navigate(-1)}
                >  Go Back</button>}
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
                    <button className="continue" onClick={nextStep}>
                        Confirm
                    </button>
                )}
                {step === 3 && (
                    <button className="continue" onClick={handleWithdrawal}>
                        Submit PIN
                    </button>
                )}
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
};

export default Withdrawal;