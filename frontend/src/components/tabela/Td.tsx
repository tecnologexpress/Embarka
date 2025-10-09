interface Props extends React.HTMLProps<HTMLTableCellElement> {
  children: React.ReactNode;
  className?: string;
  permitirOverflow?: boolean;
  truncate?: boolean;
}

const Td = ({
  children,
  className,
  permitirOverflow = false,
  truncate = true,
  ...props
}: Props) => {
  const baseClasses = `
    px-6 py-4 text-sm text-gray-900 text-center
    transition-colors duration-200
  `;

  const truncateClasses =
    truncate && !permitirOverflow
      ? "truncate max-w-0"
      : permitirOverflow
      ? "whitespace-normal break-words"
      : "whitespace-nowrap";

  return (
    <td
      className={`${baseClasses} ${truncateClasses} ${className || ""}`}
      {...props}
    >
      <div className={truncate && !permitirOverflow ? "truncate" : ""}>
        {children}
      </div>
    </td>
  );
};

export default Td;
