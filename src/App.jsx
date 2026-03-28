import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Chat } from "./pages/Chat";
import { Subscriptions } from "./pages/Subscriptions";
import { Verifications } from "./pages/Verifications";

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
