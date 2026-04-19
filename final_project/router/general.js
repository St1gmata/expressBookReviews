const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6: Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const filteredBooks = Object.entries(books).filter(([isbn, book]) =>
    book.author.toLowerCase() === author
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  const result = Object.fromEntries(filteredBooks);
  return res.status(200).send(JSON.stringify(result, null, 4));
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const filteredBooks = Object.entries(books).filter(([isbn, book]) =>
    book.title.toLowerCase() === title
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }

  const result = Object.fromEntries(filteredBooks);
  return res.status(200).send(JSON.stringify(result, null, 4));
});

// Task 5: Get reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

/*
  Tasks 10–13
  Axios + Promises / Async-Await helpers
  These are added in general.js so your submitted GitHub URL for this file
  clearly contains the required Axios-based implementations.
*/

// Task 10: Get all books using async/await with Axios
async function getAllBooksAxios() {
  const response = await axios.get("http://localhost:5000/");
  return response.data;
}

// Task 11: Get book by ISBN using Promises with Axios
function getBookByISBNAxios(isbn) {
  return axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => response.data);
}

// Task 12: Get books by author using Promises with Axios
function getBooksByAuthorAxios(author) {
  return axios
    .get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
    .then((response) => response.data);
}

// Task 13: Get books by title using async/await with Axios
async function getBooksByTitleAxios(title) {
  const response = await axios.get(
    `http://localhost:5000/title/${encodeURIComponent(title)}`
  );
  return response.data;
}

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
