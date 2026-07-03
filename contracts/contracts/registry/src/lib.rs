#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, BytesN};

mod certifier_contract {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32v1-none/release/certifier.wasm"
    );
}

#[contracttype]
pub enum DataKey {
    Admin,
    CertifierContract,
    Credential(String),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Credential {
    pub issuer: Address,
    pub data_hash: String,
    pub issue_date: u64,
    pub is_revoked: bool,
}

#[contract]
pub struct CredentialRegistry;

#[contractimpl]
impl CredentialRegistry {
    /// Initialize the contract with an admin and the certifier contract ID.
    pub fn init(env: Env, admin: Address, certifier_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::CertifierContract, &certifier_contract);
    }

    /// Issue a new credential. The caller must be an authorized issuer in the certifier contract.
    pub fn issue_credential(
        env: Env,
        caller: Address,
        credential_id: String,
        data_hash: String,
        issue_date: u64,
    ) {
        caller.require_auth();

        // 1. Inter-contract communication: verify caller is an authorized issuer
        let certifier_id: Address = env.storage().instance().get(&DataKey::CertifierContract).expect("Not initialized");
        let certifier_client = certifier_contract::Client::new(&env, &certifier_id);
        
        let is_authorized = certifier_client.is_issuer(&caller);
        if !is_authorized {
            panic!("Caller is not an authorized issuer");
        }

        let cred_key = DataKey::Credential(credential_id.clone());
        
        // 2. State transition / validation: prevent overwriting
        if env.storage().persistent().has(&cred_key) {
            panic!("Credential already exists");
        }

        let credential = Credential {
            issuer: caller.clone(),
            data_hash: data_hash.clone(),
            issue_date,
            is_revoked: false,
        };

        // 3. Custom storage: persistent state
        env.storage().persistent().set(&cred_key, &credential);

        // 4. Real-time events: emit an event for the frontend to subscribe to
        env.events().publish(
            (symbol_short!("issued"), credential_id.clone()),
            (caller, data_hash, issue_date),
        );
    }

    /// Revoke a credential. Only the original issuer can revoke it.
    pub fn revoke_credential(env: Env, caller: Address, credential_id: String) {
        caller.require_auth();
        
        let cred_key = DataKey::Credential(credential_id.clone());
        let mut credential: Credential = env.storage().persistent().get(&cred_key).expect("Credential not found");
        
        if credential.issuer != caller {
            panic!("Only the original issuer can revoke");
        }
        
        credential.is_revoked = true;
        env.storage().persistent().set(&cred_key, &credential);
        
        // Event emission for revocation
        env.events().publish(
            (symbol_short!("revoked"), credential_id),
            caller,
        );
    }

    /// Read a credential
    pub fn verify_credential(env: Env, credential_id: String) -> Option<Credential> {
        let key = DataKey::Credential(credential_id);
        env.storage().persistent().get(&key)
    }

    /// Upgrade the contract. Only the admin can do this.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}

mod test;
