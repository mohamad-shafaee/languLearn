import React from "react";
import "../styles/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer w-full bg-blue-200 px-4 pt-16 pb-4 m-0">
      <div className="container">
        <p className="text-sm m-4 hover:font-bold">© {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
