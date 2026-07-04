#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_certifier_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CertifierContract);
    let client = CertifierContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);

    client.init(&admin);

    assert_eq!(client.is_issuer(&issuer), false);

    client.add_issuer(&issuer);
    assert_eq!(client.is_issuer(&issuer), true);

    client.remove_issuer(&issuer);
    assert_eq!(client.is_issuer(&issuer), false);
}
