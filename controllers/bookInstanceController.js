const BookInstance = require("../models/bookinstance");

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

const bookInstanceCreateGet = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance create GET");
};

const bookInstanceCreatePost = (req, res) => {
  res.send("NOT IMPLEMENTED: BookInstance create POST");
};

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