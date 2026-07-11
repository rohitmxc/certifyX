<div align="center">
  
# 🛡️ CertifyX

**A decentralized, enterprise-grade credential issuance and verification platform built on the Stellar network using Soroban.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Network-Stellar_Testnet-black)](https://stellar.org/)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange)](https://soroban.stellar.org/)

> 🚀 **Live Production Deployment:** [https://certify-x-web.vercel.app/](https://certify-x-web.vercel.app/)
> 🎥 **Video Walkthrough:** [https://youtu.be/LSe_GoF8Kcg](https://youtu.be/LSe_GoF8Kcg)

![Hero Dashboard](./demo/img/hero.png)

*Issue tamper-proof digital certificates in seconds. Your students and users own them forever, verified instantly on the Stellar blockchain with no monthly fees.*

</div>

---

## 📖 Product Overview & Problem Statement

### The Problem
Educational institutions, DAOs, bootcamps, and companies face a massive problem with credential fraud. Traditional PDF certificates are easily forged, and manual verification is slow, costly, and requires trusting centralized databases that can be hacked, go offline, or charge exorbitant subscription fees to maintain records.

### The Solution: CertifyX
CertifyX is a decentralized credential registry built on Stellar Soroban:
- **Instant Issuance**: Issue single or batch credentials using our drag-and-drop template builder.
- **Cryptographic Proof**: Every certificate is mathematically anchored to the Stellar blockchain. The hash is immutable.
- **Zero Storage Costs**: By anchoring data hashes on-chain rather than storing massive files, we keep issuance fees negligible.
- **Instant Verification**: Anyone can scan a QR code or upload a certificate file to instantly verify its authenticity directly against the Soroban smart contract.
- **Live Activity Feed**: Global real-time events track when credentials are issued or revoked on the network.

---

## 🏗️ Architecture & Smart Contract Design

### High-Level System Architecture

```mermaid
graph TD
    User([Issuer / Verifier]) -->|Interacts| UI[Next.js Frontend]
    UI -->|Connects Wallet| SWK[StellarWalletsKit]
    UI -->|Reads/Submits Txs| RPC[Soroban RPC]
    
    subgraph Stellar Network [Stellar Testnet]
        RPC -->|Invokes| ContractA[Credential Issuer Contract]
        ContractA -->|Cross-Contract Call| ContractB[Global Registry Contract]
    end
    
    UI -.->|Queries DB for Templates/Drafts| DB[(Prisma / Postgres)]
```

### Smart Contract Execution Sequence

CertifyX utilizes two distinct Soroban smart contracts to enforce separation of concerns and robust security:

1. **Credential Issuer Contract**: Handles the business logic of validating an issuer's permissions, formatting the credential payload, and organizing batch issuances.
2. **Global Registry Contract**: A highly secure, append-only ledger that stores the immutable cryptographic hashes of the credentials. 

**Inter-Contract Communication Flow:**
```mermaid
sequenceDiagram
    participant UI as Next.js Frontend
    participant Issuer as Credential Issuer Contract
    participant Registry as Global Registry Contract
    
    UI->>Issuer: issue_credential(hash, metadata)
    activate Issuer
    Issuer->>Issuer: Verify Admin / RBAC Signature
    Issuer->>Registry: anchor_hash(hash, issuer_address)
    activate Registry
    Registry-->>Issuer: success (bool)
    deactivate Registry
    Issuer->>Issuer: Emit `CREDENTIAL_ISSUED` Event
    Issuer-->>UI: Transaction Confirmed
    deactivate Issuer
```

---

## 🚀 Features & Tech Stack

**Frontend Layer**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom monochromatic cyberpunk aesthetic
- **State Management**: Zustand (Global Store) + React Query (Server State)
- **Components**: shadcn/ui + Lucide Icons + Framer Motion
- **Wallet Integration**: StellarWalletsKit (Freighter support, network switching)

**Blockchain & Backend Layer**
- **Smart Contracts**: Rust (Soroban SDK)
- **Network**: Stellar Testnet
- **Database**: Prisma + PostgreSQL (for off-chain template drafts)
- **Events**: Real-time Soroban Event streaming and XDR decoding

---

## 📁 Project Directory Structure

```text
certifyx-workspace/
├── contracts/                  # Soroban Smart Contracts Workspace
│   ├── contracts/
│   │   ├── certifier/          # Contract 1: Credential Issuer (RBAC & Logic)
│   │   └── registry/           # Contract 2: Global Registry (Immutable Ledger)
│   ├── Cargo.toml              # Rust Workspace configuration
│   └── Makefile                # Build scripts for compiling WASM
├── web/                        # Next.js Frontend & Backend Application
│   ├── prisma/                 # PostgreSQL Database Schema
│   ├── src/
│   │   ├── app/                # Next.js App Router (Pages & API Routes)
│   │   ├── components/         # Reusable UI & PDF Generation components
│   │   ├── lib/                # Shared utilities (Prisma singleton)
│   │   ├── service/            # Soroban & Stellar SDK interaction logic
│   │   └── store/              # Zustand global state (Wallet & Settings)
│   ├── package.json            # NPM Dependencies
│   └── tailwind.config.ts      # Tailwind CSS Theme
└── README.md                   # Project Documentation
```

---

## 📸 Platform Previews

### 🌟 Landing Page
*A sleek, professional landing page with a dynamic, hacker-style scrolling marquee that fetches live on-chain issuance hashes.*
<div align="center">
  <img src="demo/img/hero.png" alt="Hero Dashboard" width="800"/>
</div>

### 📜 Dashboard & Issuance
*An intuitive dashboard for issuing credentials. Connect your Freighter wallet to sign and submit directly to the Stellar network.*
<div align="center">
  <img src="demo/img/dashboard-issue.png" alt="Issue Credentials Dashboard" width="800"/>
</div>

### 🎨 Custom Template Builder
*A visual drag-and-drop builder to design beautiful certificates that match your brand.*
<div align="center">
  <img src="demo/img/template-builder.png" alt="Template Builder" width="800"/>
</div>

### ⚡ Success & Live Activity Feed
*Upon successful issuance, view the transaction confirmation. The global activity feed polls the Soroban RPC to display real-time network events.*
<div align="center">
  <img src="demo/img/issued-successfully-with-feed.png" alt="Success and Activity Feed" width="800"/>
</div>

### 📱 Fully Mobile Responsive
*The entire application, including complex dashboards and tables, is optimized for seamless mobile usage.*
<div align="center">
  <img src="demo/img/mobile-1.png" alt="Mobile View 1" width="300"/>
  <img src="demo/img/mobile-2.png" alt="Mobile View 2" width="300"/>
</div>

### 🔍 Stellar Network Verification
*All issuances are verifiable on the Stellar Expert Explorer, proving cryptographic immutability.*
<div align="center">
  <img src="demo/verification-on-stellar.png" alt="Network Verification" width="800"/>
</div>

### 🎓 Generated Cryptographic Certificate
*A beautiful, tamper-proof PDF certificate is generated for every candidate, complete with a QR code linking directly to the on-chain Soroban registry.*
<div align="center">
  <img src="demo/img/genrated-certificate.png" alt="Generated Certificate" width="800"/>
</div>

### 🧪 Automated Testing Suite
*Comprehensive frontend testing using Vitest ensures platform stability. The test suite strictly verifies core components including the WalletConnect provider and Certificate Builder logic.*
<div align="center">
  <img src="demo/img/passing-test.png" alt="Passing Test Suite" width="800"/>
</div>

---

## 🛡️ Contract Addresses & Verifiable Links

*   **Verifiable Live App**: [https://certify-x-web.vercel.app/](https://certify-x-web.vercel.app/)
*   **Credential Issuer Contract**: [`CA5NV5YW6U46IT55YWRS6ZBZWIADN2FZ5YPRQKP6QU3EDX65QAWX3NXA`](https://stellar.expert/explorer/testnet/contract/CA5NV5YW6U46IT55YWRS6ZBZWIADN2FZ5YPRQKP6QU3EDX65QAWX3NXA)
*   **Global Registry Contract**: [`CC2ECUCK5QZ76BKXIJUX5QUPRQ2ICAA44KJB5TXISCQRMZX34IHHOJSZ`](https://stellar.expert/explorer/testnet/contract/CC2ECUCK5QZ76BKXIJUX5QUPRQ2ICAA44KJB5TXISCQRMZX34IHHOJSZ)
*   **Network**: Stellar Testnet
*   **Example Transaction Hash**: `d6b89e6104d1624d8dcf426cc6ca172b7d66ade9f6b6673638c44137432542e2`
*   **Stellar Explorer Link**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/d6b89e6104d1624d8dcf426cc6ca172b7d66ade9f6b6673638c44137432542e2)

---

## 💻 Local Development & Setup

### Prerequisites
- Node.js (v18+)
- Rust & Cargo
- Stellar CLI (`stellar-cli`)
- Freighter Wallet browser extension

### Environment Variables
Create a `.env` file in the `web` directory:
```env
NEXT_PUBLIC_SOROBAN_RPC_URL="https://soroban-testnet.stellar.org"
NEXT_PUBLIC_SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_REGISTRY_CONTRACT_ID="[DEPLOYED_CONTRACT_ID]"
DATABASE_URL="postgresql://user:pass@localhost:5432/certifyx"
```

### Running the Frontend
```bash
cd web
npm install
npm run dev
```

### Running Tests
```bash
# Frontend Tests (Vitest + RTL)
npm run test

# Smart Contract Tests
cd contracts
cargo test
```

---

## 🚀 CI/CD & Deployment Steps

### GitHub Actions (CI/CD)
The repository includes automated CI/CD workflows (`.github/workflows/main.yml`) that trigger on PRs and merges to `main`. It automatically:
1. Compiles and tests the Rust Soroban contracts.
2. Runs frontend linting and unit tests.
3. Builds the Next.js production bundle to ensure zero build errors.

<div align="center">
  <img src="demo/ci-cd.png" alt="CI/CD Pipeline" width="800"/>
</div>

### Deploying Contracts to Testnet
Use the provided Stellar CLI commands to deploy to Testnet:

1. **Build the Contracts**
   ```bash
   cd contracts
   stellar contract build
   ```
2. **Deploy Registry Contract**
   ```bash
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/registry.wasm --source YOUR_IDENTITY --network testnet
   ```
3. **Deploy Issuer Contract**
   ```bash
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/issuer.wasm --source YOUR_IDENTITY --network testnet
   ```
4. **Initialize Inter-Contract Links**
   ```bash
   stellar contract invoke --id [ISSUER_ID] --source YOUR_IDENTITY --network testnet -- init --registry [REGISTRY_ID] --admin [YOUR_ADDRESS]
   ```

---

## 🔒 Security Considerations

- **Role-Based Access Control (RBAC)**: Only authorized admin addresses configured during contract initialization can invoke the `issue_credential` function.
- **Immutability Constraints**: The Global Registry contract only exposes append-only methods. There is no `delete` function for hashes, ensuring permanent cryptographic proof.
- **Frontend Validation**: The Next.js client strictly validates payload schemas using Zod before allowing the user to sign the transaction.
- **Replay Protection**: Handled natively by Stellar's sequence numbers.
- **Wallet Security**: Uses `StellarWalletsKit` to ensure private keys never touch the DOM or React state. All signing is delegated entirely to the secure Freighter extension.
