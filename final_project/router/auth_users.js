const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let isUsernameValid = false;
  // users.forEach(user => {
  //   if (user.username === username) {
  //     isUsernameValid = true;
  //   }
  // })
  // isUsernameValid = users.some(user => user.username === username);
  // isUsernameValid = users.find(user => user.username === username) ? true : false;
  // isUsernameValid = users.filter(user => user.username === username).length > 0;
  // isUsernameValid = users.map(user => user.username).includes(username);
  // isUsernameValid = users.reduce((acc, user) => acc || user.username === username, false);
  // for (let user of users) {
  //   if (user.username === username) {
  //     isUsernameValid = true;
  //     break; // Exit the loop once we find a match
  //   }
  // }
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username){
      isUsernameValid = true;
      break; // Exit the loop once we find a match
    }
  }
  return isUsernameValid;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
