import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/reciept.css"

const Receipt = ({ data }) => {
    const navigate = useNavigate();
    const {
        bankName,
        currentDate,
        atmId,
        branch,
        ITEMS = [],
        trans = [],
        amount,
        availBAL,
        CONT,
        website,
    } = data || {};

    const handlePrint = () => {
        window.print();
    };

    const goToDashboard = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="recieptBox">
            <div className="arrow" onClick={goToDashboard}>
                <img src="icons/leftarrow.gif" alt="back" height={20} />
            </div>
            <div className="header">
                <h1>{bankName}</h1>
                <sup>{currentDate}</sup>
                <div>
                    <sup>ATM ID: {atmId}</sup>
                    <sup>{branch}</sup>
                </div>
            </div>
            <hr />
            <div className="content">
                <table>
                    <tbody>
                        {ITEMS.map(({ tag, value }, index) => (
                            <tr key={index}>
                                <td>{tag}</td>
                                <td>:</td>
                                <td><sup>{value}</sup></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <hr />
                <div className="info">
                    {trans.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>DATE</th>
                                    <th>TRAN ID</th>
                                    <th>AMOUNT</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trans.map(({ date, tid, amount, tstatus }, index) => (
                                    <tr key={index}>
                                        <td>{date}</td>
                                        <td>{tid}</td>
                                        <td>{amount}</td>
                                        <td>{tstatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {amount && (<p>Amount: ₹{amount}</p>)}
                    <p>Available Balance: ₹{availBAL}</p>
                </div>
            </div>
            <div className="message">
                <p>For assistance, call: <a href={`tel:${CONT}`}>{CONT}</a> or visit our  <a href={`${website}`}>{website}</a>.</p>
                <p>Never share your PIN with anyone.</p>
            </div>
            <div className="print" onClick={handlePrint}>
                <img src="icons/printer.png" alt="print" height={50} />
            </div>
        </div>
    );
}

export default Receipt;
