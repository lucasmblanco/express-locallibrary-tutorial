const Book = require("../models/book");
const Author = require("../models/author");
const { body, validationResult } = require("express-validator"); 

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
    res.render("author_form", {
        title: "Create Author", 
        author: false,
        errors: []
    })
}

const authorCreatePost = [
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body("date_of_death")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            res.render("author_form", {
                title: "Create Author", 
                author: req.body, 
                errors: errors.array()
            })
            return; 
        } else {
            const author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }); 

            author.save(error => {
                if (error) return next(error); 
                res.redirect(author.url); 
            })
        }
       
    } 
]

const authorDeleteGet= (req, res, next) => {
    async.parallel({
        author(callback) {
            Author.findById(req.params.id).exec(callback)
        }, 
        author_books(callback) {
            Book.find({author: req.params.id}).exec(callback)
        }
    },
        (err, results) => {
            if (err) return next(err); 
            if (results.author === null) res.redirect("/catalog/authors"); 
            res.render("author_delete", {
                title: "Delete Author", 
                author: results.author,
                author_books: results.author_books
            })
        }
    )
}

const authorDeletePost = (req, res, next) => {
    async.parallel({
        author(callback) {
            Author.findById(req.body.authorid).exec(callback)
        },
        author_books(callback) {
            Book.find({ author: req.body.authorid }).exec(callback)
        }
    },
        (err, results) => {
            if (err) return next(err);
            if (results.author_books.length > 0) {
                res.render("author_delete", {
                    title: "Delete Author",
                    author: results.author,
                    author_books: author_books
                })
                return;
            }
            Author.findByIdAndRemove(req.body.id, (err) => {
                if (err) return next(err);
                res.redirect("/catalog/authors");
            });
        }
    );
}

const authorUpdateGet = (req, res, next) => {
    Author.findById(req.params.id)
        .exec((err, author) => {
            if (err) return next(err); 
            res.render("author_form", {
                title: "Update Author", 
                author: author,
                errors: []
            })
    })
    
};

  
const authorUpdatePost = [
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body("date_of_death")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req); 
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: req.params.id,
        }); 
        if (!errors.isEmpty()) {
            Author.findById(req.params.id)
            .exec((err, author) => {
                if (err) return next(err); 
                res.render("author_form", {
                    title: "Update Author", 
                    author: author,
                    errors: []
                })
        })
            return; 
        } 
        Author.findByIdAndUpdate(req.params.id, author, {}, (err, authorupdated) => {
                if (err) return next(err); 
                res.redirect(authorupdated.url); 
           } )
        }
       
    
]

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