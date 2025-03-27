import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, XCircle, Loader2, Copy, CheckCircle, X } from "lucide-react";
import sdk from "../config/metakeep";

const TransactionStatus = {
  PENDING: "pending",
  SIGNING: "signing",
  BROADCASTING: "broadcasting",
  SUCCESS: "success",
  ERROR: "error",
};

const UserTransaction: React.FC = () => {
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [status, setStatus] = useState(TransactionStatus.PENDING);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showHashModal, setShowHashModal] = useState(false);

    // Parse transaction hash from URL if available
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const hashFromUrl = urlParams.get("txHash");
        if (hashFromUrl) {
            setTransactionHash(hashFromUrl);
            setStatus(TransactionStatus.SUCCESS);
            setProgress(100);
            // Auto-show the hash modal when loaded from URL
            setShowHashModal(true);
        }
    }, []);

    // Mock transaction data - in real app, this would come from URL or props
    const transactionData = {
        to: "0x123456789abcdef...", // Replace with actual recipient address
        value: "0.1", // Transaction amount in ETH
        data: "", // Optional transaction data
        chainId: "1", // Ethereum mainnet
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        if (transactionHash) {
            try {
                await navigator.clipboard.writeText(transactionHash);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy: ", err);
            }
        }
    };

    useEffect(() => {
        // Only run this if we don't already have a transaction hash from the URL
        if (!transactionHash) {
            const executeTransaction = async () => {
                try {
                    // Start progress animation
                    setStatus(TransactionStatus.PENDING);
                    let currentProgress = 0;
                    const progressInterval = setInterval(() => {
                        currentProgress += 5;
                        if (currentProgress > 95) {
                            clearInterval(progressInterval);
                        } else {
                            setProgress(currentProgress);
                        }
                    }, 200);

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStatus(TransactionStatus.SIGNING);
                    
                    const reason = "User transaction approval"; // Required second argument

                    // Call signTransaction with both parameters
                    const signature = await sdk.signTransaction(transactionData, reason);
                    
                    // Once signature is received, update status
                    setStatus(TransactionStatus.BROADCASTING);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Simulate transaction confirmation
                    clearInterval(progressInterval);
                    setProgress(100);
                    setTransactionHash("0x" + Array(64).fill(0).map(() => 
                        Math.floor(Math.random() * 16).toString(16)).join(""));
                    setStatus(TransactionStatus.SUCCESS);
                } catch (error) {
                    setStatus(TransactionStatus.ERROR);
                    setProgress(0);
                    setError(error instanceof Error ? error.message : "Transaction failed");
                    console.error("Transaction signing failed:", error);
                }
            };

            executeTransaction();
        }
    }, [transactionHash]);

    const getStatusText = () => {
        switch (status) {
            case TransactionStatus.PENDING:
                return "Preparing Transaction...";
            case TransactionStatus.SIGNING:
                return "Waiting for Signature...";
            case TransactionStatus.BROADCASTING:
                return "Broadcasting to Network...";
            case TransactionStatus.SUCCESS:
                return "Transaction Successful!";
            case TransactionStatus.ERROR:
                return "Transaction Failed";
            default:
                return "Processing...";
        }
    };

    const openEtherscan = () => {
        if (transactionHash) {
            window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank');
        }
    };

    return (
        <div 
            className="max-w-md mx-auto rounded-xl p-6 mt-8 relative"
            style={{
                backgroundImage: "url(/images/participatebg3.png)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "rgba(255, 255, 255, 0.04)",
            }}
        >
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
                                View on Etherscan
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <h2 className="text-xl font-bold text-white mb-4">Transaction Status</h2>
            
            {/* Transaction Details */}
            <div 
                className="bg-black/20 rounded-lg p-4 mb-6"
                style={{
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
            >
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Recipient:</span>
                    <span className="text-white font-mono">{transactionData.to.substring(0, 8)}...{transactionData.to.substring(transactionData.to.length - 6)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">{transactionData.value} ETH</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white">Ethereum Mainnet</span>
                </div>
            </div>
            
            {/* Status Indicator */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">{getStatusText()}</span>
                    <span className="text-sm text-primary-yellow">{progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full">
                    <div 
                        className="h-full rounded-full transition-all duration-300 ease-in-out"
                        style={{ 
                            width: `${progress}%`,
                            background: status === TransactionStatus.ERROR ? "#ef4444" : "#FFD60A"
                        }}
                    ></div>
                </div>
            </div>
            
            {/* Status Icon */}
            <div className="flex justify-center mb-6">
                {status === TransactionStatus.SUCCESS && (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20">
                        <Check className="w-8 h-8 text-green-500" />
                    </div>
                )}
                
                {status === TransactionStatus.ERROR && (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500/20">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                )}
                
                {(status === TransactionStatus.PENDING || status === TransactionStatus.SIGNING || status === TransactionStatus.BROADCASTING) && (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-yellow/20">
                        <Loader2 className="w-8 h-8 text-primary-yellow animate-spin" />
                    </div>
                )}
            </div>
            
            {/* Transaction Hash */}
            {transactionHash && status === TransactionStatus.SUCCESS && (
                <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Transaction Hash:</span>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => setShowHashModal(true)}
                                className="text-primary-yellow text-sm flex items-center"
                            >
                                View Full Hash
                            </button>
                        </div>
                    </div>
                    <div className="font-mono text-xs text-white/80 bg-black/30 p-2 rounded border border-white/5">
                        {transactionHash.substring(0, 12)}...{transactionHash.substring(transactionHash.length - 12)}
                    </div>
                </div>
            )}
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 text-red-400 text-sm">
                    {error}
                </div>
            )}
            
            {/* Button to go back or retry */}
            <button
                onClick={() => window.history.back()}
                className="w-full py-3 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
                {status === TransactionStatus.ERROR ? "Try Again" : "Return Home"}
            </button>
        </div>
    );
};

export default UserTransaction;