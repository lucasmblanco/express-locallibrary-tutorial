const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const async = require("async");
const { body, validationResult } = require("express-validator");

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

const bookCreateGet = (req, res, next) => {
  async.parallel(
    {
      authors(callback) {
        Author.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("book_form", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
        book: undefined,
        errors: [],
      });
    }
  );
};

const bookCreatePost = [
  (req, res, next) => {
    /// function toma cuando unico req.body.genre y lo convierte en array
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors(callback) {
            Author.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          for (const genre of results.genres) {
            if (book.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          }
          res.render("book_form", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    book.save((err) => {
      if (err) return next(err);
      res.redirect(book.url);
    });
  },
];

const bookDeleteGet = (req, res, next) => {
  async.parallel({
    book(callback) {
      Book.findById(req.params.id)
        .populate("author")
        .populate("genre")
      .exec(callback); 
    },
    bookinstances(callback) {
      BookInstance.find({ book: req.params.id }).exec(callback); 
    }
  },
    (err, results) => {
      if (err) return next(err); 
      res.render("book_delete", {
        title: "Book Delete", 
        book: results.book, 
        bookinstances: results.bookinstances
      })
    }
  )
};

const bookDeletePost = (req, res, next) => {
  async.parallel({
    book(callback) {
      Book.findById(req.body.bookid)
        .populate("author")
        .populate("genre")
      .exec(callback); 
    },
    bookinstances(callback) {
      BookInstance.find({ book: req.body.bookid }).exec(callback); 
    }
  },
    (err, results) => {
      if (err) return next(err); 
      if (results.bookinstances.length > 0) {
        res.render("book_delete", {
          title: "Book Delete", 
          book: results.book, 
          bookinstances: results.bookinstances
        })
        return;
      }
      Book.findByIdAndRemove(req.body.bookid, (err) => {
        if (err) return next(err); 
        res.redirect('/catalog/books'); 
      })
    }
  )
};

const bookUpdateGet = (req, res, next) => {
  async.parallel({
    book(callback) {
      Book.findById(req.params.id)
        .populate("author")
        .populate("genre")
      .exec(callback)
    },
    authors(callback) {
      Author.find(callback)
    }, 
    genres(callback) {
      Genre.find(callback)
    }

  }, (err, results) => {
    if (err) return next(err); 
    if (results.book === null) {
      const err = new Error("Book not found");
      err.status = 404;
      return next(err);
    }
    for (const genre of results.genres) {
      for (const bookGenre of results.book.genre) {
        if (genre._id.toString() === bookGenre._id.toString()) {
          genre.checked = "true";
        }
      }
    }
    res.render("book_form", {
      title: "Update Book", 
      book: results.book,
      authors: results.authors,
      genres: results.genres,
      errors: []
    })
  })
};

const bookUpdatePost = [
  
  (req, res, next) => {
    /// function toma cuando unico req.body.genre y lo convierte en array
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre:  typeof req.body.genre === "undefined" ? [] : req.body.genre,
        _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors(callback) {
            Author.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          for (const genre of results.genres) {
            if (book.genre.includes(genre._id)) {
              genre.checked = 'true';
            }
          }
          res.render("book_form", {
            title: "Update Book",
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    Book.findByIdAndUpdate(req.params.id, book, {}, (err, updatedbook) => {
      if (err) return next(err);
      res.redirect(updatedbook.url)
    })
  },
];

module.exports = {
  indexHome,
  bookList,
  bookDetail,
  bookCreateGet,
  bookCreatePost,
  bookDeleteGet,
  bookDeletePost,
  bookUpdateGet,
  bookUpdatePost,
};
