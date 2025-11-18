import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  );
};

export default AuthenticatedLayout;
