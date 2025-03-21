// src/pages/DeveloperView.tsx
import React from "react";
import SignTransaction from "../components/SignTransaction";

const DeveloperView: React.FC = () => {
    return (
        <div>
            <h2>Developer View</h2>
            <p>Generate & share transactions.</p>
            <SignTransaction />
        </div>
    );
};

export default DeveloperView;
