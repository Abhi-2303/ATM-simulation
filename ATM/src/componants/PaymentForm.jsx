
import React from 'react';

const PaymentForm = () => {
    return (
        <>
            <label htmlFor="beneficiary_name">Beneficiary Full Name</label>
            <input
                id="beneficiary_name"
                className="input-field"
                type="text"
                placeholder="Enter full name"
            />
            <label htmlFor="account_number">Account Number</label>
            <input
                id="account_number"
                type="number"
                placeholder="Enter account number"
            />
        </>
    );
};

export default PaymentForm;