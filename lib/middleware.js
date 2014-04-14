module.exports.crossOrigin = function( req, res, next ) {
  res.header( "Access-Control-Allow-Origin", "*" );
  next();
};
