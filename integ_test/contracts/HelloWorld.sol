pragma solidity ^0.4.15;

// A contract that stores its owners address and a number
// and has a method that calls an Event containing those
// values.

contract HelloWorld {
  address public owner;
  int public number;
  int private count = 200;

  event Hello(address _owner, int _number);

  modifier onlyOwner() { 
    require(msg.sender == owner);
    _;
  }

  function HelloWorld(int _number) { 
    number = _number;
    owner = msg.sender;
  } 

  function sayHello () public {
    Hello(owner, number);
  }

  function saySum (int _num1, int _num2) public {
    Hello(owner, number);
  }

  function incrementCounter(int i) public{
    count += i;
  }

  function decrementCounter(int i) public{
    count -= i;
  }

  function getCount() public constant returns (int){
      return count;
  }

}
