import React, { useState, useRef } from "react";

const DeveloperView: React.FC = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [abi, setAbi] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const encodeBase64 = (input: string) => {
    return btoa(unescape(encodeURIComponent(input)));
  };

  const validateInputs = () => {
    if (!contractAddress || !chainId || !rpcUrl || !abi) {
      alert("All fields are required!");
      return false;
    }
    try {
      JSON.parse(abi);
    } catch (error) {
      alert("Invalid ABI JSON format.");
      return false;
    }
    return true;
  };

  const generateTransactionLink = () => {
    if (!validateInputs()) return;
    const encodedABI = encodeBase64(abi);
    const link = `${window.location.origin}/user?contract=${contractAddress}&chainId=${chainId}&rpcUrl=${encodeURIComponent(rpcUrl)}&abi=${encodedABI}`;
    setGeneratedLink(link);
    setShowModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setIsCopied(false);
  };

  // Custom fancy input component
  const FancyInput = ({ 
    placeholder, 
    value, 
    onChange, 
    icon, 
    isTextarea = false 
  }: { 
    placeholder: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; 
    icon?: React.ReactNode;
    isTextarea?: boolean;
  }) => {
    // Create a reference to the input/textarea element
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    
    // Handle focus events
    const handleFocus = () => {
      setIsFocused(true);
    };
    
    const handleBlur = () => {
      setIsFocused(false);
    };
    
    // Handle click on the container to focus the input
    const handleContainerClick = (e: React.MouseEvent) => {
      // Only focus if we clicked the container but not directly on the input
      // This prevents focus loss when clicking on an already focused input
      if (inputRef.current && e.target !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    return (
      <div 
        id="poda" 
        className={`mb-6 relative ${isFocused ? 'is-focused' : ''}`} 
        onClick={handleContainerClick}
      >
        <div className="glow"></div>
        <div className="darkBorderBg"></div>
        <div className="darkBorderBg"></div>
        <div className="darkBorderBg"></div>
        <div className="white"></div>
        <div className="border"></div>
        <div id="main" className="relative">
          {isTextarea ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              placeholder={placeholder}
              className="input resize-none"
              style={{ height: '120px', paddingTop: '15px', position: 'relative', zIndex: 5 }}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></textarea>
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              placeholder={placeholder}
              type="text"
              className="input"
              style={{ position: 'relative', zIndex: 5 }}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
          <div id="input-mask"></div>
          <div id="pink-mask"></div>
          {icon && (
            <div id="search-icon">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#010201] p-6 relative overflow-hidden">
      {/* Grid background */}
      <div className="grid"></div>
      
      <div className="z-10 max-w-lg w-full">
        <h2 className="text-3xl font-extrabold text-white text-center mb-10">
          🚀 Create Shareable Transaction Link
        </h2>

        <div className="space-y-4 mb-6">
          <FancyInput
            placeholder="Smart Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#contract)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-3.08"></path>
                <circle cx="11" cy="13" r="2"></circle>
                <path d="M17 21v-6"></path>
                <path d="M14 18h6"></path>
                <defs>
                  <linearGradient id="contract">
                    <stop offset="0%" stopColor="#f8e7f8"></stop>
                    <stop offset="50%" stopColor="#b6a9b7"></stop>
                  </linearGradient>
                </defs>
              </svg>
            }
          />
          
          <FancyInput
            placeholder="Chain ID"
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#chain)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                <defs>
                  <linearGradient id="chain">
                    <stop offset="0%" stopColor="#f8e7f8"></stop>
                    <stop offset="50%" stopColor="#b6a9b7"></stop>
                  </linearGradient>
                </defs>
              </svg>
            }
          />
          
          <FancyInput
            placeholder="RPC URL"
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#rpc)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                <defs>
                  <linearGradient id="rpc">
                    <stop offset="0%" stopColor="#f8e7f8"></stop>
                    <stop offset="50%" stopColor="#b6a9b7"></stop>
                  </linearGradient>
                </defs>
              </svg>
            }
          />
          
          <FancyInput
            placeholder="Enter Contract ABI JSON"
            value={abi}
            onChange={(e) => setAbi(e.target.value)}
            isTextarea={true}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#abi)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
                <defs>
                  <linearGradient id="abi">
                    <stop offset="0%" stopColor="#f8e7f8"></stop>
                    <stop offset="50%" stopColor="#b6a9b7"></stop>
                  </linearGradient>
                </defs>
              </svg>
            }
          />
        </div>

        <div className="flex justify-center mt-8 mb-8">
          <button 
            onClick={generateTransactionLink} 
            className="animated-button"
          >
            <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
            <span className="text">Generate Link</span>
            <span className="circle"></span>
            <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Modal for displaying the generated link */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Your Shareable Link</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-text">{generatedLink}</p>
            </div>
            <div className="modal-footer">
              <button
                className="copy-button"
                onClick={copyToClipboard}
              >
                {isCopied ? "Copied!" : "Copy to Clipboard"}
              </button>
              <button
                className="embed-button"
                onClick={() => window.open(generatedLink, '_blank')}
              >
                Open Link
              </button>
              <button className="modal-button" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for the fancy inputs and effects */}
      {/* @ts-ignore */}
      <style jsx="true">{`
        .grid {
          height: 800px;
          width: 800px;
          background-image: linear-gradient(to right, #0f0f10 1px, transparent 1px),
            linear-gradient(to bottom, #0f0f10 1px, transparent 1px);
          background-size: 1rem 1rem;
          background-position: center center;
          position: absolute;
          z-index: -1;
          filter: blur(1px);
        }
        
        .white,
        .border,
        .darkBorderBg,
        .glow {
          max-height: 70px;
          max-width: 100%;
          height: 100%;
          width: 100%;
          position: absolute;
          overflow: hidden;
          z-index: 1;
          border-radius: 12px;
          filter: blur(3px);
          pointer-events: none; /* Make sure these don't interfere with input */
        }

        .embed-button {
          background-color: #30aa4c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .embed-button:hover {
          background-color: #45b45d;
        }
        
        .input {
          background-color: #010201;
          border: none;
          width: 100%;
          height: 56px;
          border-radius: 10px;
          color: white;
          padding-inline: 59px;
          font-size: 18px;
          position: relative;
          z-index: 10; /* Ensure input is above decorative elements */
        }
        
        #poda {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
        }
        
        .input::placeholder {
          color: #c0b9c0;
        }

        .input:focus {
          outline: none;
        }

        #main:focus-within > #input-mask {
          display: none;
          pointer-events: none;
        }

        #input-mask {
          pointer-events: none;
          width: 100px;
          height: 20px;
          position: absolute;
          background: linear-gradient(90deg, transparent, black);
          top: 18px;
          left: 70px;
        }
        
        #pink-mask {
          pointer-events: none;
          width: 30px;
          height: 20px;
          position: absolute;
          background: #cf30aa;
          top: 10px;
          left: 5px;
          filter: blur(20px);
          opacity: 0.8;
          transition: all 2s;
          z-index: 2;
        }
        
        #main:hover > #pink-mask {
          opacity: 0;
        }

        .white {
          max-height: 63px;
          max-width: 100%;
          border-radius: 10px;
          filter: blur(2px);
        }

        .white::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(83deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.4);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0) 0%,
            #a099d8,
            rgba(0, 0, 0, 0) 8%,
            rgba(0, 0, 0, 0) 50%,
            #dfa2da,
            rgba(0, 0, 0, 0) 58%
          );
          transition: all 2s;
        }
        
        .border {
          max-height: 59px;
          max-width: 100%;
          border-radius: 11px;
          filter: blur(0.5px);
        }
        
        .border::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(70deg);
          position: absolute;
          width: 600px;
          height: 600px;
          filter: brightness(1.3);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #1c191c,
            #402fb5 5%,
            #1c191c 14%,
            #1c191c 50%,
            #cf30aa 60%,
            #1c191c 64%
          );
          transition: all 2s;
        }
        
        .darkBorderBg {
          max-height: 65px;
          max-width: 100%;
        }
        
        .darkBorderBg::before {
          content: "";
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(82deg);
          position: absolute;
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #18116a,
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            #6e1b60,
            rgba(0, 0, 0, 0) 60%
          );
          transition: all 2s;
        }
        
        #poda:hover > .darkBorderBg::before {
          transform: translate(-50%, -50%) rotate(-98deg);
        }
        
        #poda:hover > .glow::before {
          transform: translate(-50%, -50%) rotate(-120deg);
        }
        
        #poda:hover > .white::before {
          transform: translate(-50%, -50%) rotate(-97deg);
        }
        
        #poda:hover > .border::before {
          transform: translate(-50%, -50%) rotate(-110deg);
        }

        /* Use a class for focus state instead of focus-within */
        #poda.is-focused > .darkBorderBg::before {
          transform: translate(-50%, -50%) rotate(442deg);
          transition: all 4s;
        }
        
        #poda.is-focused > .glow::before {
          transform: translate(-50%, -50%) rotate(420deg);
          transition: all 4s;
        }
        
        #poda.is-focused > .white::before {
          transform: translate(-50%, -50%) rotate(443deg);
          transition: all 4s;
        }
        
        #poda.is-focused > .border::before {
          transform: translate(-50%, -50%) rotate(430deg);
          transition: all 4s;
        }

        .glow {
          overflow: hidden;
          filter: blur(30px);
          opacity: 0.4;
          max-height: 130px;
          max-width: 100%;
        }
        
        .glow:before {
          content: "";
          z-index: 2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(60deg);
          position: absolute;
          width: 999px;
          height: 999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #000,
            #402fb5 5%,
            #000 38%,
            #000 50%,
            #cf30aa 60%,
            #000 87%
          );
          transition: all 2s;
          pointer-events: none; /* Make sure this doesn't block input */
        }

        @keyframes rotate {
          100% {
            transform: translate(-50%, -50%) rotate(450deg);
          }
        }
        
        @keyframes leftright {
          0% {
            transform: translate(0px, 0px);
            opacity: 1;
          }
          49% {
            transform: translate(250px, 0px);
            opacity: 0;
          }
          80% {
            transform: translate(-40px, 0px);
            opacity: 0;
          }
          100% {
            transform: translate(0px, 0px);
            opacity: 1;
          }
        }

        #search-icon {
          position: absolute;
          left: 20px;
          top: 15px;
          z-index: 2;
        }
        
        /* Custom styles for textarea */
        textarea.input {
          height: 120px;
          padding-top: 15px;
          resize: none;
        }
        
        /* Fix the z-index stacking for inputs */
        #main {
          position: relative;
          z-index: 10;
        }
        
        /* Animated Button */
        .animated-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 16px 36px;
          border: 4px solid;
          border-color: transparent;
          font-size: 16px;
          background-color: inherit;
          border-radius: 100px;
          font-weight: 600;
          color: greenyellow;
          box-shadow: 0 0 0 2px greenyellow;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .animated-button svg {
          position: absolute;
          width: 24px;
          fill: greenyellow;
          z-index: 9;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .animated-button .arr-1 {
          right: 16px;
        }
        
        .animated-button .arr-2 {
          left: -25%;
        }
        
        .animated-button .circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background-color: greenyellow;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .animated-button .text {
          position: relative;
          z-index: 1;
          transform: translateX(-12px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
          font-weight: 600;
        }
        
        .animated-button:hover {
          box-shadow: 0 0 0 12px transparent;
          color: #212121;
          border-radius: 12px;
        }
        
        .animated-button:hover .arr-1 {
          right: -25%;
        }
        
        .animated-button:hover .arr-2 {
          left: 16px;
        }
        
        .animated-button:hover .text {
          transform: translateX(12px);
        }
        
        .animated-button:hover svg {
          fill: #212121;
        }
        
        .animated-button:active {
          scale: 0.95;
          box-shadow: 0 0 0 4px greenyellow;
        }
        
        .animated-button:hover .circle {
          width: 220px;
          height: 220px;
          opacity: 1;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .modal-container {
          background: rgb(20, 20, 30);
          border-radius: 12px;
          max-width: 90%;
          width: 600px;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          border: 1px solid #383869;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .modal-header {
          background: linear-gradient(90deg, #2c1e63, #39277a);
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #39277a;
        }
        
        .modal-title {
          color: white;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        
        .modal-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 24px;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }
        
        .modal-close:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .modal-body {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .modal-text {
          color: #d0d0e9;
          font-family: monospace;
          background-color: #1a1a2e;
          padding: 15px;
          border-radius: 8px;
          word-break: break-all;
          border: 1px solid #2d2d4a;
          cursor: text;
          user-select: all;
        }
        
        .modal-footer {
          padding: 15px 20px;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid #2d2d4a;
          gap: 10px;
        }
        
        .modal-button {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .modal-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .copy-button {
          background-color: #4c34a3;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .copy-button:hover {
          background-color: #5d45b4;
        }
      `}</style>
    </div>
  );
};

export default DeveloperView;