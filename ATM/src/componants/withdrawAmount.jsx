

import React from 'react';

const WithdrawAmount = ({ onSelectAmount }) => {
    const handlePresetAmount = (amount) => {
        onSelectAmount(amount);
    };

    return (
        <>
            <div className="withdraw-options">
                <h3>Withdraw</h3>
                <label>Choose Withdrawal Amount:</label>
                <div className="button-container w">
                    <button onClick={() => handlePresetAmount(500)}>₹500</button>
                    <button onClick={() => handlePresetAmount(1000)}>₹1000</button>
                    <button onClick={() => handlePresetAmount(2000)}>₹2000</button>
                    <button onClick={() => handlePresetAmount(5000)}>₹5000</button>
                </div>
            </div>
            <hr />
            <div className="custom-amount">
                <h3>Custom Amount</h3>
                <label htmlFor="amount">Enter Amount in Rupees:</label>
                <input id="amount" type="number" placeholder="Enter custom amount" />
            </div>
        </>
    );
};

export default WithdrawAmount;
