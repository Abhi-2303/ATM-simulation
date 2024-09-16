
CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Phone_Number VARCHAR(15),
    Email VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO Customer (Customer_ID, Name, Address, Phone_Number, Email) VALUES
(1, 'Amit Sharma', '123 MG Road, New Delhi', '9876543210', 'amit.sharma@example.com'),
(2, 'Priya Mehta', '45 Central Park, Mumbai', '9867543210', 'priya.mehta@example.com'),
(3, 'Rajesh Verma', '78 Nehru Nagar, Pune', '9856743210', 'rajesh.verma@example.com'),
(4, 'Anjali Gupta', '10 Lake View, Bangalore', '9845643210', 'anjali.gupta@example.com'),
(5, 'Sunil Desai', '52 Vasant Kunj, Delhi', '9834543210', 'sunil.desai@example.com'),
(6, 'Neha Kapoor', '34 Sector 15, Gurgaon', '9823443210', 'neha.kapoor@example.com'),
(7, 'Vikram Singh', '12 Lajpat Nagar, Chandigarh', '9812343210', 'vikram.singh@example.com'),
(8, 'Sanjay Rao', '22 Shivaji Park, Mumbai', '9801243210', 'sanjay.rao@example.com'),
(9, 'Kavita Iyer', '90 Richmond Town, Bangalore', '9790143210', 'kavita.iyer@example.com'),
(10, 'Arjun Patil', '17 Koregaon Park, Pune', '9780043210', 'arjun.patil@example.com'),
(11, 'Suman Joshi', '33 Janakpuri, Delhi', '9778943210', 'suman.joshi@example.com'),
(12, 'Rohit Naik', '67 Whitefield, Bangalore', '9767843210', 'rohit.naik@example.com'),
(13, 'Divya Reddy', '29 Jubilee Hills, Hyderabad', '9756743210', 'divya.reddy@example.com'),
(14, 'Manish Agarwal', '101 Salt Lake, Kolkata', '9745643210', 'manish.agarwal@example.com'),
(15, 'Shreya Sen', '5 Jayanagar, Bangalore', '9734543210', 'shreya.sen@example.com'),
(16, 'Nikhil Chatterjee', '11 Ballygunge, Kolkata', '9723443210', 'nikhil.chatterjee@example.com'),
(17, 'Pooja Shetty', '88 Hiranandani, Mumbai', '9712343210', 'pooja.shetty@example.com'),
(18, 'Rahul Kulkarni', '23 Kothrud, Pune', '9701243210', 'rahul.kulkarni@example.com'),
(19, 'Sneha Saxena', '44 Green Park, Delhi', '9690143210', 'sneha.saxena@example.com'),
(20, 'Anand Bhatt', '9 Sector 9, Noida', '9680043210', 'anand.bhatt@example.com');
