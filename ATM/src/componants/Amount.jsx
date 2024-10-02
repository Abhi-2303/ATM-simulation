import React from 'react';

const Amount = ({ amount, setTransferData }) => {
    const handleChange = (e) => {
        setTransferData(prevState => ({ ...prevState, amount: e.target.value }));
    };

    return (
        <>
            <label htmlFor="amount">Amount to Transfer:</label>
            <input
                type="number"
                id="amount"
                placeholder="₹00.00"
                value={amount}
                onChange={handleChange}
            />
        </>
    );
};

export default Amount;
