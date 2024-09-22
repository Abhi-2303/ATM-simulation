import React from 'react';

const ConfirmTransfer = () => {
    return (
        <>
            <label>Recipient Bank:</label>
            <input type="text" value="Selected Bank" readOnly />
            <label>Recipient Account Number:</label>
            <input type="text" value="123456789" readOnly />
            <label>Recipient Account Name:</label>
            <input type="text" value="John Doe" readOnly />
            <label>Transfer Amount:</label>
            <input type="text" value="$500.00" readOnly />
        </>
    );
};

export default ConfirmTransfer;