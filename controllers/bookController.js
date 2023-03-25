const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const async = require("async");

const indexHome = (req, res) => {
  async.parallel(
    {
      book_count(callback) {
        Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      book_instance_count(callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count(callback) {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

const bookList = (req, res) => {
  Book.find({}, "title author")
  .sort({ title: 1 })
  .populate("author")
  .exec(function (err, list_books) {
    if (err) {
      return next(err);
    }
    res.render("bookList", { title: "Book List", book_list: list_books });
  });
};

const bookDetail = (req, res) => {
  async.parallel(
    {
      book(callback) {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      book_instance(callback) {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      res.render("book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

const bookCreateGet = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create GET");
};

const bookCreatePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create POST");
};

const bookDeleteGet = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

const bookdeletePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

const bookUpdateGet = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

const bookUpdatePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};

module.exports = {
    indexHome,
    bookList,
    bookDetail,
    bookCreateGet,
    bookCreatePost,
    bookDeleteGet,
    bookdeletePost,
    bookUpdateGet,
    bookUpdatePost
}