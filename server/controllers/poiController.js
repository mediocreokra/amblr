var mongoose = require('mongoose');
var POI = require('../models/poiModel.js');
// var Q = require('q');
//set up methods for saving to database

exports.savePOI = function(req, res) {
  console.log(req.body);
  var newPOI = new POI({
    lat: req.body.lat,
    long: req.body.long,
    title: req.body.title
  });

  newPOI.save(function(err) {
    if (err) {
      console.log('in newPOI save ', err);
    } else {
      console.log('added new POI!!!!');
      POI.find({}, function(err, pois) {
        if (err) {
          console.log('find poi after saving new', err);
        } else {
          res.json(pois);
        }
      });
    }
  });

};


exports.getAllPOI = function(req, res) {

  POI.find({}, function(err, pois) {
    if (err) {
      console.log('in newPOI save ', err);
    } else {
      res.json(pois);
    }
  });
};
