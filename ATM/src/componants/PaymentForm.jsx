import React from 'react';

const PaymentForm = ({ beneficiaryName = '', accountNumber = '', setTransferData }) => {
    const handleChange = (e) => {
        const { id, value } = e.target;
        setTransferData(prevState => ({ ...prevState, [id]: value }));
    };

    return (
        <>
            <label htmlFor="beneficiaryName">Beneficiary Full Name</label>
            <input
                id="beneficiaryName"
                className="input-field"
                type="text"
                placeholder="Enter full name"
                value={beneficiaryName}
                onChange={handleChange}
            />
            <label htmlFor="accountNumber">Account Number</label>
            <input
                id="accountNumber"
                type="number"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={handleChange}
            />
        </>
    );
};

export default PaymentForm;
