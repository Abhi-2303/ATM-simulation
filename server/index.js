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





app.get('/api/dashboard', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; 
  try {
    const decoded = jwt.verify(token, JWT_KEY); 
    const cardNumber = decoded.cardNumber;

    const query = `
            SELECT c.Name AS Customer_Name,
              t.Transaction_Type,
              t.Amount,
              t.Date_Time 
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
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
