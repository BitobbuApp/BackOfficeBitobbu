import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<div className="p-8">Dashboard Content</div>} />
            <Route path="users" element={<div className="p-8">Users Content</div>} />
            <Route path="verifications" element={<div className="p-8">Verifications Content</div>} />
            <Route path="chat" element={<div className="p-8">Chat Content</div>} />
            <Route path="subscriptions" element={<div className="p-8">Subscriptions Content</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
