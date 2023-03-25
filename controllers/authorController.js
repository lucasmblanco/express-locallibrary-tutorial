const Book = require("../models/book");
const Author = require("../models/author");

const async = require("async");

const authorList = (req, res, next) => {
    Author.find({})
        .sort({family_name: 1})
        .exec((err, list_author) => {
            if (err) return next(err); 
            res.render("author_list", {
                title: "Author List",
                author_list: list_author
        })
    })
}

const authorDetail = (req, res, next) => {
    async.parallel({
        author(callback) {
            Author.findById(req.params.id ).exec(callback)
        }, 
        author_books(callback) {
            Book.find({author: req.params.id}, "title summary").exec(callback)
        }
    },
        (err, results) => {
            if (err) return next(err);
            if (results.author === null) {
                const err = new Error("Author not found"); 
                err.status = 404; 
                return next(err)
        
            }
            res.render("author_detail", {
                title: results.author.name, 
                author: results.author,
                author_books: results.author_books
            })
        }
    )
}

const authorCreateGet= (req, res) => {
    res.send("NOT IMPLEMENTED: Author create GET")
}

const authorCreatePost = (req, res) => {
    res.send("NOT IMPLEMENTED: Author create POST")
}

const authorDeleteGet= (req, res) => {
    res.send("NOT IMPLEMENTED: Author delete GET")
}

const authorDeletePost = (req, res) => {
    res.send("NOT IMPLEMENTED: Author delete POST")
}

const authorUpdateGet = (req, res) => {
    res.send("NOT IMPLEMENTED: Author update GET");
};

  
const authorUpdatePost = (req, res) => {
    res.send("NOT IMPLEMENTED: Author update POST");
};

module.exports = {
    authorList,
    authorDetail,
    authorCreateGet,
    authorCreatePost,
    authorDeleteGet,
    authorDeletePost,
    authorUpdateGet,
    authorUpdatePost
}