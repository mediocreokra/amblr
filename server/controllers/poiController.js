var mongoose = require('mongoose');
var POI = require('../models/poiModel.js');
var sampleData = require('../data/samplePOIData.js');


/*
   This function will load sample data 
   for us to use, we would comment out 
   execution of it if in production.

*/
var createPOIsFromData = function() {
 
  // delete all data first so we don't have dupes
  // everytime server is bounced and db isn't
  POI.remove({}, function(err, removed) {
    if (err) {
      return console.log('Error removing data: ' + err);
    }

    console.log('Removed: ' + removed);

  });

  sampleData.forEach(function(poi) {
    POI.create(poi, function(err, newPoi) {
      if (err) {
        return console.error('Error creating POI: ' + newPoi + ', error: ' + err);
      } 
        
      console.log('Created sample POI: ' + newPoi);
    
    });
  });

}; 

/*
   Comment this out for prod.  It will attempt to
   generate new POIs every time server is bounced.
   It will delete all data in the db, if this is
   not wanted, comment out this call. 
*/
createPOIsFromData();

exports.savePOI = function(req, res) {
  console.log('POI to create: ' + req.body);

  var newPOI = req.body;

  POI.create(newPOI, function(err, newPOI) {
    if (err) {
      console.log('in newPOI save ', err);
      return res.json(err);
    } 

    console.log('POI successfully created: ' + newPOI)
    res.json(newPOI);
  });
};


exports.getAllPOI = function(req, res) {

  POI.find({}, function(err, pois) {
    if (err) {
      console.log('ERROR in getAllPOI: ', err);
      return res.json(err);
    } 
      
    res.json(pois); 
  });
};
