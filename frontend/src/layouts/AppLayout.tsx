import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen
       w-full bg-white text-gray-800 overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
};

export default AppLayout;
