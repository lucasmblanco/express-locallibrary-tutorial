const Book = require("../models/book");
//const Author = require("../models/author");
const Genre = require("../models/genre");
//const BookInstance = require("../models/bookinstance");
const async = require("async"); 
const { body, validationResult } = require("express-validator"); 


const genreList = (req, res, next) => {
  Genre.find({})
    .sort({ name: 1 })
    .exec((err, list_genre) => {
      if(err) return next(err)
      res.render('genre_list', {
        title: "Genre List", 
        genre_list: list_genre
    })
  })
};

const genreDetail = (req, res, next) => {
  async.parallel({
    genre(callback) {
      Genre.findById(req.params.id).exec(callback)
    }, 
    genre_books(callback) {
       Book.find({genre: req.params.id}).exec(callback)
    }
  },
    (err, results) => {
      if (err) return next(err)
      if (results.genre === null) {
        const err = new Error("Genre Not Found"); 
        err.status = 404; 
        return next(err)
      }
      res.render('genre_detail', {
        title: "Genre Detail", 
        genre: results.genre,
        genre_books: results.genre_books
      })
  })
};

const genreCreateGet = (req, res) => {
  res.render("genre_form", {
    title: "Create genre",
    errors: false
  })
};

const genreCreatePost = [
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(), // Validate and sanitize the name field.
  (req, res, next) => { // Process request after validation and sanitization.
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name }); // Extract the validation errors from a request.
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create genre",
        genre,
        errors: errors.array(),
      });
      return; 

    } else {
      Genre.findOne({ name: req.body.name })
        .exec((err, found_genre) => {
          if (err) return next(err); 
          if (found_genre) {
            res.redirect(found_genre.url)
          } else {
            genre.save(err => {
              if (err) return next(err); 
              res.redirect(genre.url); 
            })
          }
      })
    }
  }

];

const genreDeleteGet = (req, res, next) => {
  async.parallel({
    genre(callback) {
      Genre.findById(req.params.id).exec(callback); 
      
    }, 
    genre_books(callback) {
      Book.find({ genre: req.params.id }).exec(callback);
    }
  },
    (err, results) => {
      if (err) return next(err); 
      res.render("genre_delete", {
        title: "Genre Delete", 
        genre: results.genre, 
        genre_books: results.genre_books
      })
    }
  )
};

const genreDeletePost = (req, res, next) => {
  async.parallel({
    genre(callback) {
      Genre.findById(req.body.genreid).exec(callback); 
      
    }, 
    genre_books(callback) {
      Book.find({ genre: req.body.genreid }).exec(callback);
    }
  },
    (err, results) => {
      if (err) return next(err); 
      if (results.genre_books.length > 0) {
        res.render("genre_delete", {
          title: "Genre Delete", 
          genre: results.genre, 
          genre_books: results.genre_books
        })
        return;
      }
      Genre.findByIdAndRemove(req.body.genreid, (err) => {
        if (err) return next(err); 
        res.redirect('/catalog/genres')
      })
    }
  )
};

const genreUpdateGet = (req, res, next) => {
  Genre.findById(req.params.id)
    .exec((err, genre) => {
      if (err) return next(err); 
      res.render("genre_form", {
        title: "Update genre",
        genre,
        errors: false
      })
  })
};

const genreUpdatePost = [
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(), // Validate and sanitize the name field.
  (req, res, next) => { // Process request after validation and sanitization.
    const errors = validationResult(req);
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id, 
    });
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create genre",
        genre,
        errors: errors.array(),
      });
      return; 
    } else {
      Genre.findOne({ name: req.body.name })
        .exec((err, found_genre) => {
          if (err) return next(err); 
          if (found_genre) {
            res.redirect(found_genre.url)
          } else {
            Genre.findByIdAndUpdate(req.params.id, genre, {},(err, genreupdated) => {
              if (err) return next(err); 
              res.redirect(genreupdated.url); 
            })
          }
      })
    }
  }

];

module.exports = {
    genreList,
    genreDetail,
    genreCreateGet,
    genreCreatePost,
    genreDeleteGet,
    genreDeletePost,
    genreUpdateGet,
    genreUpdatePost
}