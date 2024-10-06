import React from 'react';

const DepositConfirm = ({ amount }) => {
    return (
        <div className="cmessage">
            Confirm Deposit: <strong>₹{amount}</strong>
        </div>
    );
};

export default DepositConfirm;
