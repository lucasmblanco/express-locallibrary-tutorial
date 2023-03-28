const express = require("express"); 
const router = express.Router(); 

//Controllers 
const authorController = require("../controllers/authorController");
const bookController = require("../controllers/bookController");
const bookInstanceController = require("../controllers/bookInstanceController");
const genreController = require("../controllers/genreController");

// ------ GET catalog home page. ------

router.get("/", bookController.indexHome);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/book/create", bookController.bookCreateGet);

router.post("/book/create", bookController.bookCreatePost);

router.get("/book/:id/delete", bookController.bookDeleteGet);

router.post("/book/:id/delete",bookController.bookDeletePost);

router.get("/book/:id/update", bookController.bookUpdateGet);

router.post("/book/:id/update", bookController.bookUpdatePost);

router.get("/book/:id", bookController.bookDetail);

router.get("/books", bookController.bookList);

/// ------ AUTHOR ROUTES --------///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).

router.get("/author/create", authorController.authorCreateGet);

router.post("/author/create", authorController.authorCreatePost);

router.get("/author/:id/delete", authorController.authorDeleteGet);

router.post("/author/:id/delete", authorController.authorDeletePost);

router.get("/author/:id/update", authorController.authorUpdateGet);

router.post("/author/:id/update", authorController.authorUpdatePost);

router.get("/author/:id", authorController.authorDetail);

router.get("/authors", authorController.authorList);

/// ------ GENRE ROUTES ------///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
    

router.get("/genre/create", genreController.genreCreateGet);

//POST request for creating Genre.
router.post("/genre/create", genreController.genreCreatePost);

// GET request to delete Genre.
router.get("/genre/:id/delete", genreController.genreDeleteGet);

// POST request to delete Genre.
router.post("/genre/:id/delete", genreController.genreDeletePost);

// GET request to update Genre.
router.get("/genre/:id/update", genreController.genreUpdateGet);

// POST request to update Genre.
router.post("/genre/:id/update", genreController.genreUpdatePost);

// GET request for one Genre.
router.get("/genre/:id", genreController.genreDetail);

// GET request for list of all Genre.
router.get("/genres", genreController.genreList);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).

router.get(
  "/bookinstance/create",
  bookInstanceController.bookInstanceCreateGet
);

// POST request for creating BookInstance.
router.post(
  "/bookinstance/create",
  bookInstanceController.bookInstanceCreatePost
);

// GET request to delete BookInstance.
router.get(
  "/bookinstance/:id/delete",
  bookInstanceController.bookInstanceDeleteGet
);

// POST request to delete BookInstance.
router.post(
  "/bookinstance/:id/delete",
  bookInstanceController.bookInstanceDeletePost
);

// GET request to update BookInstance.
router.get(
  "/bookinstance/:id/update",
  bookInstanceController.bookInstanceUpdateGet
);

// POST request to update BookInstance.
router.post(
  "/bookinstance/:id/update",
  bookInstanceController.bookInstanceUpdatePost
);

// GET request for one BookInstance.
router.get("/bookinstance/:id", bookInstanceController.bookInstanceDetail);

// GET request for list of all BookInstance.
router.get("/bookinstances", bookInstanceController.bookInstanceList);

module.exports = router;