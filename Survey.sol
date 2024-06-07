// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Survey {
    struct Response {
        address respondent;
        string name;
        string email;
        string usn;
        string response1;
        string response2;
    }

    Response[] private responses;

    event ResponseSubmitted(address indexed respondent, string name, string email, string usn, string response1, string response2);

    function submitResponse(string memory _name, string memory _email, string memory _usn, string memory _response1, string memory _response2) public {
        responses.push(Response(msg.sender, _name, _email, _usn, _response1, _response2));
        emit ResponseSubmitted(msg.sender, _name, _email, _usn, _response1, _response2);
    }

    function getResponses() public view returns (Response[] memory) {
        return responses;
    }
}
