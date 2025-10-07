import { Navigate, Outlet } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando autenticação...</div>; // TO-DO: Implementar um spinner de carregamento??
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;
