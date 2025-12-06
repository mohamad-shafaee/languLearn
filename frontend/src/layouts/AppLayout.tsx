import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="block items-center justify-center min-h-screen w-full bg-gray-50 text-gray-800 overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
};

export default AppLayout;
