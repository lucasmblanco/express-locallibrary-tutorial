const mongoose = require("mongoose"); 
const Schema = mongoose.Schema; 

const GenreSchema = new Schema({
    name: {
        type: String,
        required: true, 
        minLenght: 3,
        maxLength: 100
    },
}); 

GenreSchema.virtual("url").get(function(){
    return `/catalog/genre/${this._id}`
}); 

//module.exports = mongoose.model('Genre', GenreSchema); 
module.exports = mongoose.models.Genre || mongoose.model('Genre', GenreSchema); 
