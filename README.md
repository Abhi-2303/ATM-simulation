
# ATM Simulation Application

A robust ATM simulation application built with **React** for the frontend and **Node.js** for the backend, providing users with secure access to various ATM functionalities such as deposits, withdrawals, fund transfers, balance inquiries, and more. The backend is powered by **PostgreSQL** and secured through **JWT-based authentication**, ensuring data privacy and protection.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Security](#security)
- [Rate Limiting](#rate-limiting)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Contact Information](#contact-information)

## Overview

This application provides a user-friendly interface for managing ATM operations, with a focus on security and ease of use. Users can log in with their card number and PIN, then navigate through various ATM features, such as checking balances, managing cards, and making transactions. The backend API, built using **Node.js** and **Express.js**, handles all critical ATM operations, while the frontend is designed with **React** for a responsive and intuitive user experience.

## Features

- **User Authentication**: Secure login using card number and PIN with JWT-based authentication.
- **ATM Operations**:
  - Deposit, Withdraw, and Transfer funds.
  - Check balance and view mini-statements.
- **Card Management**: Block/unblock cards and manage PINs.
- **Admin Features**: Manage and oversee banking
- **Security**: Passwords are securely hashed, JWT tokens are used for authentication, and rate-limiting prevents brute-force attacks.
- **Error Handling**: Robust error handling with detailed user feedback.
- **User Feedback Mechanism**: Users can provide feedback and report issues directly within the application.

## Technologies Used

- **Frontend**: React, Vite, Axios, React Router
- **Styling**: Custom CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, express-rate-limit for rate limiting
- **Environment Management**: dotenv for environment variables

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Abhi-2303/ATM-simulation.git
   cd ATM-simulation
   ```

2. **Install Dependencies**:
   For the frontend:
   ```bash
   cd frontend
   npm install
   ```
   For the backend:
   ```bash
   cd backend
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the backend root directory with the following variables:
   ```plaintext
   DB_HOST=your_postgres_host
   DB_PORT=your_postgres_port
   DB_USER=your_postgres_username
   DB_PASS=your_postgres_password
   DB_NAME=your_database_name
   JWT_KEY=your_secret_key
   ```

4. **Run the Backend**:
   Start the Node.js backend server:
   ```bash
   npm start
   ```

5. **Run the Frontend**:
   Start the React frontend application:
   ```bash
   npm run dev
   ```

6. **Access the Application**:
   Open your browser and go to:
   ```plaintext
   http://localhost:5173
   ```

## Environment Variables

| Variable   | Description                           |
|------------|---------------------------------------|
| `DB_HOST`  | Hostname for your PostgreSQL database |
| `DB_PORT`  | Port number for your PostgreSQL database |
| `DB_USER`  | Username for your PostgreSQL database |
| `DB_PASS`  | Password for your PostgreSQL database |
| `DB_NAME`  | Name of your PostgreSQL database |
| `JWT_KEY`  | Secret key used for signing JWT tokens |

## Usage

### Login:
- Enter your 12-digit card number and 4-digit PIN to authenticate.

### Dashboard:
- Display last transaction history & user name.
- View account details, including transaction history and balance.
- Use the dashboard to perform operations like deposits, withdrawals, fund transfers, and more.

### Navigation:
- **Check Balance**: View your current account balance.
- **Deposits**: Deposit funds into your account.
- **Withdrawals**: Withdraw funds from your account.
- **Transfers**: Transfer funds to other accounts.
- **Mini Statements**: View recent transactions.
- **Change PIN**: Securely change your card’s PIN.
- **Admin**: Access admin features to manage user accounts and transactions.

## API Endpoints

### Authentication & Card Management
- **POST** `/api/login`
  - Authenticate using card number and PIN.
  - Request Body: `{ cardNumber: string, pin: string }`
  - Response: `{ token: string, message: string }`

- **POST** `/api/change-pin`
  - Change user PIN.
  - Request Body: `{ oldPin: string, newPin: string }`
  - Response: `{ message: string }`

### Account Management
- **GET** `/api/dashboard`
  - Fetch user-specific account data and recent transactions.
  - Headers: `{ Authorization: 'Bearer <token>' }`
  - Response: `{ customerName: string, transactionType: string, amount: number, date: string }`

- **POST** `/api/withdraw`
  - Withdraw a specified amount from the user's account.
  - Request Body: `{ amount: number, pin: string }`
  - Response: `{ message: string, newBalance: number }`

### Fund Transfer
- **POST** `/api/transfer`
  - Transfer funds to another account.
  - Request Body: `{ receiverAccNo: number, amount: number, pin: string, name: string, bank: string }`
  - Response: `{ message: string }`

## Error Handling

The application includes various error handling mechanisms:
- **Invalid Input**: Provides clear error messages for incorrect card numbers, PINs, and other invalid input data.
- **Connection Errors**: Handles API connection issues gracefully.
- **Expired Tokens**: Notifies users when their JWT token expires and prompts them to log in again.

Common error responses include:
- **400 Bad Request**: Client-side error; malformed request or invalid data.
- **401 Unauthorized**: Authentication required, but credentials are missing or invalid.
- **403 Forbidden**: Request understood, but user lacks permission.
- **404 Not Found**: Returned when the requested resource is unavailable.
- **429 Too Many Requests**: Triggered when users exceed the rate-limited login attempts.
- **500 Internal Server Error**: Returned for server-side issues.

## Security

- **Password Hashing**: User PINs and passwords are hashed using `bcrypt` before being stored in the database.
- **JWT Authentication**: All protected routes require a valid JWT token for access. Tokens expire after 10 minutes for enhanced security.
- **Rate Limiting**: Login attempts are restricted to 10 attempts per 2 minutes to prevent brute-force attacks.

## Rate Limiting

To prevent brute-force attacks, the API limits login attempts to **10 requests per 2 minutes**. Users who exceed this limit receive a **429 Too Many Requests** response, and a retry header indicates when they can try again.

## Future Enhancements
- Implement a refresh token mechanism for better session management.
- Add unit tests for critical functionalities to ensure reliability.
- Integrate a user feedback form within the application.
- Explore deployment options on platforms like Heroku or Vercel.

## Contact Information
For inquiries or feedback, please reach out to:
- **Email**: cuse461@gmail.com
- **GitHub**: [Abhi-2303](https://github.com/Abhi-2303)

---
