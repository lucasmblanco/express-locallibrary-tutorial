const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const BookSchema = new Schema({
    title: {
        type: String, 
        required: true,
        maxLength: 100,
    }, 
    author: {
        type: Schema.Types.ObjectId, 
        ref: "Author", 
        required: true
    }, 
    summary: {
        type: String,
        required: true
    }, 
    isbn: {
        type: String,
        required: true
    }, 
    genre: [
        {
            type: Schema.Types.ObjectId, 
            ref: "Genre"
        }
    ]
})

BookSchema.virtual("url").get(() => {
    return `./catalog/books/${this._id}`
})


//module.exports = mongoose.model('Book', BookSchema); 
module.exports = mongoose.models.Book || mongoose.model('Book', BookSchema); 