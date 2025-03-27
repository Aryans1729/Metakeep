// src/components/WalletConnector.tsx
import React, { useState } from "react";
import Button from "./ui/Button";

const WalletConnector: React.FC = () => {
  const [connected, setConnected] = useState(false);

  const connectWallet = () => {
    setConnected(true);
  };

  return (
    <div>
      <Button onClick={connectWallet} className="w-full py-2">
        {connected ? "Wallet Connected" : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default WalletConnector;


