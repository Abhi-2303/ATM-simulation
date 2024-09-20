SELECT
    c.Name AS customer_name,
    a.Account_No AS account_no,
    a.Balance AS balance,
    b.address AS branch_name,
    b.Bank_Name AS bank_name,
    b.contact_info,
    TO_CHAR (CURRENT_TIMESTAMP, 'Mon DD, YYYY HH24:MI:SS') AS current_datetime
FROM
    Customer c
    JOIN Account a ON c.customer_id = a.customer_id
    JOIN Card crd ON a.Account_No = crd.Account_No
    JOIN Bank b ON a.bank_id = b.bank_id
WHERE
    crd.Card_No = $1;