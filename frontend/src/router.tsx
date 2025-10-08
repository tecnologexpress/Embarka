import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";
import PrivateRoute from "./pages/PrivateRoute";
import React from "react";
import JanelaDeColeta from "./pages/operacional/JanelaDeColeta";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Registro />} />

        {/* Rotas de erro */}
        <Route path="/403" element={<AccessDenied />} />

        {/* Rota 404 - deve ser a última */}
        <Route path="*" element={<NotFound />} />

        {/* Rotas protegidas */}
        <Route element={<PrivateRoute />}>
          <React.Fragment>
            <Route path="/home" element={<Dashboard />} />
          </React.Fragment>

          {/* Seção Operacional */}
          <React.Fragment>
            <Route
              path="/operacional/janela-de-coleta"
              element={<JanelaDeColeta />}
            />
          </React.Fragment>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
