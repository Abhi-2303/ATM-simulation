import React from 'react';

const ConfirmTransfer = ({ transferData }) => {
    const { bank, beneficiaryName, accountNumber, amount } = transferData;

    return (
        <>
            <label>Recipient Bank:</label>
            <input type="text" value={bank} readOnly />
            <label>Recipient Account Number:</label>
            <input type="text" value={accountNumber} readOnly />
            <label>Recipient Account Name:</label>
            <input type="text" value={beneficiaryName} readOnly />
            <label>Transfer Amount:</label>
            <input type="text" value={`₹${amount}`} readOnly />
        </>
    );
};

export default ConfirmTransfer;
