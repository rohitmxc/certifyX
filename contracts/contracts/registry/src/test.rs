#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{testutils::{Address as _, Events}, Address, Env, String};

// Mock certifier contract for tests
#[contract]
pub struct MockCertifier;
#[contractimpl]
impl MockCertifier {
    pub fn is_issuer(_env: Env, _issuer: Address) -> bool {
        true
    }
}

#[test]
fn test_registry_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let certifier_id = env.register_contract(None, MockCertifier);
    let contract_id = env.register_contract(None, CredentialRegistry);
    let client = CredentialRegistryClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);

    client.init(&admin, &certifier_id);

    let cred_id = String::from_str(&env, "CRD-001");
    let data_hash = String::from_str(&env, "abc123hash");
    let issue_date = 1670000000;

    client.issue_credential(&issuer, &cred_id, &data_hash, &issue_date);

    let credential = client.verify_credential(&cred_id).unwrap();
    assert_eq!(credential.issuer, issuer);
    assert_eq!(credential.data_hash, data_hash);
    assert_eq!(credential.issue_date, issue_date);
    assert_eq!(credential.is_revoked, false);

    // Verify events
    let events = env.events().all();

    client.revoke_credential(&issuer, &cred_id);
    let revoked = client.verify_credential(&cred_id).unwrap();
    assert_eq!(revoked.is_revoked, true);
}
