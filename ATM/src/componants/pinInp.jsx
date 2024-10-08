import React, { useRef, useEffect } from 'react';

export default function Pininp({ value, setValue }) {
    const inputRefs = useRef([]);

    const handleInput = (e, index) => {
        const { value } = e.target;
        const numericValue = value.replace(/\D/g, '');

        e.target.value = numericValue;

        const updatedPin = inputRefs.current.map(input => input.value).join('');
        setValue(updatedPin); 

        if (numericValue.length === e.target.maxLength) {
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '') {
            const prevInput = inputRefs.current[index - 1];
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    useEffect(() => {
        const values = value.split('');
        inputRefs.current.forEach((input, index) => {
            input.value = values[index] || '';
        });
    }, [value]);

    return (
        <form className='pin'>
            {Array.from({ length: 4 }).map((_, index) => (
                <input
                    key={index}
                    type="password"  
                    name={`pin_${index + 1}`}
                    className="pin-input"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    inputMode="numeric"
                    pattern="\d*"
                    style={{ width: '3rem' }}
                />
            ))}
        </form>
    );
}
