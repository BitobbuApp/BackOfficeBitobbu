import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ChatPage from './pages/Chat';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Sidebar</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <Link to="/" className="hover:text-gray-300">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/chat" className="hover:text-gray-300">Real-Time Chat</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 overflow-auto">
          <ErrorBoundary fallback={<div className="p-8 text-red-500">Something went wrong.</div>}>
            <Routes>
              <Route path="/" element={<div className="p-8"><h1>Home</h1></div>} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
