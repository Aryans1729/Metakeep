import React, { useEffect, useState } from "react";
import { ethers, parseUnits } from "ethers";
import sdk from "../../src/config/metakeep";


declare global {
  interface Window {
    ethereum?: any;
  }
}

const UserView: React.FC = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [abi, setAbi] = useState<any[]>([]);
  const [selectedFunction, setSelectedFunction] = useState("");
  const [parameters, setParameters] = useState<string[]>([]);

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
    }
  }, []);

  // Helper function to create transaction payload
  const createTransactionData = async (provider: any, userAddress: string) => {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const contractFunction = contract.interface.getFunction(selectedFunction);
    if (!contractFunction) {
      alert("Invalid contract function.");
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
    try {
      if (!sdk) {
        alert("MetaKeep SDK not initialized.");
        return;
      }
      if (!selectedFunction) {
        alert("Please select a function.");
        return;
      }

      const provider = new ethers.JsonRpcProvider(rpcUrl);

      // Fetch user address directly using getWallet
      const walletResponse = await sdk.getWallet();
      console.log("walletResponse", walletResponse)
      if (walletResponse.status !== "SUCCESS" || !walletResponse.wallet.ethAddress) {
        alert("Unable to retrieve user wallet.");
        return;
      }
      const userAddress = walletResponse.wallet.ethAddress;
      console.log("User Address (MetaKeep):", userAddress);

      const txData = await createTransactionData(provider, userAddress);
      if (!txData) return;

      // Fix nonce format for MetaKeep
      txData.nonce = ethers.toBeHex(txData.nonce);

      console.log("Transaction With MetaKeep:", JSON.stringify(txData, null, 2));

      // Sign and submit transaction
      const signedTx = await sdk.signTransaction(txData, "Sign Contract Interaction");
      console.log("Signed transaction received:", signedTx);

      console.log("Signed Transaction:", signedTx);
      console.log("Raw Signed Transaction:", signedTx.signedRawTransaction);

      const txResponse = await provider.broadcastTransaction(signedTx.signedRawTransaction);
      console.log("Transaction sent (With MetaKeep):", txResponse.hash);
      alert(`Transaction Sent! Tx Hash: ${txResponse.hash}`);
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

      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Execute Transaction</h2>

      <select
        className="w-full p-2 border rounded mb-2"
        onChange={(e) => setSelectedFunction(e.target.value)}
        value={selectedFunction}
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

      <input
        type="text"
        placeholder="Enter Parameters (comma-separated)"
        className="w-full p-2 border rounded mb-2"
        value={parameters.join(",")}
        onChange={(e) => setParameters(e.target.value.split(",").map((p) => p.trim()))}
      />

      <button
        onClick={handleTransactionWithMetaKeep}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Send With MetaKeep
      </button>
    </div>
  );
};

export default UserView;