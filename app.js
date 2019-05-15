var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
var bodyParser = require('body-parser');
var mongoose = require('./src/mongoose');

var session = require('express-session');
app.use(session({secret: 'your secret', saveUninitialized: true, resave: false}));
var MongoStore = require('connect-mongo')(session);

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const personCotroller = require('./src/controller/personController');
var person = require('./src/model/person');

const tournamentController = require('./src/controller/tournamentCotroller');
var tournament = require('./src/model/tournament');

const peopleController = require('./src/controller/peopleController');
var people = require('./src/model/people');

var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection eror:'));

//module.exports = mongoose

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

//app.use(express.static(path.join(__dirname, '../')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static(__dirname + "/views"));


// include routes
var routes = require('./routes/router');
app.use('/', routes);

app.get("/person", personCotroller.getPerson);

app.post("/addPerson", personCotroller.addPerson);

app.delete("/delete", personCotroller.deletePerson);

app.put("/updatePerson", personCotroller.putPerson);


app.get("/tournament", tournamentController.getTournament);

app.post("/addTournament", tournamentController.addTournament);

app.get("/people", peopleController.getPeople);

app.post("/addPeople", peopleController.addPeople);


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
app.set('view engine', 'pug');



app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;
