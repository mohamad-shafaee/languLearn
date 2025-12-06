import React from "react";
import { useAuth } from "../auth";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [userOpen, setUserOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const closeUserMenu = () => {
    setUserOpen(false);
  };

  const goToPage = (e, page) => {
    navigate("/"+ page);
    closeUserMenu();
  };

  return (
    <header className="border-1 border-blue-700 bg-blue-50 w-full">
      <div className="border-2 border-red-500 w-full mx-auto
       px-4 py-3 flex items-center justify-between bg-white/50 md:justify-start">
        {/* MOBILE: Left side - Hamburger */}
        <button 
          className="md:hidden mr-4"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 text-slate-700 mr-auto">
          <a href="#" className="hover:text-sky-600" onClick={(e)=>goToPage(e, '')}>Home</a>
          <a href="#" className="hover:text-sky-600" onClick={(e)=>goToPage(e, 'about')}>About&Contacts</a>
          <a href="#" className="hover:text-sky-600">Fields</a>
        </nav>
        {/* Login/Register - User menu */}
        <div className="mr-auto">
            {user ? (
            <div className="nav-links cursor-pointer">
              <div className="flex" onClick={() => setUserOpen(!userOpen)}>
                <div className="inline text-sm">{user.name ?? user.email}</div><div className="inline">
                  <ChevronDown size={24} color="green"/></div></div>
              {userOpen && (<div className="absolute bg-white/50 mt-2 bg-white p-2 rounded w-36">
                <div className="block text-left text-sm mx-0 w-full mt-2 pr-8" onClick={logout}>Logout</div>
                <div className="block text-left text-sm mx-0 w-full mt-2 pr-8" onClick={(e)=>goToPage(e, 'profile')}>Profile</div>
              </div>)}
            </div>
          ) : (
          <div className="nav-links">
              <a href="/login" className="text-sm font-semibold text-sky-600">Login/Register</a>
            </div>
          )}
        </div>
        {/* Logo */}
        <div className="font-bold text-xl mr-auto md:mr-8">
          MyLogo
        </div>
      </div>
         {/* MOBILE: Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t p-4 space-y-3">
          <a href="#" className="block hover:text-sky-600" onClick={(e)=>goToPage(e, '')}>Home</a>
          <a href="#" className="block hover:text-sky-600" onClick={(e)=>goToPage(e, 'about')}>About&Contacts</a>
          <a href="#" className="block hover:text-sky-600">Fields</a>
        </div>
      )}
    </header>
  );
};

export default Header;

