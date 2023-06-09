const mongoose = require("mongoose"); 
const { DateTime } = require("luxon")
const Schema = mongoose.Schema; 

const BookInstanceSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId, 
        ref: "Book", 
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
        type: Date,
        default: Date.now
    }

})

BookInstanceSchema.virtual("url").get(function(){
    return `/catalog/bookinstance/${this._id}`
})

BookInstanceSchema.virtual("due_date_formatted").get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATA_MED)
})

BookInstanceSchema.virtual("due_date_isodate").get(function () {
    return this.due_back ? DateTime.fromJSDate(this.due_back).toISODate() : '';
})

//module.exports = mongoose.model('Book', BookInstanceSchema); 
module.exports = mongoose.models.BookInstance || mongoose.model('BookInstance', BookInstanceSchema); 
