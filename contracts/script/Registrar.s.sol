// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {IL2Registry} from "@namestone/durin/interfaces/IL2Registry.sol";
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

/* If need to verify separately:

forge verify-contract \
    0x4D56236B70fF29Fa2395C8BCC6F812f9CB46a71a \
    contracts/src/Registrar.sol:Registrar \
    --guess-constructor-args \
    --etherscan-api-key "$ETHERSCAN_API_KEY" \
    --rpc-url "${RPC_URL}"
 */
contract RegistrarScript is Script {
    Registrar public registrar;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        registrar = new Registrar(
            IL2Registry(vm.envAddress("L2_REGISTRY_ADDRESS")), // Durin L2Registry for worldfair.eth
            vm.envAddress("OWNER_ADDRESS") // Relayer
        );

        vm.stopBroadcast();
    }
}
