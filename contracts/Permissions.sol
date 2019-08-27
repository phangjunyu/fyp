pragma solidity ^0.4.2;

contract Permissions {

    
    mapping (address => uint[]) ownersToFiles;
    uint[] fileHashes; //storage
    enum Permissions {Owner, Write, Read};
    
    struct UserInfo{
        address user;
        Permissions permission;
    }
    struct FileInfo {
        uint fileHash;
        UserInfo[] users;
    }

    FileInfo[] allFiles = new FileInfo[];
    
    //this function should take in the hash of a file and store it
    //TODO - make payable(?)
    //TODO - check for legit fileHash value
    function registerFile(uint fileHash) public {
        ownersToFiles[msg.sender].push(fileHash);
        FileInfo newFile = FileInfo(fileHash, )
    }

    //
    function transferFile() 

}