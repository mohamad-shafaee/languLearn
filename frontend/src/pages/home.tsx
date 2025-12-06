import React from "react";

const Home: React.FC = () => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
      <p className="text-lg text-center">
        This is your home page. Start building your awesome app here!
      </p>
      <button className="mt-6 px-4 py-2 bg-white rounded-xl hover:bg-red-700 transition">
        Get Started
      </button>
      </>
  );
};

export default Home;
