import { AppProvider, useApp } from '@/context/AppContext';
import LoginPage from '@/pages/LoginPage';
import DashboardLayout from '@/components/DashboardLayout';

function AppContent() {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <DashboardLayout /> : <LoginPage />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
