const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
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
    if (users[i].username === username) {
      isUsernameValid = true;
      break; // Exit the loop once we find a match
    }
  }
  return isUsernameValid;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let isAuthenticated = false;
  // users.forEach(user => {
  //   if (user.username === username && user.password === password) {
  //     isAuthenticated = true;
  //   }
  // })
  // isAuthenticated = users.some(user => user.username === username && user.password === password);
  // isAuthenticated = users.find(user => user.username === username && user.password === password) ? true : false;
  // isAuthenticated = users.filter(user => user.username === username && user.password === password).length > 0;
  // isAuthenticated = users.map(user => user.username === username && user.password === password).includes(true);
  // isAuthenticated = users.reduce((acc, user) => acc || (user.username === username && user.password === password), false);
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      isAuthenticated = true;
      break; // Exit the loop once we find a match
    }
  }
  return isAuthenticated;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required" });
  } else if (!isValid(username)) {
    return res.status(401).json({ message: "User not found!" });
  } else if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Incorrect password!" });
  } else { // create a token
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in" }) && console.log("Here's the access token :" + accessToken);
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  const { [isbn]: bookByISBN } = books;
  const { query: review } = req;

  if (!isbn) {
    return res.status(400).send({ message: "ISBN is required" });
  } else if (!bookByISBN) {
    return res.status(404).send({ message: "Book not found" });
  } else if (!review || !review.reviews) {
    return res.status(400).send({ message: "Review is required" });
  } else {
    if (!bookByISBN.reviews) {
      bookByISBN.reviews = {};
    } else {
      bookByISBN.reviews[username] = review.reviews; // add the review of the user
      return res.status(200).json({ message: `Review for book with ISBN ${isbn} has been added`, isbn: isbn, review: review.reviews, username: username }) && console.log("Review for this book has been added successfully");
    }
  }

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  const { [isbn]: bookByISBN } = books;
  const { [username]: userReview } = bookByISBN.reviews;
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  } else {
    if (!bookByISBN) {
      return res.status(404).json({ message: "Book not found" });
    } else if (!userReview) {
      return res.status(404).json({ message: "The user has not reviewed this book yet" });
    } else {
      // delete userReview (invalid because it just a copy of the bookByISBN.reviews[username])
      delete bookByISBN.reviews[username] // delete the review of the user
      return res.status(200).json({ message: `Review for book with ISBN ${isbn} has been deleted`, isbn: isbn }) && console.log("Review for this book has been deleted successfully");
    }
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
