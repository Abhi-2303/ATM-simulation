require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { comparePassword, hashPassword } = require('./hashed_pass');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_KEY = process.env.JWT_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { cardNumber, pin } = req.body;

  try {
    const query = 'SELECT * FROM card WHERE Card_No = $1';
    const { rows } = await pool.query(query, [cardNumber]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (!pin) {
      return res.json({ message: 'Card found, please enter your PIN' });
    }

    const isMatch = await comparePassword(pin, rows[0].pin);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid PIN' });
    }


    const token = jwt.sign({ cardNumber: rows[0].card_no }, JWT_KEY, { expiresIn: '10m' });
    res.json({ message: 'Login successful!', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error connecting to PostgreSQL' });
  }
});

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

app.get('/api/dashboard', verifyToken, async (req, res) => {
  try {
    const cardNumber = req.cardNumber;

    const query = `
            SELECT c.Name AS Customer_Name,
              t.Transaction_Type,
              t.Amount,
              TO_CHAR(t.Date_Time, 'Mon DD, YYYY HH24:MI:SS') as Date_Time
            FROM 
              Customer c
            JOIN
              Account a ON c.customer_id = a.customer_id
            JOIN
              Card crd ON a.Account_No = crd.Account_No
            JOIN
              Transaction t ON a.Account_No = t.Account_No
            WHERE
              crd.Card_No = $1
            ORDER BY t.date_time DESC LIMIT 1;
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

app.get('/api/balance-receipt', verifyToken, async (req, res) => {
  const cardNumber = req.cardNumber;

  try {
    const accountQuery = `
    SELECT
    c.Name AS customer_name,
    a.Account_No AS account_no,
    a.Balance AS balance,
    b.contact_info,
    b.website,

    b.address AS branch_name,
    b.Bank_Name AS bank_name,
    TO_CHAR (CURRENT_TIMESTAMP, 'Mon DD, YYYY HH24:MI:SS') AS current_datetime
FROM
    Customer c
    JOIN Account a ON c.customer_id = a.customer_id
    JOIN Card crd ON a.Account_No = crd.Account_No
    JOIN Bank b ON a.bank_id = b.bank_id
WHERE
    crd.Card_No = $1;
    `;

    const accountResult = await pool.query(accountQuery, [cardNumber]);


    if (accountResult.rows.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const accountData = accountResult.rows[0];
    // Send response with account data and transactions
    res.json({
      bankName: accountData.bank_name,
      currentDate: accountData.current_datetime,
      atmId: 'ATM0001234',
      branch: accountData.branch_name,
      ITEMS: [
        {
          tag: 'Account Number',
          value: accountData.account_no
        },
        {
          tag: 'Customer Name',
          value: accountData.customer_name
        },
        // Add other items if needed
      ],
      availBAL: accountData.balance,
      CONT: accountData.contact_info,
      website: accountData.website
    });

  } catch (error) {
    console.error('Error fetching receipt data:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/change-pin', verifyToken, async (req, res) => {
  const { oldPin, newPin } = req.body;
  const cardNumber = req.cardNumber;

  try {

    const query = 'SELECT pin FROM card WHERE Card_No = $1';
    const { rows } = await pool.query(query, [cardNumber]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const storedHash = rows[0].pin;

    const isMatch = await comparePassword(oldPin, storedHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid old PIN' });
    }
    if (!newPin) {
      return res.json({ message: 'New PIN is required' });
    }

    const hashedNewPin = await hashPassword(newPin);
    const updateQuery = 'UPDATE card SET pin = $1 WHERE Card_No = $2';
    await pool.query(updateQuery, [hashedNewPin, cardNumber]);
    res.json({ message: 'PIN updated successfully!' });

  } catch (error) {
    console.error('Error changing PIN:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/banks', async (req, res) => {
  try {
    // Query to fetch bank list
    const bankQuery = 'SELECT bank_name FROM Bank';
    const { rows } = await pool.query(bankQuery);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No banks found' });
    }

    res.json(rows.map(row => row.bank_name)); // Return array of bank names
  } catch (error) {
    console.error('Error fetching bank list:', error.message);
    res.status(500).json({ message: 'Error fetching bank list' });
  }
});

app.post('/api/transfer', verifyToken, async (req, res) => {
  try {
    const {bank, name } = req.body;
    const reciverAccNo = Number(req.body.reciverAccNo);
    const amount = Number(req.body.amount);
    const cardNumber = req.cardNumber;

    await pool.query('BEGIN');

    // Fetch sender's account number and balance
    const senderAccQuery = `
      SELECT a.Account_No, a.Balance 
      FROM Account a
      JOIN Card crd ON a.Account_No = crd.Account_No
      WHERE crd.Card_No = $1
    `;
    const { rows: senderRows } = await pool.query(senderAccQuery, [cardNumber]);

    if (senderRows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Sender account not found' });
    }

    const senderAccountNo = senderRows[0].account_no;
    const senderBalance = senderRows[0].balance;

    if (senderAccountNo === reciverAccNo) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'You cannot transfer money to your own account' });
    }

    if (senderBalance < amount) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient balance' });
    }


    const receiverAccQuery = `
      SELECT a.Account_No, c.Name, b.Bank_Name
      FROM Account a
      JOIN Customer c ON a.Customer_ID = c.Customer_ID
      JOIN Bank b ON a.Bank_ID = b.Bank_ID
      WHERE a.Account_No = $1 AND c.Name = $2;
    `;
    const { rows: receiverRows } = await pool.query(receiverAccQuery, [reciverAccNo, name]);

    if (receiverRows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Beneficiary account not found' });
    }

    const beneficiaryBankName = receiverRows[0].bank_name;

    if (beneficiaryBankName.toLowerCase() !== bank.toLowerCase()) {
      await pool.query('ROLLBACK');
      return res.json({ message: 'The selected bank does not correspond to the beneficiary’s bank.' });
    }


    if (isNaN(amount) || amount <= 0) {
      await pool.query('ROLLBACK');
      return res.json({ message: 'Invalid amount' });
    }
    if (amount){

      const deductSender = `
      UPDATE Account
      SET Balance = Balance - $1
      WHERE Account_No = $2
    `;
      await pool.query(deductSender, [amount, senderAccountNo]);

      const addReceiver = `
      UPDATE Account
      SET Balance = Balance + $1
      WHERE Account_No = $2
    `;
      await pool.query(addReceiver, [amount, reciverAccNo]);

      const transactionSenderQry = `
      INSERT INTO Transaction (Transaction_Type, Amount, Date_Time, Account_No)
      VALUES ('Transfer - Debit', $1, NOW(), $2)
    `;
      await pool.query(transactionSenderQry, [amount, senderAccountNo]);
      console.log('Amount:', amount, 'Type:', typeof amount);


      const transactionReceiverQry = `
      INSERT INTO Transaction (Transaction_Type, Amount, Date_Time, Account_No)
      VALUES ('Transfer - Credit', $1, NOW(), $2)
    `;
      await pool.query(transactionReceiverQry, [amount, reciverAccNo]);
    }


    await pool.query('COMMIT');
    res.json({ message: 'Transfer successful' });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error during transfer:', error.message);
    res.status(500).json({ message: 'Internal server error during transfer' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`);
});
