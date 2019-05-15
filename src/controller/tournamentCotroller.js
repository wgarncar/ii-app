var mongoose = require('mongoose');
var tournament = require('../model/tournament');
var {Request, Response} = require('express');

class TournamentController{
    addTournament(req, res){
        console.log(req.body);
        var myData = new tournament({name: req.body.name, date: req.body.date});
        myData.save()
            .then(item => {
                res.send("item saved to database");
            })
            .catch(err =>{
                res.status(400).send("unable to save to database");
            });
    }
    getTournament(req, res){
        tournament.find().then((data)=>{
            console.log(JSON.stringify(data, undefined, 2));
            res.status(200).send(JSON.stringify(data, undefined, 2))
        })
            .catch((e) => {
                res.status(400).send(e);
            })
    }
}

module.exports = new TournamentController();