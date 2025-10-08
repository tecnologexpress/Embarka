import logout from "../../services/auth/logout";
import Logo from "../atoms/Logo";
import Navbar from "../molecules/Navbar";
import { Info, Bell, LogOut } from "lucide-react";

const Header = () => {
  const aoSair = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="w-full box-border bg-gradient-to-r from-green-600 via-green-500 to-green-700 px-4">
      <header>
        {/* Tamanho de tela 1 */}
        <div className="hidden h-[80px] w-full max-w-[1500px] mx-auto xl:flex flex-row justify-between items-center">
          <div>
            <Logo className="w-[150px]" />
          </div>
          <div>
            <Navbar />
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Info size={24} />
            <Bell size={24} />
            <button title="Sair" onClick={aoSair}>
              <LogOut
                size={24}
                cursor="pointer"
                className="hover:text-blue-700"
              />
            </button>
          </div>
        </div>
        {/* Tamanho de tela 2 */}
        <div className="xl:hidden h-[110px] w-full max-w-[1500px] flex flex-col justify-between py-4 px-4 items-center">
          <div className="w-full mx-auto flex flex-row justify-between items-center">
            <div>
              <Logo className="w-[150px]" />
            </div>
            <div>
              <p className="text-gray-800 italic">
                É Ver, Prever, Agir e Entregar
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Info
                size={24}
                cursor="pointer"
                className="hover:text-blue-700"
              />
              <Bell
                size={24}
                cursor="pointer"
                className="hover:text-blue-700"
              />
              <button title="Sair" onClick={aoSair}>
                <LogOut
                  size={24}
                  cursor="pointer"
                  className="hover:text-blue-700"
                />
              </button>
            </div>
          </div>
          <div className="w-full mx-auto flex flex-row justify-center items-center">
            <div>
              <Navbar />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
