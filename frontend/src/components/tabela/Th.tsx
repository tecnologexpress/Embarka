interface Props extends React.HTMLProps<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
}

const Th = ({ children, className, ...props }: Props) => {
  return (
    <th
      className={`cursor-default whitespace-nowrap p-2 border-r border-gray-300 px-4 py-2 text-center font-medium text-black ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export default Th;
