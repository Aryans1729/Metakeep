import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      <div className="bg-gradient-to-b from-white via-gray-100 to-gray-200 shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          🚀 MetaKeep Transaction Generator
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Generate and execute blockchain transactions seamlessly.
        </p>
        <div className="grid gap-4">
          <Link
            to="/developer"
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300"
          >
            Create Transaction
          </Link>
          <Link
            to="/user"
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition-all duration-300"
          >
            Execute Transaction
          </Link>
        </div>
      </div>
      <footer className="mt-10 text-gray-300 text-sm">
        Empowered by MetaKeep. Built for simplicity and style.
      </footer>
    </div>
  );
};

export default Home;
