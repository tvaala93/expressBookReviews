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
    //res.send(JSON.stringify(books,null,4));

    //Creating a promise method. The promise will get resolved when timer times out after 3 seconds.
    let book_promise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books)            
        }, 3000);
    });

    //Call the promise and wait for it to be resolved and then print a message.
    book_promise.then((book_list) => {
        res.status(200).send(JSON.stringify(book_list, null, 4))
    }).catch((error) => {
        res.status(500).json({error: "There is an error..."})
    })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    /*if (books[isbn]){
        res.send(JSON.stringify(books[isbn],null,4));
    }else{
        res.status(404).json({message:`Unable to find ISBN: ${isbn}`})
    }*/

    let isbn_promise = new Promise((resolve,reject) => {
        setTimeout(() => {
            const book = books[isbn]
            if(book){
                resolve(book)
            }
            else{
                reject("Book not found")
            }
        }, 3000);
    })

    isbn_promise.then((book) => {        
        res.status(200).send(JSON.stringify(book))
    }).catch((error) => {
        res.status(404).json({message : error})
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;    
    let author_promise = new Promise((resolve,reject) => {
        setTimeout(() => {
            // Filter the books object for any book with the author
            //let book_keys = Object.keys(books);
            //res.send(book_keys);
            let authorsnamed = [];            

            for(let i in books){     
                let book = books[i]           
                if(book.author === author){
                    authorsnamed.push(book);
                }
            }

            if (authorsnamed.length > 0) {                
                resolve(authorsnamed)
            }
            else{                
                reject(`Unable to find Author: ${author}`)
            }

        }, 3000);
    })

    author_promise.then((books_by_author) => {
        res.status(200).send(books_by_author)
    }).catch((error) => {
        res.status(404).json({message: error})        
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    // Filter the books object for any book with the author
    let book_keys = Object.keys(books);
    //res.send(book_keys);
    let titlesnamed = [];
    let title_promise = new Promise((resolve,reject) => {
        setTimeout(() => {
            for(let i in books){
                let book = books[i]
                if (book.title === title){
                    titlesnamed.push(book)
                }
            }

            if(titlesnamed.length > 0){
                resolve(titlesnamed)
            }else{
                reject(`Unable to find Title: ${title}`)
            }
        }, 3000);
    })

    title_promise.then((titles) =>{
        res.status(200).send(titles)
    }).catch((error) => {
        res.status(404).json({message:error})
    })

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
