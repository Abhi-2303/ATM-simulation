import React from 'react'
import '../css/reciept.css'

const BankName = "Name Of Bank";
const currentDate = "Sep 2, 2024";
const atmid = "ATM0012345";
const branch = "BANK BRANCH NAME";
const accNo = "12******3456";
const name = "JOY LONARE";
const availBAL = "10,000.85";
const CONT = "6000122201";
const website = "abcbank.in";


const ITEMS = [
    { tag: "Account No", value: accNo },
    { tag: "Account Holder", value: name },
];

let trans = [];

function Reciept() {

    return (
        <div className="recieptBox">
            <div className="header">
                <h1>{BankName}</h1>
                <sup>{currentDate}</sup>
                <div>
                    <span>ATM ID: {atmid}</span>
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
                    {trans && trans.length > 0 && (
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
                <p>For assistance, call: <a href={`tel:${CONT}`}>{CONT}</a> or visit our {website}.</p>
                <p>Never share your PIN with anyone.</p>
            </div>
        </div>
    )
}

export default Reciept

