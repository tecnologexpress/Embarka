interface Props extends React.HTMLProps<HTMLTableRowElement> {
  children: React.ReactNode;
  className?: string;
}

const TrCabecalho = ({ children, className, ...props }: Props) => {
  return (
    <tr
      className={`border-b border-gray-200 text-center ${className || ""}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export default TrCabecalho;
