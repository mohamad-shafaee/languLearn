import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content guest">{children}</main>
      <Footer />
    </>
  );
};

export default GuestLayout;
