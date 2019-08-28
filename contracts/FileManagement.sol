pragma solidity ^0.5.11;

// import "./@openzeppelin/contracts/math/SafeMath.sol";
// using SafeMath for uint;

contract FileManagement {

    mapping (address => uint[]) usersToFiles;
    mapping (uint => File) fileDirectory;
    enum Permissions {Owner, Write, Read}
    mapping (address => Permissions) filePermissions;
    string[] history;
    address[] users;
    
    struct File {
        uint fileHash;
        uint version;
        string location;
        address[] users;
        string[] history;
        mapping (address=>Permissions) permissions;
    }
    
    event NewFile(address indexed _owner, uint indexed _fileHash);
    event ReadPermissionGranted(address indexed _user, uint indexed _fileHash);
    event WritePermissionGranted(address indexed _user, uint indexed _fileHash);
    event OwnerPermissionGranted(address indexed _user, uint indexed _fileHash);
    event FileUpdated(address indexed _user, uint indexed _fileHash, uint new_fileHash);

    modifier isOwner(uint _fileHash){
        require(fileDirectory[_fileHash].permissions[msg.sender] == Permissions.Owner);
        _;
    }
    modifier isWriter(uint _fileHash){
        require(fileDirectory[_fileHash].permissions[msg.sender] == Permissions.Write ||
            fileDirectory[_fileHash].permissions[msg.sender] == Permissions.Owner
        );
        _;
    }
    modifier isReader(uint _fileHash){
        
        require(fileDirectory[_fileHash].permissions[msg.sender] == Permissions.Read || 
            fileDirectory[_fileHash].permissions[msg.sender] == Permissions.Write ||
            fileDirectory[_fileHash].permissions[msg.sender] == Permissions.Owner
        );
        _;
    }

    function newFile(uint _fileHash, string calldata location) external {
        //initialize the filePermissions mapping
        mapping(address => Permissions) storage _filePermissions = filePermissions;
        _filePermissions[msg.sender] = Permissions.Owner;
        //initialize history array
        string[] storage _history = history;
        //initialize users array and add in owner
        address[] storage _users = users;
        users.push(msg.sender);

        File memory file = File(_fileHash, 0, location, users, history);
        fileDirectory[_fileHash] = file;
        usersToFiles[msg.sender].push(_fileHash);
        
        emit NewFile(msg.sender, _fileHash);
    }

    //
    function setReadPermissions(uint _fileHash, address[] calldata _users, uint duration) external isOwner(_fileHash) {
        for (uint i = 0; i < _users.length; i++){
            fileDirectory[_fileHash].permissions[_users[i]] = Permissions.Read;
            emit ReadPermissionGranted(_users[i], _fileHash);
        }
    }

    function setWritePermissions(uint _fileHash, address[] calldata  _users, uint duration) external isOwner(_fileHash){
        for (uint i = 0; i < _users.length; i++){
            fileDirectory[_fileHash].permissions[_users[i]] = Permissions.Write;
            emit WritePermissionGranted(_users[i], _fileHash);
        }
    }

    function setOwnerPermissions(uint _fileHash, address[] calldata _users, uint duration) external isOwner(_fileHash){
        for (uint i = 0; i < _users.length; i++){
            fileDirectory[_fileHash].permissions[_users[i]] = Permissions.Owner;
            emit OwnerPermissionGranted(_users[i], _fileHash);
        }
    }

    function updateFile(uint _fileHash, uint new_fileHash, string calldata new_location) external isWriter(_fileHash) {
        fileDirectory[_fileHash].version++;
        fileDirectory[_fileHash].history.push(fileDirectory[_fileHash].location);
        fileDirectory[_fileHash].location = new_location;
        fileDirectory[_fileHash].fileHash = new_fileHash;
        fileDirectory[new_fileHash] = fileDirectory[_fileHash];

        for (uint i = 0; i < fileDirectory[_fileHash].users.length; i++){
            for (uint j = 0; j < usersToFiles[fileDirectory[_fileHash].users[i]].length; j++){
                if (usersToFiles[fileDirectory[_fileHash].users[j]] == _fileHash){
                    usersToFiles[fileDirectory[_fileHash].users[j]] = new_fileHash;
                    emit FileUpdated(usersToFiles[fileDirectory[_fileHash].users[j]], _fileHash, new_fileHash);
                    break;
                }
            }
            
        }

        delete fileDirectory[_fileHash];
    }

    function viewUsersOfFile(uint _fileHash) external pure isReader(_fileHash) returns(address[] memory){
        return fileDirectory[_fileHash].users;
    }

    function viewFilePermissionsForUser(uint _fileHash, address _user) external pure isReader(_fileHash) returns (Permissions){
        return fileDirectory[_fileHash].permissions[_user];
    }

    function verifyDocument(uint _fileHash) external isReader(_fileHash){

    }
}