interface ITabelaProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Tabela = ({ children, ...props }: ITabelaProps) => {
  return (
    <table className="w-full shadow-md mb-4" {...props}>
      {children}
    </table>
  );
};

export default Tabela;
