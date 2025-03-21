import React, { useState } from "react";
import sdk from "../config/metakeep";

const SignTransaction: React.FC = () => {
    // State to store transaction hash
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    const handleSignTransaction = async () => {
        try {
            const transactionData = {
                to: "0x123456789abcdef...", // Replace with recipient address
                value: "0.1", // Transaction amount
                data: "", // Optional transaction data
            };

            const reason = "User initiated transaction"; // Provide a reason

            // Sign transaction using MetaKeep SDK
            const signature = await sdk.signTransaction(transactionData, reason);

            // Update state with signed transaction hash
            setTransactionHash(signature);
        } catch (error) {
            console.error("Transaction signing failed:", error);
        }
    };

    return (
        <div>
            <button onClick={handleSignTransaction}>Sign Transaction</button>
            {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
        </div>
    );
};

export default SignTransaction;
