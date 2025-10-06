import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle, MapPin } from "lucide-react";
import TemplateErro from "../components/templates/ErrorTemplate";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const sugestoes = [
    {
      icone: Home,
      titulo: "Página Inicial",
      descricao: "Volte para a página de login",
      acao: () => navigate("/"),
    },
    {
      icone: MapPin,
      titulo: "Dashboard",
      descricao: "Acesse seu painel logístico",
      acao: () => navigate("/dashboard"),
    },
  ];

  return (
    <TemplateErro
      codigoErro="404"
      titulo="Rota Não Encontrada"
      descricao="Parece que você se perdeu na nossa cadeia logística. A página que você procura não foi encontrada em nossos servidores."
      icone={AlertTriangle}
      sugestoes={sugestoes}
      acaoPrimaria={{
        rotulo: "Ir para Início",
        acao: () => navigate("/"),
        icone: Home,
      }}
      acaoSecundaria={{
        rotulo: "Voltar",
        acao: () => navigate(-1),
        icone: ArrowLeft,
      }}
      infoAjuda={{
        email: "suporte@embarka.com",
        telefone: "+55 (11) 4004-1000",
      }}
    />
  );
};

export default NotFound;
