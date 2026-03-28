import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Subscriptions from './pages/Subscriptions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/subscriptions" replace />} />
          <Route path="subscriptions" element={<Subscriptions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
