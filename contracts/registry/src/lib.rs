#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Issuer(Address),
    Credential(String), // credential_id
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Issuer {
    pub name: String,
    pub is_active: bool,
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
    /// Any organization can securely register themselves as an Issuer.
    pub fn register_issuer(env: Env, issuer: Address, name: String) {
        issuer.require_auth();

        let key = DataKey::Issuer(issuer.clone());
        let issuer_data = Issuer {
            name,
            is_active: true,
        };
        env.storage().persistent().set(&key, &issuer_data);
    }

    pub fn get_issuer(env: Env, issuer: Address) -> Option<Issuer> {
        let key = DataKey::Issuer(issuer);
        env.storage().persistent().get(&key)
    }

    /// An authorized Issuer securely issues a credential.
    pub fn issue_credential(
        env: Env,
        issuer: Address,
        credential_id: String,
        data_hash: String,
        issue_date: u64,
    ) {
        // The issuer must authorize this transaction cryptographically
        issuer.require_auth();

        // Ensure issuer exists and is active
        let issuer_key = DataKey::Issuer(issuer.clone());
        let issuer_data: Option<Issuer> = env.storage().persistent().get(&issuer_key);
        if issuer_data.is_none() || !issuer_data.unwrap().is_active {
            panic!("Invalid or inactive issuer");
        }

        let cred_key = DataKey::Credential(credential_id.clone());
        
        // Prevent overwriting existing credentials
        if env.storage().persistent().has(&cred_key) {
            panic!("Credential already exists");
        }

        let credential = Credential {
            issuer,
            data_hash,
            issue_date,
            is_revoked: false,
        };

        env.storage().persistent().set(&cred_key, &credential);
    }

    /// An authorized Issuer securely revokes a credential they issued.
    pub fn revoke_credential(env: Env, issuer: Address, credential_id: String) {
        issuer.require_auth();

        let cred_key = DataKey::Credential(credential_id.clone());
        if !env.storage().persistent().has(&cred_key) {
            panic!("Credential not found");
        }
        let mut credential: Credential = env.storage().persistent().get(&cred_key).unwrap();
        
        // Only the original issuer can revoke it
        if credential.issuer != issuer {
            panic!("Only the original issuer can revoke this credential");
        }
        
        credential.is_revoked = true;
        env.storage().persistent().set(&cred_key, &credential);
    }

    pub fn verify_credential(env: Env, credential_id: String) -> Option<Credential> {
        let key = DataKey::Credential(credential_id);
        env.storage().persistent().get(&key)
    }
}

mod test;
