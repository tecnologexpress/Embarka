import type { ReactNode } from "react";
import Header from "../organisms/Header";
import ContainerMain from "../atoms/ContainerMain";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <ContainerMain>{children}</ContainerMain>
    </>
  );
};

export default Layout;
