import React from "react";
import { Truck, Bot, Leaf, BarChart3, MapPin, Zap } from "lucide-react";
import Logo from "../atoms/Logo";
import FormularioLogin from "../molecules/FormularioLogin";
import FormularioValidacao2FA from "../molecules/FormularioValidacao2FA";

const LoginTemplate: React.FC = () => {
  const [loginSucesso, setLoginSucesso] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const features = [
    {
      icon: Truck,
      title: "Logística Inteligente",
      description: "Conecte embarcadores, clientes e transportadoras",
    },
    {
      icon: Bot,
      title: "IA Avançada",
      description: "Otimização automática de rotas e processos",
    },
    {
      icon: BarChart3,
      title: "Auditoria Completa",
      description: "Rastreabilidade total da cadeia logística",
    },
    {
      icon: Leaf,
      title: "SGA Integrado",
      description: "Sistema de Gestão Ambiental sustentável",
    },
  ];

  return (
    <>
      {loginSucesso ? (
        <FormularioValidacao2FA aoVoltar={() => setLoginSucesso(false)} email={email} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-400 flex">
          {/* Left Side - Login Form */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              {/* Header */}
              <div className="flex flex-col text-center items-center mx-auto">
                <Logo className="mb-2 w-[300px]" />
                <p className="text-gray-600 text-lg font-medium mb-6">
                  Conectando Embarcadores • Clientes • Transportadoras
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm">
                    <strong>Sistema Integrado:</strong> Logística Inteligente +
                    IA + Auditoria + SGA
                  </p>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Acesse sua Central Logística
                </h2>
                <p className="text-gray-600">
                  Entre na plataforma e otimize suas operações
                </p>
              </div>

              {/* Login Form */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <FormularioLogin
                  email={email}
                  setEmail={setEmail}
                  onLoginSucesso={() => setLoginSucesso(true)}
                />
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  Ao continuar, você concorda com nossos
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Termos de Uso
                  </a>
                  e
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Política de Privacidade
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white relative overflow-hidden">
            <div className="flex items-center justify-center w-full px-4 py-4 relative z-10">
              <div className="max-w-lg bg-green-700 bg-opacity-10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
                  Revolucione sua Cadeia Logística
                </h3>
                <p className="text-green-50 text-lg mb-12 leading-relaxed font-medium">
                  Plataforma completa que conecta embarcadores, clientes e
                  transportadoras com IA, auditoria avançada e gestão ambiental
                  para máxima eficiência.
                </p>

                <div className="grid grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-white bg-opacity-30 rounded-full p-5 w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <feature.icon className="h-10 w-10 text-green-600" />
                      </div>
                      <h4 className="font-bold mb-3 text-white text-base">
                        {feature.title}
                      </h4>
                      <p className="text-green-50 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <div className="inline-flex items-center space-x-3 bg-white bg-opacity-25 rounded-full px-8 py-4 shadow-lg">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    <span className="text-base font-bold text-green-800">
                      Conectando embarcadores em todo mundo
                    </span>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                    <div className="bg-white bg-opacity-15 rounded-lg p-4">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-bold text-gray-600">
                        27 Estados
                      </p>
                      <p className="text-xs text-gray-600">
                        Cobertura Nacional
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-15 rounded-lg p-4">
                      <Truck className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-bold text-gray-600">
                        Rotas Sustentáveis
                      </p>
                      <p className="text-xs text-gray-600">Otimizadas por IA</p>
                    </div>
                    <div className="bg-white bg-opacity-15 rounded-lg p-4">
                      <Leaf className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm font-bold text-gray-600">
                        Carbon Neutral
                      </p>
                      <p className="text-xs text-gray-600">Certificado SGA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginTemplate;
