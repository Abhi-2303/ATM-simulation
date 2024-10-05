import React from 'react';

const WithdrawConfirm = ({ amount, accountType }) => {
    return (
        <div className="cmessage">
            You are withdrawing <strong>₹{amount}</strong> from your <strong>{accountType} Account</strong>.
        </div>
    );
};

export default WithdrawConfirm;
