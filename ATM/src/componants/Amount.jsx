import React from 'react';

const Amount = () => {
    return (
        <>
            <label htmlFor="amount">Amount to Transfer:</label>
            <input type="text" id="amount" placeholder="₹00.00" />
        </>
    );
};

export default Amount;