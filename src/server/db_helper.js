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

  //retrieve all restaurants from the database and return them
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
  },

  //retrieve the restaurant from the database with the matching rid and returns it
  retrieveRestaurant: function(res, rid){
    pg.connect(dbh.conString, function(err, client, done) {
      if(dbh.handleError(err, client, done, res)) return;

      var q = client.query({ name:'get_restaurants', text: 'SELECT * FROM "Restaurant" ' +
        ' WHERE rid = ' + rid + ';'});

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
  },

  //retrieve all of the active flash deals with the given rid
  retrieveActiveFlashDeals: function(res, rid){
    pg.connect(dbh.conString, function(err, client, done) {
      if(dbh.handleError(err, client, done, res)) return;

      var q;

      if(rid == -1){
        q = client.query({ name:'get_restaurants', 
        text: 'SELECT R.name as "r_name", F.name as "f_name", F.description, F.code, ' +
        'F.start_date, F.end_date from "Restaurant" R JOIN "Flash_deal" F on R.rid = F.rid ' +
        'WHERE F.active = TRUE;'}); 
      }
      else{
        q = client.query({ name:'get_restaurants', 
        text: 'SELECT R.name as "r_name", F.name as "f_name", F.description, F.code, ' +
        'F.start_date, F.end_date from "Restaurant" R JOIN "Flash_deal" F on R.rid = F.rid ' +
        'WHERE F.active = TRUE AND R.rid = ' + rid + ';'}); 
      }

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
  },

  retrieveAllActiveFlashDeals: function(res){
    //wrapper function, -1 indicates all restaurants
    return db_helpers.retrieveActiveFlashDeals(res, -1);
  },

  retrieveFlashDeal: function(res, fid){

    pg.connect(dbh.conString, function(err, client, done) {
      if(dbh.handleError(err, client, done, res)) return;

      var q = client.query({ name:'get_restaurants', 
        text: 'SELECT R.name as "r_name", F.name as "f_name", F.description, F.code, ' +
        'F.start_date, F.end_date, F.active from "Restaurant" R JOIN "Flash_deal" F on R.rid = F.rid ' +
        'WHERE F.fid = ' + fid + ';'}); 

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