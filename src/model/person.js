var mongoose = require('mongoose');
var PersonSchema = new mongoose.Schema({
    name:String,
    surname:String,
    pdf:Number
});

mongoose.model('person', PersonSchema);

module.exports = mongoose.model('person');