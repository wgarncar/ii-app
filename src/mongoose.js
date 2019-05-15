var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://wgarncar:ogafbt4p@ds259253.mlab.com:59253/wyniki", { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection eror:'));

module.exports = mongoose