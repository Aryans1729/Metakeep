import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    MetaKeep?: any;
  }
}

const UserView: React.FC = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [abi, setAbi] = useState<any[]>([]);
  const [selectedFunction, setSelectedFunction] = useState("");
  const [parameters, setParameters] = useState<string[]>([]);
  const [sdk, setSdk] = useState<any>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setContractAddress(urlParams.get("contract") || "");
    setChainId(urlParams.get("chainId") || "");
    setRpcUrl(urlParams.get("rpcUrl") || "");

    try {
      const abiEncoded = urlParams.get("abi") || "";
      console.log("Raw ABI from URL:", abiEncoded);

      if (!abiEncoded) {
        console.warn("ABI parameter is missing from URL.");
        return;
      }

      let decodedAbiString;
      try {
        decodedAbiString = atob(abiEncoded);
        console.log("Decoded ABI String:", decodedAbiString);
      } catch (decodeError) {
        console.error("Error decoding ABI:", decodeError);
        return;
      }

      let parsedAbi;
      try {
        parsedAbi = JSON.parse(decodedAbiString);
        console.log("Parsed ABI:", parsedAbi);
      } catch (parseError) {
        console.error("Error parsing ABI:", parseError);
        return;
      }

      // Check if ABI is an array or inside an object
      if (Array.isArray(parsedAbi)) {
        setAbi(parsedAbi);
      } else if (parsedAbi.abi && Array.isArray(parsedAbi.abi)) {
        setAbi(parsedAbi.abi);
      } else {
        console.error("Invalid ABI format:", parsedAbi);
      }
    } catch (error) {
      console.error("Unexpected error handling ABI:", error);
    }

    if (window.MetaKeep) {
      const metaKeepInstance = new window.MetaKeep({
        appId: "9cc98bca-da35-4da8-8f10-655b3e51cb9e",
      });
      setSdk(metaKeepInstance);
    }
  }, []);

  const handleTransaction = async () => {
    if (!sdk) {
      alert("MetaKeep SDK not initialized.");
      return;
    }
    if (!selectedFunction) {
      alert("Please select a function to execute.");
      return;
    }

    try {
      console.log("Executing transaction with params:", {
        chainId: Number(chainId),
        rpcUrl,
        contract: contractAddress,
        functionName: selectedFunction,
        args: parameters.map((param) => param.trim()),
      });

      await sdk.transact({
        chainId: Number(chainId),
        rpcUrl,
        contract: contractAddress,
        functionName: selectedFunction,
        args: parameters.map((param) => param.trim()),
      });

      alert("Transaction submitted successfully!");
    } catch (error: unknown) {
      console.error("Transaction failed:", error);

      let errorMessage = "Transaction failed due to an unknown error.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(`Transaction failed: ${errorMessage}`);
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
        onClick={handleTransaction}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Sign & Submit Transaction
      </button>
    </div>
  );
};

export default UserView;
