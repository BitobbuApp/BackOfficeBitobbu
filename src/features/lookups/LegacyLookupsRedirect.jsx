import { Navigate } from 'react-router-dom';
export default function LegacyLookupsRedirect() {
  return <Navigate to="/config/lookups" replace />;
}
