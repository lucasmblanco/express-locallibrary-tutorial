const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

const bookInstanceList = (req, res, next) => {
  BookInstance.find({})
    .populate("book")
    .exec((err, list_bookinstance) => {
      if (err) return next(err); 
      res.render("bookinstance_list", {
        title: "Book Instance List", 
        bookinstance_list: list_bookinstance
      })
  })
};

const bookInstanceDetail= (req, res, next) => {
  BookInstance.findById(req.params.id) 
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) return next(err); 
      if (bookinstance === null) {
        const err = new Error("Book copy not found"); 
        err.status = 404; 
        return next(err); 
      }
      res.render("bookinstance_detail", {
        title: `Copy: ${bookinstance.book.title}`,
       bookinstance
      })
  })
};

const bookInstanceCreateGet = (req, res, next) => {
  Book.find({}, "title")
    .exec((err, books) => {
      if (err) return next(err); 
      res.render("bookinstance_form", {
        title: "Create Instance Book", 
        book_list: books,
        selected_book: false,
        errors: [],
        bookinstance: false

      })
  })
};

const bookInstanceCreatePost = [
  body("book", "Book must be specified")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status", "Status is empty").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    }); 
    if (!errors.isEmpty()) {
      Book.find({}, "title")
      .exec((err, books) => {
      if (err) return next(err); 
      res.render("bookinstance_form", {
        title: "Create Instance Book", 
        book_list: books,
        selected_book: bookinstance.book._id,
        errors: errors.array(),
        bookinstance
      })
      })
      return;
    }
    bookinstance.save(err => {
      if (err) return next(err); 
      res.redirect(bookinstance.url)
    })

  }
];

const bookInstanceDeleteGet = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

const bookInstanceDeletePost = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

const bookInstanceUpdateGet = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};

const bookInstanceUpdatePost = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};

module.exports = {
    bookInstanceList,
    bookInstanceDetail,
    bookInstanceCreateGet,
    bookInstanceCreatePost,
    bookInstanceDeleteGet,
    bookInstanceDeletePost,
    bookInstanceUpdateGet,
    bookInstanceUpdatePost
}