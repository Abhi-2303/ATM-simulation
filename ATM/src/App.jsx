import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Cardpin from './componants/cardpin';
import Dashboard from './pages/dashboard';

import Deposit from './pages/Deposit';
import Withdrawal from './pages/Withdrawal';
import Transfers from './pages/Transfers';
import ChangePIN from './pages/ChangePIN';
import CheckBalance from './pages/CheckBalance';
import MiniStatements from './pages/MiniStatements';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Cardpin />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mini-statements" element={<MiniStatements />} />
      <Route path="/withdrawal" element={<Withdrawal />} />
      <Route path="/check-balance" element={<CheckBalance />} />
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/transfers" element={<Transfers />} />
      <Route path="/change-pin" element={<ChangePIN />} />
    </Routes>
  );
}

export default App;
