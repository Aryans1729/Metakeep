import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      {/* Animated container */}
      <div className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-lg">
          🚀 MetaKeep Transaction Generator
        </h1>
        <p className="text-lg text-gray-800 font-medium mb-8">
          Generate and execute blockchain transactions seamlessly.
        </p>

        {/* Buttons with hover effects */}
        <div className="grid gap-4">
          <Link
            to="/developer"
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            Create Transaction
          </Link>
          <Link
            to="/user"
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            Execute Transaction
          </Link>
        </div>
      </div>

      {/* Footer with smooth opacity effect */}
      <footer className="mt-10 text-gray-300 text-sm opacity-90 hover:opacity-100 transition-opacity duration-300">
        Empowered by <span className="font-semibold">MetaKeep</span>. Built for simplicity and style.
      </footer>
    </div>
  );
};

export default Home;
