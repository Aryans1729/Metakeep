import React, { useEffect, useState } from "react";
import { ethers, parseUnits } from "ethers";
import { ArrowUpRight, Check, XCircle, Loader2, Copy, CheckCircle, X } from "lucide-react";
import sdk from "../../src/config/metakeep";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Notification type definition
type NotificationType = "success" | "error" | "info";

const UserView: React.FC = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [abi, setAbi] = useState<any[]>([]);
  const [selectedFunction, setSelectedFunction] = useState("");
  const [parameters, setParameters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [showHashModal, setShowHashModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: NotificationType;
  }>({
    show: false,
    message: "",
    type: "info",
  });

  // Show notification function
  const showNotification = (message: string, type: NotificationType) => {
    setNotification({
      show: true,
      message,
      type,
    });

    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setContractAddress(urlParams.get("contract") || "");
    setChainId(urlParams.get("chainId") || "");
    setRpcUrl(urlParams.get("rpcUrl") || "");

    console.log("Extracted Chain ID:", urlParams.get("chainId"));

    try {
      const abiEncoded = urlParams.get("abi") || "";
      if (abiEncoded) {
        const decodedAbi = JSON.parse(atob(abiEncoded));
        setAbi(Array.isArray(decodedAbi) ? decodedAbi : decodedAbi.abi || []);
      }
    } catch (error) {
      console.error("Error processing ABI:", error);
      showNotification("Error processing ABI data", "error");
    }
  }, []);

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (transactionHash) {
      try {
        await navigator.clipboard.writeText(transactionHash);
        setCopied(true);
        showNotification("Transaction hash copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        showNotification("Failed to copy to clipboard", "error");
        console.error("Failed to copy: ", err);
      }
    }
  };

  const openEtherscan = () => {
    if (transactionHash) {
      window.open(`https://www.oklink.com/amoy/tx/${transactionHash}`, '_blank');
     
    }
  };

  // Helper function to create transaction payload
  const createTransactionData = async (provider: any, userAddress: string) => {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const contractFunction = contract.interface.getFunction(selectedFunction);
    if (!contractFunction) {
      showNotification("Invalid contract function", "error");
      return null;
    }

    const encodedData = contract.interface.encodeFunctionData(selectedFunction, parameters);
    const nonce = await provider.getTransactionCount(userAddress, "latest");
    const gasEstimate = await provider.estimateGas({
      to: contractAddress,
      data: encodedData,
      from: userAddress,
    });

    const txData = {
      type: 2,
      from: userAddress,
      to: contractAddress,
      value: "0x0",
      data: encodedData,
      nonce: ethers.toBeHex(nonce),
      gas: ethers.toBeHex(gasEstimate),
      maxFeePerGas: ethers.toBeHex(parseUnits("35", "gwei")),
      maxPriorityFeePerGas: ethers.toBeHex(parseUnits("30", "gwei")),
      chainId: ethers.toBeHex(chainId),
    };

    console.log("Transaction Payload:", JSON.stringify(txData, null, 2));
    return txData;
  };

  // Send Transaction With MetaKeep
  const handleTransactionWithMetaKeep = async () => {
    setIsLoading(true);
    try {
      if (!sdk) {
        showNotification("MetaKeep SDK not initialized", "error");
        return;
      }
      if (!selectedFunction) {
        showNotification("Please select a function", "error");
        return;
      }

      showNotification("Initializing transaction...", "info");
      const provider = new ethers.JsonRpcProvider(rpcUrl);

      // Fetch user address directly using getWallet
      const walletResponse = await sdk.getWallet();
      console.log("walletResponse", walletResponse);
      if (walletResponse.status !== "SUCCESS" || !walletResponse.wallet.ethAddress) {
        showNotification("Unable to retrieve user wallet", "error");
        return;
      }
      const userAddress = walletResponse.wallet.ethAddress;
      console.log("User Address (MetaKeep):", userAddress);

      showNotification("Building transaction...", "info");
      const txData = await createTransactionData(provider, userAddress);
      if (!txData) {
        setIsLoading(false);
        return;
      }

      // Fix nonce format for MetaKeep
      txData.nonce = ethers.toBeHex(txData.nonce);

      console.log("Transaction With MetaKeep:", JSON.stringify(txData, null, 2));

      // Sign and submit transaction
      showNotification("Please sign the transaction...", "info");
      const signedTx = await sdk.signTransaction(txData, "Sign Contract Interaction");
      console.log("Signed transaction received:", signedTx);

      console.log("Signed Transaction:", signedTx);
      console.log("Raw Signed Transaction:", signedTx.signedRawTransaction);

      showNotification("Broadcasting transaction...", "info");
      const txResponse = await provider.broadcastTransaction(signedTx.signedRawTransaction);
      console.log("Transaction sent (With MetaKeep):", txResponse.hash);
      
      // Save transaction hash and show modal
      setTransactionHash(txResponse.hash);
      setShowHashModal(true);
      showNotification("Transaction sent successfully!", "success");
      
      // Optional: Redirect to transaction status page
      // window.location.href = `/transaction?txHash=${txResponse.hash}`;
    } catch (error) {
      console.error("Transaction failed (With MetaKeep):", error);

      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        try {
          errorMessage = JSON.stringify(error);
        } catch {
          errorMessage = String(error);
        }
      }

      showNotification(`Error: ${errorMessage}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* Transaction Hash Modal */}
      {showHashModal && transactionHash && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full mx-4 border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Transaction Hash</h3>
              <button 
                onClick={() => setShowHashModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="bg-black/40 p-4 rounded-lg border border-gray-700 mb-4">
              <div className="font-mono text-white break-all whitespace-pre-wrap">
                {transactionHash}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              
              <button 
                onClick={openEtherscan}
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                View on Polygon
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shadow Dance Title */}
      <div className="shadow-dance-container">
        <h1 className="shadow-dance-text">METAKEEP</h1>
      </div>

      {/* Transaction Form */}
      <div className="transaction-form">
        <div className="form-item">
          <label>Function</label>
          <select
            className="fancy-input"
            onChange={(e) => setSelectedFunction(e.target.value)}
            value={selectedFunction}
            disabled={isLoading}
          >
            <option value="">Select Function</option>
            {abi
              .filter((func) => func.type === "function")
              .map((func, index) => (
                <option key={index} value={func.name}>
                  {func.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-item">
          <label>Parameters</label>
          <input
            type="text"
            placeholder="Enter Parameters (comma-separated)"
            className="fancy-input"
            value={parameters.join(",")}
            onChange={(e) =>
              setParameters(
                e.target.value.split(",").map((p) => p.trim())
              )
            }
            disabled={isLoading}
          />
        </div>

        <button
          className="star-button"
          onClick={handleTransactionWithMetaKeep}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loader"></span>
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            <>
              Send With MetaKeep
              <div className="star-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  version="1.1"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    imageRendering: "auto",
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                  }}
                  viewBox="0 0 784.11 815.53"
                >
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                    <path
                      className="fil0"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="star-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  version="1.1"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    imageRendering: "auto",
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                  }}
                  viewBox="0 0 784.11 815.53"
                >
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                    <path
                      className="fil0"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="star-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  version="1.1"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    imageRendering: "auto",
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                  }}
                  viewBox="0 0 784.11 815.53"
                >
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                    <path
                      className="fil0"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="star-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  version="1.1"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    imageRendering: "auto",
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                  }}
                  viewBox="0 0 784.11 815.53"
                >
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                    <path
                      className="fil0"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="star-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  version="1.1"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    imageRendering: "auto",
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                  }}
                  viewBox="0 0 784.11 815.53"
                >
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                    <path
                      className="fil0"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="star-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  version="1.1"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    imageRendering: "auto",
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                  }}
                  viewBox="0 0 784.11 815.53"
                >
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                    <path
                      className="fil0"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    ></path>
                  </g>
                </svg>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Snackbar Notification */}
      {notification.show && (
        <div className={`snackbar ${notification.type}`}>
          <div className="snackbar-content">
            <div className="snackbar-icon">
              {notification.type === "success" && (
                <CheckCircle size={20} />
              )}
              {notification.type === "error" && (
                <XCircle size={20} />
              )}
              {notification.type === "info" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
            </div>
            <div className="snackbar-message">{notification.message}</div>
            <button
              className="snackbar-close"
              onClick={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        /* Main container styling */
        .main-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: #121212;
          font-family: "Arial", sans-serif;
          padding: 20px;
          position: relative;
        }

        /* Shadow dance text styling */
        .shadow-dance-container {
          margin-bottom: 40px;
          text-align: center;
        }

        .shadow-dance-text {
          font-size: 4rem;
          color: #fff;
          text-shadow: 5px 5px 0 #ff005e, 10px 10px 0 #00d4ff;
          animation: shadow-dance 2s infinite;
        }

        @keyframes shadow-dance {
          0%,
          100% {
            text-shadow: 5px 5px 0 #ff005e, 10px 10px 0 #00d4ff;
          }
          50% {
            text-shadow: -5px -5px 0 #00d4ff, -10px -10px 0 #ff005e;
          }
        }

        /* Transaction form styling */
        .transaction-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-item {
          margin-bottom: 20px;
        }

        .form-item label {
          display: block;
          margin-bottom: 8px;
          color: #fff;
          font-size: 16px;
          font-weight: 500;
        }

        /* Fancy input styling */
        .fancy-input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .fancy-input:focus {
          outline: none;
          border-color: #ff005e;
          box-shadow: 0 0 15px rgba(255, 0, 94, 0.3);
        }

        .fancy-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Star button styling */
        .star-button {
          position: relative;
          padding: 12px 35px;
          background: #fec195;
          font-size: 17px;
          font-weight: 500;
          color: #181818;
          border: 3px solid #fec195;
          border-radius: 8px;
          box-shadow: 0 0 0 #fec1958c;
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          margin-top: 20px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .star-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: #d3aa85;
          border-color: #d3aa85;
        }

        .star-1 {
          position: absolute;
          top: 20%;
          left: 20%;
          width: 25px;
          height: auto;
          filter: drop-shadow(0 0 0 #fffdef);
          z-index: -5;
          transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
        }

        .star-2 {
          position: absolute;
          top: 45%;
          left: 45%;
          width: 15px;
          height: auto;
          filter: drop-shadow(0 0 0 #fffdef);
          z-index: -5;
          transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
        }

        .star-3 {
          position: absolute;
          top: 40%;
          left: 40%;
          width: 5px;
          height: auto;
          filter: drop-shadow(0 0 0 #fffdef);
          z-index: -5;
          transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
        }

        .star-4 {
          position: absolute;
          top: 20%;
          left: 40%;
          width: 8px;
          height: auto;
          filter: drop-shadow(0 0 0 #fffdef);
          z-index: -5;
          transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01);
        }

        .star-5 {
          position: absolute;
          top: 25%;
          left: 45%;
          width: 15px;
          height: auto;
          filter: drop-shadow(0 0 0 #fffdef);
          z-index: -5;
          transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01);
        }

        .star-6 {
          position: absolute;
          top: 5%;
          left: 50%;
          width: 5px;
          height: auto;
          filter: drop-shadow(0 0 0 #fffdef);
          z-index: -5;
          transition: all 0.8s ease;
        }

        .star-button:not(:disabled):hover {
          background: transparent;
          color: #fec195;
          box-shadow: 0 0 25px #fec1958c;
        }

        .star-button:not(:disabled):hover .star-1 {
          position: absolute;
          top: -80%;
          left: -30%;
          width: 25px;
          height: auto;
          filter: drop-shadow(0 0 10px #fffdef);
          z-index: 2;
        }

        .star-button:not(:disabled):hover .star-2 {
          position: absolute;
          top: -25%;
          left: 10%;
          width: 15px;
          height: auto;
          filter: drop-shadow(0 0 10px #fffdef);
          z-index: 2;
        }

        .star-button:not(:disabled):hover .star-3 {
          position: absolute;
          top: 55%;
          left: 25%;
          width: 5px;
          height: auto;
          filter: drop-shadow(0 0 10px #fffdef);
          z-index: 2;
        }

        .star-button:not(:disabled):hover .star-4 {
          position: absolute;
          top: 30%;
          left: 80%;
          width: 8px;
          height: auto;
          filter: drop-shadow(0 0 10px #fffdef);
          z-index: 2;
        }

        .star-button:not(:disabled):hover .star-5 {
          position: absolute;
          top: 25%;
          left: 115%;
          width: 15px;
          height: auto;
          filter: drop-shadow(0 0 10px #fffdef);
          z-index: 2;
        }

        .star-button:not(:disabled):hover .star-6 {
          position: absolute;
          top: 5%;
          left: 60%;
          width: 5px;
          height: auto;
          filter: drop-shadow(0 0 10px #fffdef);
          z-index: 2;
        }

        .fil0 {
          fill: #fffdef;
        }

        /* Loading spinner */
        .loader {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #181818;
          animation: spin 1s infinite linear;
          margin-right: 10px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .ml-2 {
          margin-left: 8px;
        }

        /* Snackbar styling */
        .snackbar {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          min-width: 300px;
          max-width: 90%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          animation: slide-up 0.3s ease-out forwards;
        }

        @keyframes slide-up {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        .snackbar.success {
          background: rgba(76, 175, 80, 0.95);
        }

        .snackbar.error {
          background: rgba(244, 67, 54, 0.95);
        }

        .snackbar.info {
          background: rgba(33, 150, 243, 0.95);
        }

        .snackbar-content {
          display: flex;
          align-items: center;
          padding: 16px;
          color: white;
        }

        .snackbar-icon {
          margin-right: 12px;
          display: flex;
        }

        .snackbar-message {
          flex: 1;
          font-size: 14px;
        }

        .snackbar-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          margin-left: 10px;
          padding: 0;
          display: flex;
          align-items: center;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .snackbar-close:hover {
          opacity: 1;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .shadow-dance-text {
            font-size: 3rem;
          }

          .transaction-form {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .shadow-dance-text {
            font-size: 2.5rem;
          }

          .snackbar {
            min-width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserView;