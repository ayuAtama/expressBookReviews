const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const dotEnv = require('dotenv').config();
const axios = require('axios');

const baseURL = process.env.API_URL || "http://localhost:5000";

public_users.post("/register", (req, res) => {
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
/*
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});
*/

// async await with axios version
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}`)
    const booksData = response.data;
    res.send(JSON.stringify(booksData, null, 4));
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
})

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const { [isbn]: bookByISBN } = books;
  res.send(JSON.stringify(bookByISBN, null, 4));
});
*/

//async await with axios version
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`${baseURL}`)
    const { data: booksData } = response;
    const { [isbn]: bookByISBN } = booksData;
    if (!bookByISBN) {
      return res.status(404).send("Invalid ISBN Book");
    } else {
      res.send(JSON.stringify(bookByISBN, null, 4));
    }
  } catch (err) {
    console.error("Error fetching book by ISBN:" + isbn, err)
    res.status(500).json({ message: "Error fetching book by ISBN", error: err.message });
  }
})

// Get book details based on author
/*
public_users.get('/author/:author', function (req, res) {
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
*/

// async await with axios version
public_users.get('/author/:author', async (req, res) => {
  const { author: authorParams } = req.params;
  try {
    const response = await axios.get(`${baseURL}`);
    const { data: booksData } = response;
    let booksByAuthor = [];
    let keys = Object.keys(booksData);
    for (let i = 0; i < keys.length; i++) {
      if (booksData[keys[i]]['author'] === authorParams) {
        booksByAuthor.push(booksData[keys[i]]);
      }
    }
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
})

// Get all books based on title
/*
public_users.get('/title/:title', function (req, res) {
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
*/

// async await with axios version
public_users.get('/title/:title', async (req, res) => {
  const { title: titleParams } = req.params;
  try {
    const response = await axios.get(`${baseURL}`);
    const { data: booksData } = response;
    let keys = Object.keys(booksData);
    let booksByTitle = [];
    for (let i = 0; i < keys.length; i++) {
      if (booksData[keys[i]]['title'] === titleParams) {
        booksByTitle.push(booksData[keys[i]]);
      }
    }
    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "No books found with the given title" });
    } else {
      return res.send(JSON.stringify(booksByTitle, null, 4));
    }
  }
  catch (error) {
    console.error("Error fetching books by title:", error);
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn: isbnParams } = req.params;
  let { ["reviews"]: bookByISBN } = books[isbnParams] || {}; // Using optional chaining to avoid error if bookByISBN is undefined
  // let bookByISBN = books[isbnParams]?.reviews;
  if (!bookByISBN) {
    return res.status(404).json({ message: "Invalid ISBN Book" });
  }
  res.send(JSON.stringify(bookByISBN, null, 4));
});

// axios url endpoint
public_users.get('/axios', (req, res) => {
  //Endpoint to retrive all books
  res.send(JSON.stringify(books, null, 4));
})

module.exports.general = public_users;
