// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IL2Registry} from "@namestone/durin/interfaces/IL2Registry.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @dev Simple registrar contract that allows a trusted server to register ENS subnames.
///      Once a name is registered, it is fully self-custodial.
contract Registrar is Ownable {
    error NullifierAlreadyUsed(uint256 nullifier);
    error NotAvailable(bytes32 labelHash);

    /// @notice Emitted when a new name is registered
    /// @param label The registered label (e.g. "name" in "name.eth")
    /// @param owner The owner of the newly registered name
    event NameRegistered(string indexed label, address indexed owner);

    /// @notice Target registry contract
    IL2Registry public immutable REGISTRY;

    /// @notice Node of the parent name
    /// @dev namehash of `REGISTRY.name()`
    bytes32 private immutable BASE_NODE;

    /// @notice Zupass nullifiers and the label they were used to register (1 per ticket)
    mapping(uint256 => string) public nullifiers;

    /// @param _registry Address of the L2Registry contract
    /// @param _owner Relayer address that can register names
    constructor(IL2Registry _registry, address _owner) Ownable(_owner) {
        REGISTRY = _registry;
        BASE_NODE = _registry.baseNode();
    }

    /// @notice Registers a new name
    /// @param label The label to register (e.g. "sub" for "sub.name.eth")
    /// @param owner The address that will own the name
    /// @param data Multicall data to pass to the resolver
    /// @param nullifier The Zupass nullifier
    function register(string calldata label, address owner, bytes[] calldata data, uint256 nullifier)
        external
        onlyOwner
    {
        if (bytes(nullifiers[nullifier]).length > 0) {
            revert NullifierAlreadyUsed(nullifier);
        }

        if (!available(label)) {
            revert NotAvailable(keccak256(bytes(label)));
        }

        nullifiers[nullifier] = label;
        REGISTRY.createSubnode(BASE_NODE, label, owner, data);
        emit NameRegistered(label, owner);
    }

    /// @notice Checks if a given label is available for registration
    /// @param label The label to check availability for
    function available(string calldata label) public view returns (bool) {
        uint256 len = bytes(label).length;
        if (len < 3) return false;

        bytes32 node = REGISTRY.makeNode(BASE_NODE, label);
        return REGISTRY.owner(node) == address(0);
    }
}
