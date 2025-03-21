import React, { useState } from "react";

const DeveloperView: React.FC = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [abi, setAbi] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const encodeBase64 = (input: string) => {
    return btoa(unescape(encodeURIComponent(input)));
  };

  const generateTransactionLink = () => {
    const encodedABI = encodeBase64(abi);
    const link = `${window.location.origin}/user?contract=${contractAddress}&chainId=${chainId}&rpcUrl=${encodeURIComponent(rpcUrl)}&abi=${encodedABI}`;
    setGeneratedLink(link);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-lg w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          🚀 Create Shareable Transaction Link
        </h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Smart Contract Address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 transition"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          
          <input
            type="text"
            placeholder="Chain ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 transition"
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
          />
          
          <input
            type="text"
            placeholder="RPC URL"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 transition"
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
          />
          
          <textarea
            placeholder="Enter Contract ABI JSON"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 transition"
            rows={4}
            value={abi}
            onChange={(e) => setAbi(e.target.value)}
          ></textarea>
        </div>
        
        <button
          onClick={generateTransactionLink}
          className="w-full mt-6 bg-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-indigo-600 transition"
        >
          Generate Link
        </button>

        {generatedLink && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-inner">
            <p className="text-gray-800 font-medium mb-2">Share this link:</p>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 break-all hover:underline"
            >
              {generatedLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperView;