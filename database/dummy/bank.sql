CREATE TABLE Bank (
    Bank_ID INT PRIMARY KEY,
    Bank_Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Contact_Info VARCHAR(100) NOT NULL
);

INSERT INTO Bank (Bank_ID, Bank_Name, Address, Contact_Info) VALUES
(1, 'Yes Bank', '550, MG Road, Nashik, Maharashtra 422001', '0253-250-6789'),
(2, 'Kotak Mahindra Bank', '202, Banjara Hills, Hyderabad, Telangana 500034', '040-567-8901'),
(3, 'State Bank of India', '1, Parliament Street, New Delhi, Delhi 110001', '011-233-12345'),
(4, 'Punjab National Bank', '305, FC Road, Pune, Maharashtra 411016', '020-256-43210'),
(5, 'Axis Bank', '101, South Extension, Delhi, Delhi 110049', '011-456-7890'),
(6, 'Bank of Maharashtra', '1501, Shivaji Nagar, Pune, Maharashtra 411005', '020-255-32745'),
(7, 'ICICI Bank', '789, Marine Drive, Mumbai, Maharashtra 400002', '022-234-5678'),
(8, 'Canara Bank', '707, Laxmi Road, Pune, Maharashtra 411030', '020-243-56789'),
(9, 'Federal Bank', '11, New Link Road, Mumbai, Maharashtra 400058', '022-298-7654'),
(10, 'HDFC Bank', '456, MG Road, Bengaluru, Karnataka 560001', '080-123-4567');
