pragma solidity ^0.5.3;
import "./ERC1155.sol";
import {Bits} from  "./Util/Bits.sol";

/* 
A Token is created for every SKU. The supply can be equals to the production/order amount. Every time a shipment is sent out, mint a new token. 
This contract is an edited duplicate of ERC1155Mintable.sol
*/
contract SKUToken is ERC1155 {

    bytes4 constant private INTERFACE_SIGNATURE_URI = 0x0e89341c;

    uint256 public nonce;

    using Bits for uint8;

    event PermissionSet(uint256 _id, address _stakeholders, uint8 _permissions);

    //8 - 1000
    modifier creatorOnly (uint256 _id) {
        require(accessControlList[_id][msg.sender].highestBitSet() >= 3);
        _;
    }

    //4 - 100
    modifier ownerOnly (uint256 _id) {
        require(accessControlList[_id][msg.sender].highestBitSet() >= 2);
        _;
    }

    //2 - 10
    modifier writeOnly (uint256 _id) {
        require(accessControlList[_id][msg.sender].highestBitSet() >= 1);
        _;
    }

    //1 - 1
    modifier readOnly (uint256 _id) {
        require(accessControlList[_id][msg.sender].highestBitSet() >= 0);
        _;
    }

    // Read Permission is rightmost bit, left of it is Write and left of that is Owner
    mapping (uint256 => mapping(address => uint8)) accessControlList;

    function supportsInterface(bytes4 _interfaceId)
    public
    view
    returns (bool) {
        if (_interfaceId == INTERFACE_SIGNATURE_URI) {
            return true;
        } else {
            return super.supportsInterface(_interfaceId);
        }
    }

    function getAccessLevelOfUser(uint256 _id) external view returns (uint8){
        uint8 permission = accessControlList[_id][msg.sender];
        if( permission == 0){
            return 0;
        } else {
            return accessControlList[_id][msg.sender];
        }
        
    }

    // Creates a new token type and assigns _initialSupply to minter
    function create(uint256 _initialSupply, string calldata _uri) external returns(uint256 _id) {

        _id = ++nonce;
        accessControlList[_id][msg.sender] = uint8(8);
        balances[_id][msg.sender] = _initialSupply;

        // Transfer event with mint semantic
        emit TransferSingle(msg.sender, address(0x0), msg.sender, _id, _initialSupply);

        if (bytes(_uri).length > 0)
            emit URI(_uri, _id);
    }

    // Batch mint tokens. Assign directly to _to[].
    function mint(uint256 _id, address[] calldata _to, uint256[] calldata _quantities) external creatorOnly(_id) {

        for (uint256 i = 0; i < _to.length; ++i) {

            address to = _to[i];
            uint256 quantity = _quantities[i];

            // Grant the items to the caller
            balances[_id][to] = quantity.add(balances[_id][to]);

            // Emit the Transfer/Mint event.
            // the 0x0 source address implies a mint
            // It will also provide the circulating supply info.
            emit TransferSingle(msg.sender, address(0x0), to, _id, quantity);

            if (to.isContract()) {
                _doSafeTransferAcceptanceCheck(msg.sender, msg.sender, to, _id, quantity, '');
            }
        }
    }

    function setURI(string calldata _uri, uint256 _id) external writeOnly(_id) {
        emit URI(_uri, _id);
    }

    //refactor into individual permissions for each level
    function setPermissions(uint8 _id, address[] calldata _stakeholders, uint8[] calldata _permissions) external ownerOnly(_id) {
        require(_stakeholders.length == _permissions.length);
        for (uint i = 0; i < _stakeholders.length; i++){
            accessControlList[_id][_stakeholders[i]] = _permissions[i];
            emit PermissionSet(_id, _stakeholders[i], _permissions[i]);
        }
    } 
}