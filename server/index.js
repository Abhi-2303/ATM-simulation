const express = require('express');
const cors = require('cors');

require('dotenv').config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER,      
  host: process.env.DB_HOST,    
  database: process.env.DB_DATABASE,       
  password: process.env.DB_PASSWORD,  
  port: process.env.DB_PORT,            
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/:cardNumber', async (req, res) => {
  const cardNumber = req.params.cardNumber;  

  try {
    const query = 'SELECT * FROM card WHERE Card_No = $1;';
    const { rows } = await pool.query(query, [cardNumber]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json({ message: 'Connected to PostgreSQL!', result: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error connecting to PostgreSQL' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// url "http://localhost:5000/api/123456789001"