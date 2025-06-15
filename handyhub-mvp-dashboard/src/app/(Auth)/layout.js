import LogoSvg from "@/assets/logos/LogoSvg";
import React from "react";

export default function AuthLayout({ children }) {
  return (
    <main className="flex-center to-primary-orange/50 h-screen w-full bg-gradient-to-br from-primary-blue/35">
      <div className="mx-auto lg:w-1/3 2xl:w-[25%]">
        <div className="mx-auto mb-5 w-max">
          <LogoSvg />
        </div>

        <div className="w-full rounded-lg bg-white">{children}</div>
      </div>
    </main>
  );
}
