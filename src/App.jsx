import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

function Dashboard() {
  return <div><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to the Superadmin Dashboard.</p></div>;
}

function Users() {
  return <div><h1 className="text-2xl font-bold">Users</h1><p>User management.</p></div>;
}

function Verifications() {
  return <div><h1 className="text-2xl font-bold">Verifications</h1><p>Verification requests.</p></div>;
}

function Chat() {
  return <div><h1 className="text-2xl font-bold">Chat</h1><p>Admin chat system.</p></div>;
}

function Subscriptions() {
  return <div><h1 className="text-2xl font-bold">Subscriptions</h1><p>Manage subscriptions.</p></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="verifications" element={<Verifications />} />
          <Route path="chat" element={<Chat />} />
          <Route path="subscriptions" element={<Subscriptions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
