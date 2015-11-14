// Get the db configuration
var dbCon  = require('./config/db');

var db_helpers = {
  // Create the connection string based on the config.
  conString: 'postgres://' + dbCon.user + ':' + dbCon.pass + '@localhost/' + dbCon.db,

  // Handle any postgres errors
  handleError: function(err, client, done, res) {
    // If no error return false
    if (!err) return false;

    // Shut down the Postgres client
    if(client) {
      done(client);
    }

    // Respond with error
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('A database error occurred');
    return true;
  }
};

module.exports = db_helpers;
