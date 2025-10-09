import FormularioRegistro from "../components/molecules/FormularioRegistro";

const Registro: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-300 via-green-50 to-green-200 py-8 gap-4">
      <FormularioRegistro />
    </div>
  );
};

export default Registro;
