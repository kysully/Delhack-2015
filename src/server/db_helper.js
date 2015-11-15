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

      var q = client.query({ name:'get_restaurants',
       text: 'SELECT R.name as "r_name", R.rid, F.name as "f_name", '+
       'F.description, F.fid, F.code, F.start_date, F.end_date, F.active, '+
       'P."Current Customers" from "Restaurant" R LEFT OUTER JOIN "Flash_deal" F '+
       'on R.rid = F.rid LEFT OUTER JOIN (SELECT rid, count(*) AS "Current Customers" '+
       'FROM "Patron" WHERE active = true GROUP BY rid) as P on R.rid = P.rid ORDER BY R.rid;'
     });

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

      var q = client.query({ name:'get_restaurant', text: 'SELECT * FROM "Restaurant" ' +
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
        q = client.query({ name:'get_activeflashdeals', 
        text: 'SELECT R.name as "r_name", R.logo_url, F.name as "f_name", F.description, F.fid, ' +
        'F.code, F.start_date, F.end_date from "Restaurant" R JOIN "Flash_deal" F on R.rid = F.rid ' +
        'WHERE F.active = TRUE;'}); 
      }
      else{
        q = client.query({ name:'get_activeflashdeals', 
        text: 'SELECT R.name as "r_name", R.logo_url, F.name as "f_name", F.description, F.fid, ' +
        'F.code, F.start_date, F.end_date from "Restaurant" R JOIN "Flash_deal" F on R.rid = F.rid ' +
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

      var q = client.query({ name:'get_flashdeals', 
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

  },

  retrieveResPop: function(res){
    pg.connect(dbh.conString, function(err, client, done){

      if(dbh.handleError(err, client, done, res)) return;

      var q = client.query({ name:'get_respop', 
        text: 'Select R.rid, R.name, R.logo_url, R.lat, R.long, R.capacity, '+
        'coalesce(P."active_patrons", 0) as "active_patrons" '+
        'FROM "Restaurant" R LEFT OUTER JOIN (SELECT rid, '+
        'sum(CASE WHEN active THEN 1 ELSE 0 END) AS "active_patrons" '+
        'FROM "Patron" GROUP BY rid) P on R.rid = P.rid;'}); 

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

  retrieveHistorical: function(res, rid){
    pg.connect(dbh.conString, function(err, client, done){

      if(dbh.handleError(err, client, done, res)) return;

      var q = client.query({ name:'get_historical', 
        text: 'SELECT * FROM "Restaurant" R LEFT OUTER JOIN '+
        '"Patron" P on R.rid = P.rid WHERE R.rid = ' + rid + ';'}); 

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

  postFlashDeal: function(res, rid, params){
    pg.connect(dbh.conString, function(err, client, done){

      if(dbh.handleError(err, client, done, res)) return;

      var active = false;
      if(params.active)
        active = true;

      var q = client.query({ name:'post_flashdeal', 
        text: 'INSERT INTO "Flash_deal" (fid, name, description, start_date, '+
        'end_date, active, rid, code) VALUES '+
        '( DEFAULT, ' + params.name + ', ' + params.description + ', ' + params.start_date +
        ', ' + params.end_date + ', ' + active + ', ' +  rid + ', ' + params.code + ');'}); 

      q.on('row', function(row, result) {
        result.addRow(row);
      });

      q.on('err', function(err) {
        dbh.handleError(err, client, done, res);
      });

      q.on('end', function(result) {
        done(client);
        res.json({status: "ok"});
      });
    });
  },

  postPatron: function(res, rid, params){
    pg.connect(dbh.conString, function(err, client, done){

      if(dbh.handleError(err, client, done, res)) return;

      var active = false;
      if(params.active == "true")
        active = true;

      var q;
      if(params.time_out === ""){
        q = client.query({ name:'post_flashdeal', 
        text: 'INSERT INTO "Patron" (time_in, active, rid) VALUES '+
        '(' + params.time_in + ', ' + 'TRUE' + ', ' + rid +');'}); 
      }
      else{
        q = client.query({ name:'post_flashdeal', 
        text: 'INSERT INTO "Patron" (time_in, time_out, active, rid) VALUES '+
        '(' + params.time_in + ', ' + params.time_out + ', ' + active + ', ' + rid +');'}); 
      }

      q.on('row', function(row, result) {
        result.addRow(row);
      });

      q.on('err', function(err) {
        dbh.handleError(err, client, done, res);
      });

      q.on('end', function(result) {
        done(client);
        res.json({status: "ok"});
      });
    });
  }

};

module.exports = db_helpers;