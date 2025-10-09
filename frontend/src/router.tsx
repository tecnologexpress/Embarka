import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";
import PrivateRoute from "./pages/PrivateRoute";
import React from "react";
import JanelaDeColeta from "./pages/operacional/janela-de-coleta/JanelaDeColeta";
import Home from "./pages/Home";

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
            <Route path="/home" element={<Home />} />
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
