interface Props extends React.HTMLProps<HTMLTableRowElement> {
  children: React.ReactNode;
  className?: string;
}

const TRCorpo = ({ children, className }: Props) => {
  return <tr className={`${className}`}>{children}</tr>;
};

export default TRCorpo;
