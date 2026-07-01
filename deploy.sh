#!/bin/bash
set -e

echo "Starting CertifyX Deployment..."

# 1. Build Contracts
echo "Building Soroban smart contracts..."
cd contracts
make build

# 2. Deploy Registry Contract to Testnet
echo "Deploying Registry Contract to Stellar Testnet..."
# Requires ALICE_SECRET_KEY to be set in environment
if [ -z "$ALICE_SECRET_KEY" ]; then
    echo "Warning: ALICE_SECRET_KEY not set. Skipping contract deployment."
    CONTRACT_ID="NOT_DEPLOYED"
else
    # Deploy contract
    soroban contract deploy \
        --wasm target/wasm32-unknown-unknown/release/registry.wasm \
        --source ALICE_SECRET_KEY \
        --network testnet > contract_id.txt
        
    CONTRACT_ID=$(cat contract_id.txt)
    echo "Deployed Registry Contract ID: $CONTRACT_ID"
fi

cd ..

# 3. Setup Frontend Environment
echo "Configuring Frontend Environment..."
cat > web/.env.local << EOF
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_REGISTRY_CONTRACT_ID=$CONTRACT_ID
EOF

# 4. Build Frontend
echo "Building Next.js application..."
cd web
npm install
npm run build

echo "Deployment preparation complete! 🚀"
echo "To serve the frontend locally, run: cd web && npm run start"
