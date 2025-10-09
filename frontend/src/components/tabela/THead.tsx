interface THeadProps {
  children: React.ReactNode;
  className?: string;
}

const TableHead = ({ children, className }: THeadProps) => {
  return (
    <thead className={`bg-gray-50 text-center ${className || ''}`}>
      {children}
    </thead>
  );
};

export default TableHead;
