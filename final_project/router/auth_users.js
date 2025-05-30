const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let authentic_users = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (authentic_users.length > 0){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (username && password) {
        // Authenticate user        
        if (authenticatedUser(username, password)) {
            // Generate JWT access token
            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });

            // Store access token and username in session
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).json({message: "User successfully logged in", "token": accessToken});
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password" });
        }
    }else{
        return res.status(404).json({ message: "Error logging in" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {    
    let isbn = req.params.isbn
    let review = req.query.review
    let username = req.session.authorization.username

    // Check if any review was supplied
    if(!review){
        return res.status(400).json({message:"No review text supplied"})
    }

    if(books[isbn]){        
        if(!books[isbn].reviews){ // if no review collection init'd
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review
        return res.status(200).json({
            message: "Review submitted successfully",
            book: books[isbn]
        })
    }
    return res.status(404).json({message:"Book not found"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let bookNum = req.params.isbn;
    let user = req.session.authorization.username;
    let filteredReview = books[bookNum].reviews.filter((review) => 
        review.username != user);
    books[bookNum].reviews = filteredReview;
    return res.send(user + "'s Review Removed");
  });
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
