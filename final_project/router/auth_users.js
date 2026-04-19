const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid login credentials" });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  req.session.authorization = { accessToken };
  req.session.username = username;

  return res.status(200).json({
    message: "User successfully logged in",
    accessToken
  });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review query parameter is required" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    book: books[isbn]
  });
});

// Delete a user's own review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review by this user not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    book: books[isbn]
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
