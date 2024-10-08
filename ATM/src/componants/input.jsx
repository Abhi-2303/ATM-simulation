import React, { useState, useEffect } from 'react';

export default function Input({ value, setValue }) {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setDisplayValue(formattedValue);

    }, [value]);

    const handleChange = (event) => {
        const numericValue = event.target.value.replace(/\D/g, '');
        setValue(numericValue);
    };

    return (
        <input
            type="text"
            className="cardNO"
            name="card_number"
            id="card_number"
            placeholder="xxxx xxxx xxxx"
            value={displayValue}
            onChange={handleChange}
            maxLength="14"
        />
    );
}
