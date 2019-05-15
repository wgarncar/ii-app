var mongoose = require('mongoose');
var User = require('../src/model/user');
var express = require('express');
var router = express.Router();
var db = mongoose.connection;
//var path = require('path');


// GET route for reading data
router.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/views/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        }

        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})



// Special zone
router.get('/admin', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null || user.class != "xylobolus") {
                    var err = new Error('Not authorized! Go back!<br><br>'+
                        '<a type="button" href=\"/\">Return</a>');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send("<a type=\"button\" href=\"/profile\">Return</a>"+
                        '<h1>Name: </h1>' + user.username + '<br><br>' +
                        '<h2>Welcome in the funneh zone!<br>' +
                        'You are so lucky to be here.</h2>' +
                        '<a type="button" href="/logout">Logout</a>');
                }
            }
        });
});

// GET route after registering
router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!<br><br>'+
                        '<a type="button" href=\"/\">Return</a>');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send("<a type=\"button\" href=\"/profile\">Return</a>"+
                        '<h1>Name: </h1>' + user.username + '<br><br>' +
                        '<a type="button" href="/stats">Show stats</a><br>' +
                        '<h2>Mail: </h2>' + user.email + '<br>' +
                        '<a type="button" href="/logout">Logout</a>');
                }
            }
        });
});



router.get('/stats', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!<br><br>'+
                        '<a type="button" href=\"/\">Return</a>');
                    err.status = 400;
                    return next(err);
                } else {
                    var collection = db.collection('people');
                    var cursor = collection.find().sort({"pdf":-1});
                    var str = "<a type=\"button\" href=\"/profile\">Return</a>" +
                        "<table style=\"width:50%;text-align:center\">" +
                        "  <tr>" +
                        "    <th>ID</th>" +
                        "    <th>First name</th>" +
                        "    <th>Last name</th>" +
                        "    <th>PDF</th>" +
                        "  </tr>" +
                        "<tr>";
                    cursor.forEach(function(item) {
                            if (item != null) {
                                str += "<td>" + "</td>" +
                                    "<td>" + item.name + "</td>" +
                                    "<td>" + item.surname + "</td>" +
                                    "<td>" + item.pdf + "</td>" +
                                    "</tr>" +
                                    "<tr>";
                            }
                        }, function(err) {
                            str+="</tr></table>"
                            res.send(str);
                        }
                    );
                }
            }
        });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;