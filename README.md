# MetaKeep Embedded Wallet Project

This project leverages the MetaKeep Embedded Wallet Web SDK to enable developers to create and share one-off transaction links for end users to sign and submit transactions on the blockchain. The application is deployed and accessible at [http://18.234.174.148:3000/](http://18.234.174.148:3000/).

## Overview
This repository demonstrates how to interact with MetaKeep’s SDK, integrating blockchain functionalities in a seamless manner. It includes a React-based frontend, a backend with serverless architecture, and smart contracts deployed on the Polygon Mumbai Testnet.

## Features
- Create and share one-off transaction links
- Retrieve and manage wallet information
- Sign transactions using MetaKeep’s SDK
- Backend services for telemetry and monitoring
- Deployed on AWS EC2 with PM2 for process management

## Project Structure
```
MetaKeep Embedded Wallet Project
├── frontend                # React-based frontend application
│   ├── src
│   │   ├── components      # Reusable UI components
│   │   ├── services        # API service integrations
│   │   ├── hooks           # Custom React hooks
│   │   ├── utils           # Utility functions
│   ├── public              # Static assets
│   ├── package.json
│   └── ...
├── backend                # Serverless backend and infra
│   ├── infra              # AWS Infrastructure setup
│   ├── functions          # Lambda functions for telemetry
│   ├── server.js          # Express API setup for telemetry
│   ├── package.json
│   └── ...
└── blockchain             # Smart contracts and deployment scripts
    ├── contracts          # Solidity contracts
    ├── scripts            # Deployment scripts using Hardhat
    ├── hardhat.config.js
    └── ...
```

## Workflow
1. **User Flow**
   - Users interact with the MetaKeep wallet through the frontend UI.
   - Wallet and transaction data are retrieved using MetaKeep’s `getWallet` and `signTransaction` APIs.
   - Transactions are signed and broadcasted to the Polygon Mumbai network.

2. **Developer Flow**
   - Clone the repository and install dependencies.
   - Configure MetaKeep credentials and Polygon Mumbai network settings.
   - Deploy contracts using Hardhat.
   - Deploy backend and frontend to AWS EC2.

## MetaKeep SDK Usage
- `getWallet`: Retrieves wallet information for transactions.
- `signTransaction`: Signs and submits transactions on the blockchain.

## Deployment on AWS EC2
1. Launch EC2 instance and SSH into it.
2. Install necessary packages and set up environment variables.
3. Clone the repository and build the application.
4. Use PM2 to run the app persistently.
5. Configure security groups to allow HTTP/HTTPS traffic.

## Architectural Design
The architecture involves:
- **Frontend (React)**: User interface for wallet management and transactions.
- **Backend (Express, Lambda)**: Serverless architecture for telemetry and API handling.
- **Blockchain (Polygon Mumbai, Hardhat)**: Smart contract deployment and interaction.
- **MetaKeep SDK**: Wallet and transaction management.

## Future Enhancements
- Add support for more blockchains
- Implement transaction history and analytics
- Enhance security with multi-signature support

## License
This project is licensed under the MIT License.

