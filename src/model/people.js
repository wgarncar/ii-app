var mongoose = require('mongoose');
var PeopleSchema = new mongoose.Schema({
    name:String,
    surname:String
});

mongoose.model('people', PeopleSchema);

module.exports = mongoose.model('people');