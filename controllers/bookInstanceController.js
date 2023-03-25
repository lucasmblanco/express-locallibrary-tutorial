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

const bookInstanceDetail= (req, res) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
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