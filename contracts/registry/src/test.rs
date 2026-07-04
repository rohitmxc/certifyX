#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_register_and_issue() {
    let env = Env::default();
    env.mock_all_auths(); // Mock authorization for the tests

    let contract_id = env.register_contract(None, CredentialRegistry);
    let client = CredentialRegistryClient::new(&env, &contract_id);

    let issuer = Address::generate(&env);
    let issuer_name = String::from_str(&env, "Stellar Community");

    // 1. Register Issuer (Self-registration)
    client.register_issuer(&issuer, &issuer_name);
    
    let fetched_issuer = client.get_issuer(&issuer).unwrap();
    assert_eq!(fetched_issuer.name, issuer_name);
    assert_eq!(fetched_issuer.is_active, true);

    // 3. Issue Credential
    let cred_id = String::from_str(&env, "cert-001");
    let data_hash = String::from_str(&env, "abc123hash");
    let issue_date = 1689000000;

    client.issue_credential(&issuer, &cred_id, &data_hash, &issue_date);

    // 4. Verify Credential
    let fetched_cred = client.verify_credential(&cred_id).unwrap();
    assert_eq!(fetched_cred.issuer, issuer);
    assert_eq!(fetched_cred.data_hash, data_hash);
    assert_eq!(fetched_cred.issue_date, issue_date);
    assert_eq!(fetched_cred.is_revoked, false);

    // 5. Revoke Credential
    client.revoke_credential(&issuer, &cred_id);
    let revoked_cred = client.verify_credential(&cred_id).unwrap();
    assert_eq!(revoked_cred.is_revoked, true);
}
