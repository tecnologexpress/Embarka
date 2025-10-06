import {
  Briefcase,
  Settings,
  BarChart2,
  Users,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect, useRef } from "react";

const navItems = [
  {
    label: "Dashboards",
    icon: BarChart2,
    to: "/dashboards",
    submenu: [
      { label: "Resumo", to: "/dashboards/resumo" },
      { label: "Detalhes", to: "/dashboards/detalhes" },
    ],
  },
  {
    label: "Comercial",
    icon: Briefcase,
    to: "/comercial",
    submenu: [
      { label: "Listar Projetos", to: "/comercial/lista" },
      { label: "Novo Projeto", to: "/comercial/novo" },
    ],
  },
  {
    label: "Operacional",
    icon: Layers,
    to: "/operacional",
    submenu: [
      { label: "Listar Camadas", to: "/operacional/lista" },
      { label: "Nova Camada", to: "/operacional/nova" },
    ],
  },
  {
    label: "Administração",
    icon: Users,
    to: "/admin",
    submenu: [
      { label: "Usuários", to: "/admin/usuarios" },
      { label: "Permissões", to: "/admin/permissoes" },
    ],
  },
  {
    label: "Integrações",
    icon: Settings,
    to: "/integracoes",
    submenu: [
      { label: "Perfil", to: "/integracoes/perfil" },
      { label: "Preferências", to: "/integracoes/preferencias" },
    ],
  },
  {
    label: "Parametrizações",
    icon: SlidersHorizontal,
    to: "/parametrizacoes",
    submenu: [
      { label: "Sistema", to: "/parametrizacoes/sistema" },
      { label: "Notificações", to: "/parametrizacoes/notificacoes" },
    ],
  },
];

const Navbar = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openIndex === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openIndex]);

  const handleClick = (index: number, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  return (
    <nav className="flex space-x-6 items-center relative" ref={navRef}>
      {navItems.map((item, idx) => (
        <div key={item.label} className="relative">
          <Link
            to={item.to}
            className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition-colors"
            onClick={(e) => {
              if (item.submenu) {
                e.preventDefault();
                handleClick(idx, true);
              }
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
          {item.submenu && openIndex === idx && (
            <div className="absolute left-0 mt-2 bg-white shadow rounded z-10 min-w-[150px]">
              {item.submenu.map((sub) => (
                <Link
                  key={sub.label}
                  to={sub.to}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                  onClick={() => setOpenIndex(null)}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
