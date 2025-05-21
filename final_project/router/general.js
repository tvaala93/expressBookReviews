const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send JSON response with formatted friends data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]){
        res.send(JSON.stringify(books[isbn],null,4));
    }else{
        res.status(404).json({message:`Unable to find ISBN: ${isbn}`})
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    // Filter the books object for any book with the author
    let book_keys = Object.keys(books);
    //res.send(book_keys);
    let authorsnamed = {};

    for(let i = 0; i < book_keys.length; i++){
        
        if(books[book_keys[i]]["author"] === author){
            authorsnamed[book_keys[i]] = books[book_keys[i]];            
        }
    }    

    // Return true if any user with the same username is found, otherwise false
    if (Object.keys(authorsnamed).length > 0) {
        res.send(JSON.stringify(authorsnamed,null,4))
    } else {
        res.status(404).json({message:`Unable to find Author: ${author}`})
    }

    //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
