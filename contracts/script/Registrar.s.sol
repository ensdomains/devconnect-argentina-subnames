// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Registrar} from "../src/Registrar.sol";

/* 
source .env

forge create \
    --rpc-url "${RPC_URL}" \
    --verify \
    --etherscan-api-key "$ETHERSCAN_API_KEY" \
    --interactive \
    --broadcast \
    contracts/src/Registrar.sol:Registrar \
    --constructor-args "${L2_REGISTRY_ADDRESS}" "${OWNER_ADDRESS}"
 */
contract RegistrarScript is Script {
    Registrar public registrar;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        registrar = new Registrar(
            vm.envAddress("L2_REGISTRY_ADDRESS"), // Durin L2Registry for worldsfair.eth on Base Sepolia
            vm.envAddress("OWNER_ADDRESS") // New account to sponsor transactions
        );

        vm.stopBroadcast();
    }
}
