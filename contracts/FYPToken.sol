pragma solidity ^0.5.3;
import "./ERC1155Mintable.sol";

contract FYP1155 is ERC1155Mintable{

    // Read Permission is rightmost bit, left of it is Write and left of that is Owner
    mapping (uint256 => mapping(address => uint8)) accessControlList;

    //create function

    //mint function with ACL

    //ACL modifiers
    
    //ACL edit


    //IGNORE PRIVACY IMPLEMENTATION FIRST
    // OPTIONS:
    // 1. have another smart contract that can receive the token and decrypt the IPFS content(?)
    // 2. Encrypt the IPFS content with a symmetric key and then send it to each of the stakeholders in a message encrypted with their public key
}