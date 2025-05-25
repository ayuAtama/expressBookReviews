const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" }) && console.log(users);
  } else if (isValid(username)) {
    return res.status(400).json({ message: "User already exists!" }) && console.log(users);
  } else {
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login on /customer/auth/login" }) && console.log(users);
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { isbn } = req.params;
  const { [isbn]: bookByISBN } = books;
  res.send(JSON.stringify(bookByISBN, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { author: authorParams } = req.params;
  let booksByAuthor = [];
  let key = Object.keys(books);
  for (let i = 0; i < key.length; i++) {
    if (books[key[i]].author === authorParams) {
      booksByAuthor.push(books[key[i]]);
    }
  }

  // object style keeping key's value
  // let booksByAuthor = {};
  // let kunci = Object.keys(books);
  // for (let key of kunci) {
  //   if (books[key].author === authorParams) {
  //     booksByAuthor[key] = books[key];
  //   }
  // }
  res.send(JSON.stringify(booksByAuthor, null, 4));
  // console.log(books[1].author);
  // console.log(Object.keys(books).length);
  // console.log(key);
  // console.log(key[0]);
  // console.log(key[4]);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { title: titleParams } = req.params;
  let keys = Object.keys(books);
  let booksByTitle = [];
  for (let i = 0; i < keys.length; i++) {
    if (books[keys[i]].title === titleParams) {
      booksByTitle.push(books[keys[i]]);
    }
  }

  // using object.values method
  // let booksByTitle = Object.values(books).filter((book) => book.title === titleParams);

  res.send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const { isbn: isbnParams } = req.params;
  let { ["reviews"]: bookByISBN } = books[isbnParams] || {}; // Using optional chaining to avoid error if bookByISBN is undefined
  // let bookByISBN = books[isbnParams]?.reviews;
  if (!bookByISBN) {
    return res.status(404).json({ message: "Invalid ISBN Book" });
  }
  res.send(JSON.stringify(bookByISBN, null, 4));
});

module.exports.general = public_users;
