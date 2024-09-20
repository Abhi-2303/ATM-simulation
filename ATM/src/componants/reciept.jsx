import React from 'react';
import "../css/reciept.css"

const Receipt = ({ data }) => {
    const {
        bankName,
        currentDate,
        atmId,
        branch,
        ITEMS = [],
        trans = [],
        availBAL,
        CONT,
        website,
    } = data || {};

    return (
        <div className="recieptBox">
            <div className="header">
                <h1>{bankName}</h1>
                <sup>{currentDate}</sup>
                <div>
                    <span>ATM ID: {atmId}</span>
                    <span>{branch}</span>
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

                    <p>Available Balance: ₹{availBAL}</p>
                </div>
            </div>
            <div className="message">
                <p>For assistance, call: <a href={`tel:${CONT}`}>{CONT}</a> or visit our  <a href={`${website}`}>{website}</a>.</p>
                <p>Never share your PIN with anyone.</p>
            </div>
        </div>
    );
}

export default Receipt;
