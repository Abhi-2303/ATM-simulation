
app.get('/api/receipt', verifyToken, async (req, res) => {

    try {
        const cardNumber = req.query.cardNumber;

        if (!cardNumber) {
            return res.status(400).json({ message: 'Card number is required' });
        }

        const query = `
        SELECT t.Transaction_Type, t.Amount,
            TO_CHAR(t.Date_Time, 'Mon DD, YYYY HH24:MI:SS') as Date_Time,
            t.Transaction_ID, a.Account_No,
            b.Bank_Name, b.Address, b.contact_info, b.website,
            a.Balance      FROM Transaction t
        JOIN Account a ON t.Account_No = a.Account_No
        JOIN Bank b ON a.Bank_ID = b.Bank_ID
        WHERE a.Account_No = (
        SELECT Account_No FROM Card WHERE Card_No = $1
        )
        ORDER BY t.Date_Time DESC
        LIMIT 1;
    `;

        const { rows } = await pool.query(query, [cardNumber]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No recent transactions found' });
        }

        const transactionData = rows[0];

        res.json({
            bankName: transactionData.bank_name,
            currentDate: transactionData.date_time,
            atmId: 'ATM0001234',
            branch: transactionData.address,
            ITEMS: [
                { tag: 'Account Number', value: transactionData.account_no },
                { tag: 'Transaction Type', value: transactionData.transaction_type },
                { tag: 'Transaction ID', value: transactionData.transaction_id }
            ],
            amount: transactionData.amount,
            availBAL: transactionData.balance || 0,
            CONT: transactionData.contact_info,
            website: transactionData.website
        }); 

    } catch (error) {
        console.error('Error fetching receipt data:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
