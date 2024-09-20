SELECT
  c.Name AS Customer_Name,
  t.Transaction_Type,
  t.Amount,
  t.Date_Time
FROM
  Customer c
  JOIN Account a ON c.customer_id = a.customer_id
  JOIN Card crd ON a.Account_No = crd.Account_No
  JOIN Transaction t ON a.Account_No = t.Account_No
WHERE
  crd.Card_No = 1234567890
ORDER BY
  t.date_time DESC
LIMIT
  1;