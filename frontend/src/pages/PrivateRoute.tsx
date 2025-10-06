import { Outlet } from "react-router-dom";
import Layout from "../components/layout/Layout";

const PrivateRoute = () => {
  // const { isAuthenticated, loading } = useAuth();

  // if (loading) {
  //   return <div>Carregando autenticação...</div>; // ou um spinner
  // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;
