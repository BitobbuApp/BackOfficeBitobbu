import { Navigate, Route, Routes } from 'react-router-dom';
import AppProviders from '@/app/providers/AppProviders';
import AuthGuard from '@/app/router/AuthGuard';
import { AuthProvider } from '@/features/auth/AuthContext';
import LoginPage from '@/features/auth/LoginPage';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { MAIN_PAGES } from '@/pages.config';

export default function App() {
  return (
    <AppProviders>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            {MAIN_PAGES.map((page) => {
              const Component = page.component;
              return <Route key={page.path} path={page.path} element={<Component />} />;
            })}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </AppProviders>
  );
}
