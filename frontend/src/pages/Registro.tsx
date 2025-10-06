import FormularioRegistro from "../components/molecules/FormularioRegistro";
import Logo from "../components/atoms/Logo";

const Registro: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-400 py-8 gap-4">
      <div className="flex flex-col text-center items-center mx-auto">
        <Logo className="mb-2 w-[220px]" />
      </div>

      <FormularioRegistro />
    </div>
  );
};

export default Registro;
