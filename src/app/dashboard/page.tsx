import ProtectedRoute from '@/components/ProtectedRoute';

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <div>Bienvenido a tu Dashboard</div>
    </ProtectedRoute>
  );
}

export default DashboardPage;
