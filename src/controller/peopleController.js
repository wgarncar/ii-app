var mongoose = require('mongoose');
var people = require('../model/people');
var {Request, Response} = require('express');

class peopleController{
    addPeople(req, res){
        console.log(req.body);
        var myData = new people({name: req.body.name, surname: req.body.surname});
        myData.save()
            .then(item => {
                res.send("item saved to database");
            })
            .catch(err =>{
                res.status(400).send("unable to save to database");
            });
    }
    getPeople(req, res){
        people.find().then((data)=>{
            console.log(JSON.stringify(data, undefined, 2));
            res.status(200).send(JSON.stringify(data, undefined, 2))
        })
            .catch((e) => {
                res.status(400).send(e);
            })
    }
}

module.exports = new peopleController();