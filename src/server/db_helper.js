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
  },

  //retrieveRestaurants
  retrieveRestaurants: function(res){
    pg.connect(dbh.conString, function(err, client, done) {
      if(dbh.handleError(err, client, done, res)) return;

      var q = client.query({ name:'get_restaurants', text: 'SELECT * FROM "Restaurant";'});

      q.on('row', function(row, result) {
        result.addRow(row);
      });

      q.on('err', function(err) {
        dbh.handleError(err, client, done, res);
      });

      q.on('end', function(result) {
        done(client);
        res.json(result.rows);
      });
    });
  }

};

module.exports = db_helpers;