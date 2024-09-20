SELECT
    t.Transaction_ID AS tid,
    t.Transaction_Type AS type,
    t.Amount AS amount,
    TO_CHAR (t.Date_Time, 'Mon DD, YYYY HH24:MI:SS') AS date
FROM
    Transaction t
    JOIN Account a ON t.Account_No = a.Account_No
WHERE
    a.Account_No = (
        SELECT
            Account_No
        FROM
            Card
        WHERE
            Card_No = 1234567890
    )
ORDER BY
    t.Date_Time DESC
LIMIT
    10;