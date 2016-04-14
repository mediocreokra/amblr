exports.isAuthenticated = function(req, res, next) {
  logger.info('in privateController');
  // if user is authenticated, move on to next request handler
  if (req.isAuthenticated()) {
    console.log('in privateController, req.isAuthenticated = true');
    
    return next();
  }
  // if the user is not authenticated, send a 403 to the client side
  // TODO: from the client side, if we receive a 403, then set $location.path to menu-home
  res.statusCode(403);
  res.end();
};

// exports.

