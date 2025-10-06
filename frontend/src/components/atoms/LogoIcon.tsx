import React from "react";

interface LogoProps {
  className?: string;
}

const LogoIcon: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div
      className={`font-bold ${className}`}
      style={{ background: "transparent" }}
    >
      <img
        src="/src/assets/logo/logo_icon.png"
        alt="Embarka Logo"
        className="h-full w-auto"
      />
    </div>
  );
};

export default LogoIcon;
