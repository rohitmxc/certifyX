#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, BytesN};

#[contracttype]
pub enum DataKey {
    Admin,
    Issuer(Address),
}

#[contract]
pub struct CertifierContract;

#[contractimpl]
impl CertifierContract {
    /// Initialize the contract with an admin.
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Add a new authorized issuer. Only the admin can do this.
    pub fn add_issuer(env: Env, issuer: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Issuer(issuer), &true);
    }

    /// Remove an authorized issuer. Only the admin can do this.
    pub fn remove_issuer(env: Env, issuer: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();
        env.storage().persistent().remove(&DataKey::Issuer(issuer));
    }

    /// Check if an address is an authorized issuer.
    pub fn is_issuer(env: Env, issuer: Address) -> bool {
        env.storage().persistent().has(&DataKey::Issuer(issuer))
    }

    /// Upgrade the contract. Only the admin can do this.
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}

mod test;
