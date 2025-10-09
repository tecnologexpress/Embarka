interface Props extends React.HTMLProps<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
  ordenavel?: boolean;
}

const Th = ({ children, className, ordenavel, ...props }: Props) => {
  const baseClasses = `
    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
    select-none transition-colors duration-200 text-center
  `;
  
  const ordenaveClasses = ordenavel 
    ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200' 
    : 'cursor-default';

  return (
    <th
      className={`text-center ${baseClasses} ${ordenaveClasses} ${className || ''}`}
      {...props}
    >
      {children}
    </th>
  );
};

export default Th;
