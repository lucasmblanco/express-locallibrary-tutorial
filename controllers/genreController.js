const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const async = require("async"); 


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
  res.send("NOT IMPLEMENTED: Genre create GET");
};

const genreCreatePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
};

const genreDeleteGet = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

const genreDeletePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

const genreUpdateGet = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

const genreUpdatePost = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};

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