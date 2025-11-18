import React from "react";
import { useAuth } from "../auth";
import "../styles/header.css";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">MyAppt</h1>
        <nav>
          {user ? (
            <ul className="nav-links">
              <li>Welcome, {user.name}</li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          ) : (
            <ul className="nav-links">
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
