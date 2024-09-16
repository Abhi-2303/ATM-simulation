CREATE TYPE transaction_type AS ENUM ('Deposit', 'Withdrawal', 'Transfer', 'QR Cash'); --used in postgresql

CREATE TABLE Transaction (
    Transaction_ID SERIAL PRIMARY KEY, -- SERIAL ==   AUTO INCREMENT
    Transaction_Type transaction_type,
    Amount DECIMAL(15, 2),
    Date_Time TIMESTAMP NOT NULL,
    Account_No INT NOT NULL,
    FOREIGN KEY (Account_No) REFERENCES Account(Account_No)
);

INSERT INTO Transaction (Transaction_Type, Amount, Date_Time, Account_No) VALUES
('Withdrawal', 150.00, '2024-09-01 10:00:00', 1002),
('Deposit', 500.00, '2024-09-02 14:30:00', 1001),
('QR Cash', 90.00, '2024-09-03 16:45:00', 1008),
('Transfer', 2000.00, '2024-09-04 09:15:00', 1003),
('QR Cash', 120.00, '2024-09-05 11:00:00', 1002),
('Withdrawal', 300.00, '2024-09-06 13:20:00', 1006),
('Deposit', 250.00, '2024-09-07 15:30:00', 1009),
('Transfer', 450.00, '2024-09-08 17:00:00', 1007),
('Deposit', 800.00, '2024-09-09 08:45:00', 1003),
('Transfer', 1000.00, '2024-09-10 10:30:00', 1001),
('QR Cash', 45.75, '2024-09-11 12:00:00', 1006),
('Withdrawal', 500.00, '2024-09-12 14:15:00', 1010),
('Deposit', 1200.00, '2024-09-13 16:30:00', 1005),
('QR Cash', 60.00, '2024-09-14 18:00:00', 1010),
('Withdrawal', 200.00, '2024-09-15 09:00:00', 1004),
('Transfer', 600.00, '2024-09-16 10:45:00', 1005),
('Deposit', 1500.00, '2024-09-17 11:30:00', 1007),
('Transfer', 900.00, '2024-09-18 13:00:00', 1009),
('QR Cash', 75.50, '2024-09-19 15:15:00', 1004),
('Withdrawal', 350.00, '2024-09-20 16:00:00', 1008);
