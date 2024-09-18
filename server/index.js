const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { comparePassword } = require('./hashed_pass'); 
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

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

    const token = jwt.sign({ cardNumber: rows[0].Card_No }, JWT_SECRET, { expiresIn: '1h' });      // JWT token
    res.json({ message: 'Login successful!', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error connecting to PostgreSQL' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
