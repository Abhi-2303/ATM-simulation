import React, { useState } from 'react';
import WithdrawAmount from '../componants/withdrawAmount';
import WithdrawConfirm from '../componants/withdrawConfirm';
import '../css/Withdraw.css'



const Withdrawal = () => {
    const [step, setStep] = useState(1);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [accountType, setAccountType] = useState('Savings');

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const handleAmountSelection = (amount) => {
        setSelectedAmount(amount);
        nextStep();
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
                {step === 2 && <button className="continue">Confirm</button>}
            </div>
        </div>
    );
};

export default Withdrawal;
