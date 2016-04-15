var mongoose = require('mongoose');
var POI = require('../models/poiModel.js');
var sampleData = require('../data/samplePOIData.js');
var logger = require('../config/logger.js');

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
      return logger.error('Error removing POIs: ' + err);
    }

    logger.info('Removed POIs: ' + removed);

  });

  sampleData.forEach(function(poi) {
    POI.create(poi, function(err, newPoi) {
      if (err) {
        return logger.error('Error creating POI: ' + newPoi + ', error: ' + err);
      } 
        
      logger.info('Created sample POI: ' + newPoi);
    
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
  logger.info('POI to create: ' + req.body);

  var newPOI = req.body;

  POI.create(newPOI, function(err, newPOI) {
    if (err) {
      logger.error('in newPOI save ', err);
      res.status(400);
      return res.json(err);
    } 

    logger.info('POI successfully created: ' + newPOI);

    res.status(201);
    res.json(newPOI);
  });
};


exports.getAllPOI = function(req, res) {

  POI.find({}, function(err, pois) {
    if (err) {
      logger.error('ERROR in getAllPOI: ', err);
      return res.json(err);
    } 
      
    logger.info('Successfully retrieved pois: ' + pois);
    res.json(pois); 
  });
};
