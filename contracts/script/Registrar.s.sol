// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Registrar} from "../src/Registrar.sol";

contract RegistrarScript is Script {
    Registrar public registrar;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        registrar = new Registrar(
            vm.envAddress("REGISTRY_ADDRESS"),
            vm.envAddress("OWNER_ADDRESS")
        );

        vm.stopBroadcast();
    }
}
