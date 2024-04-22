// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Blog is Ownable {
  string public name;

  uint private _postIds;

  struct Post {
    uint id;
    string title;
    string content;
    bool published;
  }

  mapping (uint => Post) idToPost;
  mapping (string => Post) hashToPost;

  event PostCreated(uint id, string title, string hash);
  event PostUpdated(uint id, string title, string hash, bool published);

  constructor(string memory _name) Ownable(msg.sender) {
    name = _name;
  }

  function updateName(string memory _name) public {
    name = _name;
  }

  function fetchPost(string memory hash) public view returns (Post memory) {
    return hashToPost[hash];
  }

  function createPost(string memory title, string memory hash) public onlyOwner {
    console.log("Called myFunction with param:", title);
    _postIds += 1;
    uint postId = _postIds;
    Post storage post = idToPost[postId];
    post.id = postId;
    post.title = title;
    post.published = true;
    post.content = hash;
    hashToPost[hash] = post;
    emit PostCreated(postId, title, hash);
  }

  function updatePost(uint postId, string memory title, string memory hash, bool published) public onlyOwner () {
    Post storage post = idToPost[postId];
    post.title = title;
    post.published = published;
    post.content = hash;
    idToPost[postId] = post;
    hashToPost[hash] = post;
    emit PostUpdated(post.id, title, hash, published);
  }

  function fetchAllPosts() public view returns (Post[] memory) {
    uint itemCount = _postIds;

    Post[] memory posts = new Post[](itemCount);
    for (uint i = 0; i < itemCount; i++) {
      uint currentId = i + 1;
      Post storage currentItem = idToPost[currentId];
      posts[i] = currentItem;
    }
    return posts;
  }
}
