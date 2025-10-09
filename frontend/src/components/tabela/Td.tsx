interface Props extends React.HTMLProps<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
  permitirOverflow?: boolean;
}

const Td = ({ children, ...props }: Props) => {

  return (
    <td className={`cursor-default whitespace-nowrap text-center`} {...props}>
      {children}
    </td>
  );
};

export default Td;
