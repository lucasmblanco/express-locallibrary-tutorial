const Author = require('../models/author'); 

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

const authorDetail = (req, res) => {
    res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`)
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