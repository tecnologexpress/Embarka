interface Props extends React.HTMLProps<HTMLTableRowElement> {
  children: React.ReactNode;
  className?: string;
}

const TrCabecalho = ({ children, className }: Props) => {
  return <tr className={`${className}`}>{children}</tr>;
};

export default TrCabecalho;
