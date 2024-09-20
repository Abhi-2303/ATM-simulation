require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { comparePassword } = require('./hashed_pass');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_KEY = process.env.JWT_KEY;

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_KEY);
        req.cardNumber = decoded.cardNumber;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
        console.error('Token verification error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login route
app.post('/api/login', async (req, res) => {
    const { cardNumber, pin } = req.body;

    try {
        const query = 'SELECT * FROM card WHERE Card_No = $1';
        const { rows } = await pool.query(query, [cardNumber]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Card not found' });
        }

        if (!pin) {
            return res.status(400).json({ message: 'Card found, please enter your PIN' });
        }

        const isMatch = await comparePassword(pin, rows[0].pin);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid PIN' });
        }

        const token = jwt.sign({ cardNumber: rows[0].card_no }, JWT_KEY, { expiresIn: '10m' });
        res.json({ message: 'Login successful!', token });

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Error connecting to PostgreSQL' });
    }
});

// Dashboard route
app.get('/api/dashboard', verifyToken, async (req, res) => {
    const cardNumber = req.cardNumber;
    try {
        const query = `
        SELECT c.Name AS Customer_Name,
            t.Transaction_Type,
            t.Amount,
            TO_CHAR(t.Date_Time, 'Mon DD, YYYY HH24:MI:SS') AS date_time
        FROM Customer c
        JOIN Account a ON c.customer_id = a.customer_id
        JOIN Card crd ON a.Account_No = crd.Account_No
        JOIN Transaction t ON a.Account_No = t.Account_No
        WHERE crd.Card_No = $1
        ORDER BY t.Date_Time DESC
        LIMIT 1;
        `;

        const { rows } = await pool.query(query, [cardNumber]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this card number' });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        return res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

// Balance Receipt route
app.get('/api/balance-receipt', verifyToken, async (req, res) => {
    const cardNumber = req.cardNumber; 
    try {
        const accountQuery = `
        SELECT c.Name AS customer_name,
            a.Account_No AS account_no,
            a.Balance AS balance,
            b.address AS branch_name,
            b.Bank_Name AS bank_name,
            TO_CHAR(CURRENT_TIMESTAMP, 'Mon DD, YYYY HH24:MI:SS') AS current_datetime
        FROM Customer c
        JOIN Account a ON c.customer_id = a.customer_id
        JOIN Card crd ON a.Account_No = crd.Account_No
        JOIN Bank b ON a.bank_id = b.bank_id
        WHERE crd.Card_No = $1;
        `;

        const transactionQuery = `
        SELECT t.Transaction_ID AS tid,
            t.Transaction_Type AS type,
            t.Amount AS amount,
            TO_CHAR(t.Date_Time, 'Mon DD, YYYY HH24:MI:SS') AS date
        FROM Transaction t
        JOIN Account a ON t.Account_No = a.Account_No
        WHERE a.Account_No = (SELECT Account_No FROM Card WHERE Card_No = $1)
        ORDER BY t.Date_Time DESC
        LIMIT 10;
        `;

        const accountResult = await pool.query(accountQuery, [cardNumber]);
        const transactionResult = await pool.query(transactionQuery, [cardNumber]);

        if (accountResult.rows.length === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const accountData = accountResult.rows[0];
        const transactions = transactionResult.rows;

        res.json({
            bankName: accountData.bank_name,
            currentDate: accountData.current_datetime, 
            atmId: "null", 
            branch: accountData.branch_name,
            accNo: accountData.account_no,
            name: accountData.customer_name,
            availBAL: accountData.balance,
            transactions: transactions.map(t => ({
                date: t.date,
                tid: t.tid,
                amount: t.amount,
                type: t.type
            }))
        });
    } catch (error) {
        console.error('Error fetching receipt data:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
