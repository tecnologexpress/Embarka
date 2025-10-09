interface ITabelaProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Tabela = ({ children, className, ...props }: ITabelaProps) => {
  return (
    <table 
      className={`w-full divide-y divide-gray-200 ${className || ''}`} 
      {...props}
    >
      {children}
    </table>
  );
};

export default Tabela;
