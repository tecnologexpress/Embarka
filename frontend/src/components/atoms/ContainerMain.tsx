import type { ReactNode } from "react";

interface ContainerMainProps {
  children: ReactNode;
}

const ContainerMain = ({ children }: ContainerMainProps) => {
  return (
    <main className="max-w-[1500px] mx-auto p-6 w-full box-border">
      {children}
    </main>
  );
};

export default ContainerMain;
