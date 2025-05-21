const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password exist
  if (username && password){
    // Check to see if user already exists
    if (!isValid(username)){
        // Add the new user to the array
        users.push({"username":username,"password":password});
        return res.status(200).json({message: `Successfully registered new user: ${username}`});
    }else {
        return res.status(404).json({message: "User already exists!"});
    }
  }else{
    return res.status(404).json({message: "Unable to register user. Please ensure both a username and password are provided"})
  }    
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
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    // Filter the books object for any book with the author
    let book_keys = Object.keys(books);
    //res.send(book_keys);
    let titlesnamed = {};

    for(let i = 0; i < book_keys.length; i++){
        
        if(books[book_keys[i]]["title"] === title){
            titlesnamed[book_keys[i]] = books[book_keys[i]];            
        }
    }    

    // Return true if any user with the same username is found, otherwise false
    if (Object.keys(titlesnamed).length > 0) {
        res.send(JSON.stringify(titlesnamed,null,4))
    } else {
        res.status(404).json({message:`Unable to find Title: ${title}`})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]){
        if (Object.keys(books[isbn]["reviews"]).length > 0) { // Check if any reviews exist
            res.send(JSON.stringify(books[isbn]["reviews"],null,4));
        }else{
            res.send(`No reviews for ISBN: ${isbn}`);
        }        
    }else{
        res.status(404).json({message:`Unable to find ISBN: ${isbn}`});
    }
});

module.exports.general = public_users;
