import React from 'react';

const DepositAmount = ({ amount, onAmountChange }) => {
    return (
        <div className="custom-amount">
            <h3>Amount</h3>
            <label htmlFor="amount">Enter Amount in Rupees:</label>
            <input
                id="amount"
                type="number"
                value={amount}
                onChange={onAmountChange}
                placeholder="Enter deposit amount"
                min="0" 
            />
        </div>
    );
};

export default DepositAmount;
