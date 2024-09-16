CREATE TABLE Account (
    Account_No INT PRIMARY KEY,
    Account_Type VARCHAR(50) DEFAULT "Saving",
    Balance DECIMAL(12, 2),
    Customer_ID INT NOT NULL,
    Bank_ID INT NOT NULL,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Bank_ID) REFERENCES bank(Bank_ID)
);



INSERT INTO Account (Account_No, Account_Type, Balance, Customer_ID, Bank_ID)
VALUES
(1001, 'current', 2750.10, 4, 1),
(1002, 'Saving', 7200.40, 10, 2),
(1003, 'current', 1450.35, 8, 3),
(1004, 'Saving', 4100.90, 2, 7),
(1005, 'current', 4700.50, 19, 9),
(1006, 'Saving', 9900.95, 17, 6),
(1007, 'current', 7500.45, 7, 4),
(1008, 'Saving', 5000.00, 5, 10),
(1009, 'current', 8800.20, 16, 5),
(1010, 'Saving', 990.90, 9, 8),
(1011, 'current', 6100.75, 3, 1),
(1012, 'Saving', 1200.20, 12, 3),
(1013, 'current', 6500.10, 18, 4),
(1014, 'Saving', 5300.60, 11, 7),
(1015, 'current', 8300.30, 20, 2),
(1016, 'Saving', 8100.90, 1, 9),
(1017, 'current', 9200.00, 6, 8),
(1018, 'Saving', 1900.00, 15, 10),
(1019, 'current', 2400.70, 14, 6),
(1020, 'Saving', 7600.70, 13, 5),
(1021, 'current', 3600.90, 10, 3),
(1022, 'Saving', 2400.70, 14, 6),
(1023, 'current', 4700.50, 13, 6),
(1024, 'Saving', 7800.40, 7, 1),
(1025, 'current', 6500.60, 4, 8),
(1026, 'Saving', 990.90, 15, 2),
(1027, 'current', 9900.95, 11, 9),
(1028, 'Saving', 5300.60, 9, 10),
(1029, 'current', 1450.35, 12, 7),
(1030, 'Saving', 1500.00, 3, 5);