import {
  Briefcase,
  Settings,
  BarChart2,
  Users,
  Layers,
  SlidersHorizontal,
  User,
  Shield,
  FileText,
  PlusCircle,
  Layers3,
  Bell,
  Cog,
  Star,
  CalendarRange,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const navItems = [
  {
    label: "Dashboards",
    icon: BarChart2,
    to: "/dashboards",
    submenu: [
      { label: "Resumo", to: "/dashboards/resumo", icon: FileText },
      { label: "Detalhes", to: "/dashboards/detalhes", icon: Layers3 },
    ],
  },
  {
    label: "Comercial",
    icon: Briefcase,
    to: "/comercial",
    submenu: [
      { label: "Listar Projetos", to: "/comercial/lista", icon: FileText },
      { label: "Novo Projeto", to: "/comercial/novo", icon: PlusCircle },
    ],
  },
  {
    label: "Operacional",
    icon: Layers,
    to: "/operacional",
    submenu: [
      { label: "Janela de Coletas", to: "/operacional/janela-de-coleta", icon: CalendarRange },
      { label: "Nova Camada", to: "/operacional/nova", icon: PlusCircle },
    ],
  },
  {
    label: "Administração",
    icon: Users,
    to: "/admin",
    submenu: [
      { label: "Usuários", to: "/admin/usuarios", icon: User },
      { label: "Permissões", to: "/admin/permissoes", icon: Shield },
    ],
  },
  {
    label: "Integrações",
    icon: Settings,
    to: "/integracoes",
    submenu: [
      { label: "Perfil", to: "/integracoes/perfil", icon: Star },
      { label: "Preferências", to: "/integracoes/preferencias", icon: Cog },
    ],
  },
  {
    label: "Parametrizações",
    icon: SlidersHorizontal,
    to: "/parametrizacoes",
    submenu: [
      { label: "Sistema", to: "/parametrizacoes/sistema", icon: Cog },
      { label: "Notificações", to: "/parametrizacoes/notificacoes", icon: Bell },
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
            <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg z-20 min-w-[250px] border border-gray-100 py-2">
              {item.submenu.map((sub) => (
                <Link
                  key={sub.label}
                  to={sub.to}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded"
                  onClick={() => setOpenIndex(null)}
                >
                  <sub.icon size={18} className="text-gray-400" />
                  <span>{sub.label}</span>
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
