import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, User, Settings } from "lucide-react";
import TemplateErro from "../components/templates/ErrorTemplate";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  const sugestoes = [
    {
      icone: User,
      titulo: "Fazer Login",
      descricao: "Entre com suas credenciais de acesso",
      acao: () => navigate("/"),
    },
    {
      icone: Settings,
      titulo: "Contatar Administrador",
      descricao: "Solicite permissões de acesso",
      acao: () =>
        window.open("mailto:admin@embarka.com?subject=Solicitação de Acesso"),
    },
  ];

  return (
    <TemplateErro
      codigoErro="403"
      titulo="Acesso Negado"
      descricao="Você não possui permissão para acessar esta área do sistema logístico. Entre em contato com o administrador para solicitar acesso."
      icone={Shield}
      sugestoes={sugestoes}
      acaoPrimaria={{
        rotulo: "Fazer Login",
        acao: () => navigate("/"),
        icone: User,
      }}
      acaoSecundaria={{
        rotulo: "Voltar",
        acao: () => navigate(-1),
        icone: ArrowLeft,
      }}
      infoAjuda={{
        email: "admin@embarka.com",
        telefone: "+55 (11) 4004-1000",
      }}
    />
  );
};

export default AccessDenied;
