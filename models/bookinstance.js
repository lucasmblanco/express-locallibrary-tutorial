const mongoose = require("mongoose"); 
const Schema = mongoose.Schema; 

const BookInstanceSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId, 
        ref: "title", 
        required: true, 
    },
    imprint: {
        type: String,
        required: true
    }, 
    status: {
        type: String,
        required: true,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
    }, 
    due_back: {
        type: Number,
        default: Date.now
    }

})

BookInstanceSchema.virtual("url").get(() => {
    return `./catalog/bookinstance/${this._id}`
})

//module.exports = mongoose.model('Book', BookInstanceSchema); 
module.exports = mongoose.models.BookInstance || mongoose.model('BookInstance', BookInstanceSchema); 
