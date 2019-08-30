pragma solidity ^0.5.1;

// import "./@openzeppelin/contracts/math/SafeMath.sol";
// using SafeMath for uint;

contract FileManagement {

    mapping (address => uint[]) usersToFiles;
    mapping (uint => File) fileDirectory;
    enum Permissions {Owner, Write, Read}
    struct Permission {
        Permissions permission;
        uint expiryTime; //0 means permission persists infinitely
    }
    
    mapping (address => Permission) filePermissions;
    address[] updaterHistory;
    address[] users;
    string[] locationHistory;
    
    struct File {
        uint fileHash;
        uint currentVersion;
        address[] users;
        address[] updaterHistory;
        string[] locationHistory;
        mapping (address=>Permission) permissions;
        mapping (address=>uint) permissionsExpiry;
    }
    
    File file;
    
    event NewFile(address indexed _owner, uint indexed _fileHash);
    event ReadPermissionGranted(address indexed _user, uint indexed _fileHash, uint expiryTime);
    event WritePermissionGranted(address indexed _user, uint indexed _fileHash, uint expiryTime);
    event OwnerPermissionGranted(address indexed _user, uint indexed _fileHash, uint expiryTime);
    event FileUpdated(address indexed _user, uint indexed _fileHash, uint new_fileHash);

    modifier isOwner(uint _fileHash){
        Permission memory _permission = fileDirectory[_fileHash].permissions[msg.sender];
        require(_permission.permission == Permissions.Owner);
        require(_permission.expiryTime == 0 || _permission.expiryTime - now > 0);
        _;
    }
    modifier isWriter(uint _fileHash){
        Permission memory _permission = fileDirectory[_fileHash].permissions[msg.sender];
        require(_permission.permission == Permissions.Write ||
            _permission.permission == Permissions.Owner
        );
        require(_permission.expiryTime == 0 || _permission.expiryTime - now > 0);
        _;
    }
    modifier isReader(uint _fileHash){
       Permission memory _permission = fileDirectory[_fileHash].permissions[msg.sender];
        require( _permission.permission == Permissions.Read ||
            _permission.permission == Permissions.Write ||
            _permission.permission == Permissions.Owner
           
        );
        require(_permission.expiryTime == 0 || _permission.expiryTime - now > 0);
        _;
    }

    function newFile(uint _fileHash, string calldata _location) external {
        //initialize the filePermissions mapping
        mapping(address => Permission) storage _filePermissions = filePermissions;
        _filePermissions[msg.sender].permission = Permissions.Owner;
        _filePermissions[msg.sender].expiryTime = 0;
        
        //initialize updaterHistory, locationHistory and users array
        address[] storage _updaterHistory = updaterHistory;
        _updaterHistory.push(msg.sender);
        string[] storage _locationHistory = locationHistory;
        _locationHistory.push(_location);
        address[] storage _users = users;
        users.push(msg.sender);
        
        // created in memory
        file = File(_fileHash,0, _users,_updaterHistory, _locationHistory);
        file.permissions[msg.sender] = Permission(Permissions.Owner, 0);
        fileDirectory[_fileHash] = file;
        usersToFiles[msg.sender].push(_fileHash);
        
        emit NewFile(msg.sender, _fileHash);
    }

    //
    function setReadPermissions(uint _fileHash, address[] calldata _users, uint _duration) external isOwner(_fileHash) {
        for (uint i = 0; i < _users.length; i++){
            if (fileDirectory[_fileHash].permissions[_users[i]].expiryTime < now){
                fileDirectory[_fileHash].users.push(_users[i]);
            }
            uint _expiryTime = now + _duration;
            fileDirectory[_fileHash].permissions[_users[i]].permission = Permissions.Read;
            fileDirectory[_fileHash].permissions[_users[i]].expiryTime = _expiryTime;
            
            emit ReadPermissionGranted(_users[i], _fileHash, _expiryTime);
        }
    }

    function setWritePermissions(uint _fileHash, address[] calldata  _users, uint _duration) external isOwner(_fileHash){
        for (uint i = 0; i < _users.length; i++){
            if (fileDirectory[_fileHash].permissions[_users[i]].expiryTime < now){
                fileDirectory[_fileHash].users.push(_users[i]);
            }
            uint _expiryTime = now + _duration;
            fileDirectory[_fileHash].permissions[_users[i]].permission = Permissions.Write;
            fileDirectory[_fileHash].permissions[_users[i]].expiryTime = _expiryTime;
            emit ReadPermissionGranted(_users[i], _fileHash, _expiryTime);
        }
    }

    function setOwnerPermissions(uint _fileHash, address[] calldata _users, uint _duration) external isOwner(_fileHash){
        for (uint i = 0; i < _users.length; i++){
            if (fileDirectory[_fileHash].permissions[_users[i]].expiryTime < now){
                fileDirectory[_fileHash].users.push(_users[i]);
            }
            uint _expiryTime = now + _duration;
            fileDirectory[_fileHash].permissions[_users[i]].permission = Permissions.Owner;
            fileDirectory[_fileHash].permissions[_users[i]].expiryTime = _expiryTime;
            emit ReadPermissionGranted(_users[i], _fileHash, _expiryTime);
        }
    }

    function updateFile(uint _fileHash, uint new_fileHash, string calldata new_location) external isWriter(_fileHash) {
        //increment currentVersion, update locationHistory and updaterHistory
        fileDirectory[_fileHash].currentVersion++;
        fileDirectory[_fileHash].locationHistory.push(new_location);
        fileDirectory[_fileHash].updaterHistory.push(msg.sender);
        //updates new fileHash
        fileDirectory[_fileHash].fileHash = new_fileHash;
        //set new_fileHash to map to the file in fileDirectory
        fileDirectory[new_fileHash] = fileDirectory[_fileHash];

        for (uint i = 0; i < fileDirectory[_fileHash].users.length; i++){
            for (uint j = 0; j < usersToFiles[fileDirectory[_fileHash].users[i]].length; j++){
                if (usersToFiles[fileDirectory[_fileHash].users[i]][j] == _fileHash){
                    usersToFiles[fileDirectory[_fileHash].users[i]][j] = new_fileHash;
                    emit FileUpdated(fileDirectory[_fileHash].users[i], _fileHash, new_fileHash);
                    break;
                }
            }
        }

        delete fileDirectory[_fileHash];
    }

    function viewUsersOfFile(uint _fileHash) external view isReader(_fileHash) returns(address[] memory){
        return fileDirectory[_fileHash].users;
    }

    function viewFilePermissionsForUser(uint _fileHash, address _user) external view isReader(_fileHash) returns (Permissions){
        return fileDirectory[_fileHash].permissions[_user].permission;
    }
    
    // strings are an array of bytes so Solidity cannot return array of array. can use Seriality library in future implementation
    // function viewLocationHistory(uint _fileHash) external view isReader(_fileHash) returns (string[] memory){
    //     return fileDirectory[_fileHash].locationHistory;
    // }
    
    function viewUpdaterHistory(uint _fileHash) external view isReader(_fileHash) returns (address[] memory){
        return fileDirectory[_fileHash].updaterHistory;
    }
    
    function verifyDocument(uint _fileHash) external view isReader(_fileHash){

    }
    
    function viewUpdater(uint _fileHash) internal view isReader(_fileHash) returns (address){
        return (fileDirectory[_fileHash].updaterHistory[fileDirectory[_fileHash].currentVersion]);
    }
    
    function viewLocation(uint _fileHash) internal view isReader(_fileHash) returns (string memory){
        return fileDirectory[_fileHash].locationHistory[fileDirectory[_fileHash].currentVersion];
    }
    function viewFile(uint _fileHash) external view isReader(_fileHash) returns (uint, string memory, address){
        return (fileDirectory[_fileHash].currentVersion, viewLocation(_fileHash), viewUpdater(_fileHash));
    }
}