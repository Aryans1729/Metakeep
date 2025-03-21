import React, { useEffect, useState } from "react";
import sdk from "../config/metakeep";

const UserTransaction: React.FC = () => {
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    useEffect(() => {
        const signTransaction = async () => {
            try {
                const transactionData = {
                    to: "0x123456789abcdef...", // Replace with actual recipient address
                    value: "0.1", // Transaction amount
                    data: "", // Optional transaction data
                };

                const reason = "User transaction approval"; // Required second argument

                // Call signTransaction with both parameters
                const signature = await sdk.signTransaction(transactionData, reason);
                
                setTransactionHash(signature);
            } catch (error) {
                console.error("Transaction signing failed:", error);
            }
        };

        signTransaction();
    }, []);

    return (
        <div>
            <h2>User Transaction</h2>
            {transactionHash ? <p>Transaction Signed: {transactionHash}</p> : <p>Signing transaction...</p>}
        </div>
    );
};

export default UserTransaction;
