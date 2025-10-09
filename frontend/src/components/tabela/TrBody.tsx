interface Props extends React.HTMLProps<HTMLTableRowElement> {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
}

const TrCorpo = ({ children, className, clickable = false, ...props }: Props) => {
  const baseClasses = 'transition-colors duration-200';
  const hoverClasses = clickable 
    ? 'hover:bg-green-50 cursor-pointer active:bg-green-100' 
    : 'hover:bg-gray-50';

  return (
    <tr 
      className={`${baseClasses} ${hoverClasses} ${className || ''}`} 
      {...props}
    >
      {children}
    </tr>
  );
};

export default TrCorpo;
