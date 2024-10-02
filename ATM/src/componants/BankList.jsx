import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BankList = ({ selectedBank, setTransferData }) => {
    const [banks, setBanks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/banks');
                setBanks(response.data);
            } catch (error) {
                console.error('Error fetching banks:', error.message);
            }
        };

        fetchBanks();
    }, []);

    const handleBankSelection = (e) => {
        setTransferData(prevState => ({ ...prevState, bank: e.target.value }));
    };

    const filteredBanks = banks.filter(bank => bank.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for a bank..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    id="searchInput"
                />
            </div>
            <div className="bank-list">
                {filteredBanks.map((bank, index) => (
                    <div key={index}>
                        <input
                            type="radio"
                            id={`bank${index + 1}`}
                            name="bank"
                            value={bank}
                            checked={selectedBank === bank}
                            onChange={handleBankSelection}
                        />
                        <label htmlFor={`bank${index + 1}`}><span>{bank}</span></label>
                    </div>
                ))}
                {filteredBanks.length === 0 && <p>No banks found</p>}
            </div>
        </>
    );
}

export default BankList;
