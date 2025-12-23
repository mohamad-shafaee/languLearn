import React from "react";
import AdminHeader from "../components/adminHeader";


const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AdminHeader />
      <main className="block items-center justify-center min-h-screen w-full bg-gray-50 text-gray-800 overflow-x-hidden">{children}</main>
    </>
  );
};

export default AdminLayout;
