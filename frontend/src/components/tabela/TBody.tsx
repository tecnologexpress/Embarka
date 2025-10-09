interface TBodyProps {
  children: React.ReactNode;
  className?: string;
}

const TableBody = ({ children, className }: TBodyProps) => {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className || ''}`}>
      {children}
    </tbody>
  );
};

export default TableBody;
