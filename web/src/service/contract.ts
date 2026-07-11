import { Horizon, Keypair, TransactionBuilder, Networks, Contract, xdr, rpc, Address, nativeToScVal } from '@stellar/stellar-sdk';
import { useWalletStore } from '@/store/wallet';

const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
const networkPassphrase = Networks.TESTNET;
const server = new rpc.Server(rpcUrl);
const horizon = new Horizon.Server('https://horizon-testnet.stellar.org');

const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID || '';

export async function buildIssueCredentialTx(
  credentialId: string, 
  dataHash: string, 
  issueDate: number
) {
  const { address } = useWalletStore.getState();
  if (!address) throw new Error("Wallet not connected");

  // Load account
  const account = await horizon.loadAccount(address);

  const contract = new Contract(REGISTRY_ID);

  // issue_credential(caller: Address, credential_id: String, data_hash: String, issue_date: u64)
  const args = [
    new Address(address).toScVal(),
    nativeToScVal(credentialId, { type: 'string' }),
    nativeToScVal(dataHash, { type: 'string' }),
    nativeToScVal(issueDate, { type: 'u64' })
  ];

  const tx = new TransactionBuilder(account, { fee: "100000", networkPassphrase })
    .addOperation(contract.call("issue_credential", ...args))
    .setTimeout(300)
    .build();

  // Prepare the transaction using Soroban RPC (simulates and adds footprint/resources)
  const preparedTx = await server.prepareTransaction(tx);
  
  // Sign the transaction via Freighter API directly (since it's the only supported module)
  const { signTransaction } = await import("@stellar/freighter-api");
  const response = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase,
    address
  });
  if (response.error) throw new Error(response.error as string);
  return response.signedTxXdr;
}

/**
 * Submits the signed transaction to the Soroban RPC
 */
export async function submitContractTx(signedTxXdr: string) {
  const parsedTx = TransactionBuilder.fromXDR(signedTxXdr, networkPassphrase) as any;
  const sendResponse = await server.sendTransaction(parsedTx);
  if (sendResponse.status === 'ERROR') {
    throw new Error(`Transaction failed: ${(sendResponse as any).errorResult?.toXDR("base64") || JSON.stringify(sendResponse)}`);
  }

  // Poll for confirmation
  return await pollTransaction(sendResponse.hash);
}

async function pollTransaction(hash: string): Promise<rpc.Api.GetTransactionResponse> {
  const maxAttempts = 20;
  for (let i = 0; i < maxAttempts; i++) {
    const txResponse = await server.getTransaction(hash);
    if (txResponse.status !== 'NOT_FOUND') {
      if (txResponse.status === 'FAILED') {
        throw new Error("Transaction failed on chain");
      }
      return txResponse; // SUCCESS
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  throw new Error("Transaction polling timed out");
}
