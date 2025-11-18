import React from "react";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
      <p className="text-lg text-center max-w-md">
        This is your home page. Start building your awesome app here!
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
        Get Started
      </button>
    </main>
  );
};

export default Home;
