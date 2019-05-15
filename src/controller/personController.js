var mongoose = require('mongoose');
var person = require('../model/person');
var {Request, Response} = require('express');

class PersonController{
    addPerson(req, res){
        console.log(req.body);
        var myData = new person({"name": req.body.name,
            "surname": req.body.surname,
            "pdf" : req.body.pdf});
        myData.save()
            .then(item => {
            res.send("item saved to database");
        })
            .catch(err =>{
                res.status(400).send("unable to save to database");
            });
    }
    getPerson(req, res){
        person.find().then((data)=>{
            console.log(JSON.stringify(data, undefined, 2));
            res.status(200).send(JSON.stringify(data, undefined, 2))
        })
            .catch((e) => {
                res.status(400).send(e);
            })
    }
    deletePerson(req, res){
        var surname = req.body.surname;

        person.deleteOne({
            surname: surname
        }, function (err){
            if(err){
                console.log(err);
            }
            else{
                res.send("Removed");
            }
        });

    }
    putPerson(req, res){
        var name = req.body.name;
        var surname = req.body.surname;
        var pdf = req.body.pdf;

        person.findOneAndUpdate({name: name, surname: surname, pdf: pdf}, {name: "changed by PUT"}, function (err, result){
            if(err){
                console.log(err);
            }
            else{
                console.log("result: ", result);
                res.send(result);
            }
        })
    }
}

module.exports = new PersonController();