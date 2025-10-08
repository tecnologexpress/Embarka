import type { ReactNode } from "react";

interface ContainerMainProps {
  children: ReactNode;
}

const ContainerMain = ({ children }: ContainerMainProps) => {
  return (
    <main className="mt-4 rounded-sm shadow-sm shadow-zinc-400 max-w-[1500px] bg-[#cccccccc] mx-auto p-6 w-full box-border">
      {children}
    </main>
  );
};

export default ContainerMain;
