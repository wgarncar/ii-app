var mongoose = require('mongoose');
var TournamentSchema = new mongoose.Schema({
    name:String,
    date:String
});

mongoose.model('tournament', TournamentSchema);

module.exports = mongoose.model('tournament');