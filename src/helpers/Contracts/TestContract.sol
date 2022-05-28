// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

contract TestContract {
    uint256 number;
    event DataStored(uint256 val);

    function store(uint256 num) public {
        number = num;
        emit DataStored(num);
    }

    function retrieve() public view returns (uint256) {
        return number;
    }
}
