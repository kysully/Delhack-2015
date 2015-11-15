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

     //  var q = client.query({ name:'get_restaurants',
     //   text: 'SELECT R.name as "r_name", R.rid, F.name as "f_name", '+
     //   'F.description, F.fid, F.code, F.start_date, F.end_date, F.active, '+
     //   'P."Current Customers" from "Restaurant" R LEFT OUTER JOIN "Flash_deal" F '+
     //   'on R.rid = F.rid LEFT OUTER JOIN (SELECT rid, count(*) AS "Current Customers" '+
     //   'FROM "Patron" WHERE active = true GROUP BY rid) as P on R.rid = P.rid ORDER BY R.rid;'
     // });

      var q = client.query({ name:'get_restaurants',
       text: 'SELECT name, R.rid, telephone, website, logo_url, description, lat, long, '+
       'capacity, address, P."active_patrons" from "Restaurant" R LEFT OUTER JOIN '+
       '(SELECT rid, count(*) AS "active_patrons" FROM "Patron" WHERE active = true GROUP BY rid) '+
       'as P on R.rid = P.rid ORDER BY R.rid;'});

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

      //var q = client.query({ name:'get_restaurant', text: 'SELECT * FROM "Restaurant" ' +
      //  ' WHERE rid = ' + rid + ';'});

      var q = client.query({ name:'get_restaurants',
       text: 'SELECT name, R.rid, telephone, website, logo_url, description, lat, long, '+
       'capacity, address, P."active_patrons" from "Restaurant" R LEFT OUTER JOIN '+
       '(SELECT rid, count(*) AS "active_patrons" FROM "Patron" WHERE active = true GROUP BY rid) '+
       'as P on R.rid = P.rid WHERE R.rid = ' + rid + 'ORDER BY R.rid;'});

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

  retrieveActivePatrons: function(res){
    pg.connect(dbh.conString, function(err, client, done){

      if(dbh.handleError(err, client, done, null)) return;

      var q = client.query({ name:'get_patrons', 
        text: 'Select * FROM "Patron" WHERE active;'}); 

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
  },

  littlesLaw: function(){
    pg.connect(dbh.conString, function(err, client, done){

      if(dbh.handleError(err, client, done, null)) return;

      var q = client.query({ name:'get_patrons', 
        text: 'Select * FROM "Patron" WHERE active;'}); 

      q.on('row', function(row, result) {
        result.addRow(row);
      });

      q.on('err', function(err) {
        dbh.handleError(err, client, done, res);
      });

      q.on('end', function(result) {
        done(client);
        calculateLittlesLaw(result.rows);
      });
    });
  },

  updatePatrons: function(rid, data){
    pg.connect(dbh.conString, function(err, client, done){

      console.log("Displaing active patrons for rid:" + rid);
      console.log(data);
      if(dbh.handleError(err, client, done, null)) return;

      var q = client.query({ name:'get_patrons', 
        text: 'Select * FROM "Littles_law" WHERE rid = ' + rid + ';'}); 

      q.on('row', function(row, result) {
        result.addRow(row);
      });

      q.on('err', function(err) {
        dbh.handleError(err, client, done, res);
      });

      q.on('end', function(result) {
        done(client);

        // calculate if we need 
        // arrival_rate current_patrons / time_elapsed_since_last_update
        // avg_time is from database
        // amount_to_remove = current_patrons - arrival_rate * avg_time
        avg_time = result.rows[0].avg_time;
        last_checked = result.rows[0].last_checked;
        current_patrons = data[0]; //total patrons is stored here
        var old_time = new Date(last_checked);
        var new_time = new Date();
        //new_time = new_time.getTime() - (new_time.getTimezoneOffset() * 60000);
        console.log("old time " + old_time.getTime());
        console.log("new time " + new_time);
        console.log("diff: " + (old_time.getTime() - new_time.getTime()));
        var elapsed = ((((old_time.getTime() - new_time.getTime())/1000)/60)/60); //convert to hours
        console.log("elapsed: " + elapsed);
        var arrival_rate = current_patrons / elapsed;
        var amount_to_remove = current_patrons - (arrival_rate * avg_time);
        console.log("We need to remove: " + amount_to_remove);
        console.log("Arrival rate: " + arrival_rate);
        console.log(current_patrons);
        //calculateLittlesLaw(result.rows);

        var proper_new = new_time.toISOString().replace('T', ' ');
        proper_new = proper_new.replace('Z', '');
        console.log("proper time: " + proper_new);

        var count = 0;
        for(var i = 1; i < data.length; i++){
        //console.log(data[pid]);
          var pid = data[i];
          if(count > amount_to_remove || amount_to_remove < 1){
            break;
          }else{
            //update patron and make it not active, give it a time_out
            count++;
            pg.connect(dbh.conString, function(err, client, done){

              if(dbh.handleError(err, client, done, null)) return;

              var q = client.query({ name:'get_patrons', 
                text: 'UPDATE "Patron" set time_out = ' +
                "\'" + proper_new + "\'" + ', active = FALSE WHERE pid = ' + pid + ';'}); 

              q.on('err', function(err) {
                dbh.handleError(err, client, done, res);
              });

              q.on('end', function(result) { //q.on 1
                done(client);
                //finally update the littles law table
                pg.connect(dbh.conString, function(err, client, done){

                  if(dbh.handleError(err, client, done, null)) return;

                  var q = client.query({ name:'get_patrons', 
                    text: 'UPDATE "Littles_law" set last_checked = ' +
                    "\'" + proper_new + "\'" + ' WHERE rid = ' + rid + ';'}); 

                  q.on('err', function(err) {
                    dbh.handleError(err, client, done, res);
                  });

                  q.on('end', function(result) {
                    done(client);
                  });
                });
              });//q.on 1
            });
          }//end else statement
        }
      });
    });
  }//end patrons
};

//find the shortest average wait and use that for the timeout
//Little's Law tells us that the average number of customers
//in the store L, is the effective arrival rate λ, times the 
//average time that a customer spends in the store W, or simply:
function calculateLittlesLaw(data){
    //console.log("Called littles law");
    //code before the pause
    var twodee = [];

    for(var i = 0; i < data.length; i++){
      twodee[data[i].rid] = [];
      twodee[data[i].rid][0] = 0;
    }

    console.log(twodee);

    for(var i = 0; i < data.length; i++){
      console.log(data[i].rid);
      var index = ++twodee[data[i].rid][0]; //total hack
      twodee[data[i].rid][index] = data[i].pid;
      //console.log(twodee[data[i].rid][index]);
    }
    console.log("\n\n");
    console.log(twodee.length);

    for(var rid = 0; rid < twodee.length; rid++){
      //calculate if we need 
      // arrival_rate current_patrons / time_elapsed_since_last_update
      // avg_time is from database
      // amount_to_remove = current_patrons - arrival_rate * avg_time
      if(typeof twodee[rid] == 'undefined'){
        console.log("index " + rid +" was undefined");
      }else{
        //if you made it here, then i is an rid that has active patrons
        db_helpers.updatePatrons(rid, twodee[rid]);
      }
    }

    var update_interval = 0;//updates the patrons in miliseconds
    setTimeout(function(){
      //do what you need here
      db_helpers.littlesLaw();
      }, update_interval);
}

module.exports = db_helpers;