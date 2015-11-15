var router = require('express').Router();
    pg     = require('pg');
    dbh    = require('./db_helper');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

router.get('/', function(req, res, next) {
  res.json([{message: "welcome"}]);
});


  //==============//
 //     GET      //
//==============//


// STATUS: Un-implemented
/**
* => GET /res
* <= JSON {[{name: "name", rid: 0, telephone: "302-xxx-xxxx",
*  website: "www.food.com", logo_url: "someurl.com", description: "we serve food"
* active_patrons: 0, current_flash_deals: [{fid: "0", code: "x212", description: "5% off"}] }]}
*
* - returns all the info for all the restaurants
*/
router.get('/res', function(req, res, next) {

	//var jsonToReturn = {status: "NOT implemented"};
	dbh.retrieveRestaurants(res);
  //res.json(jsonToReturn);
});

// STATUS: Implemented
/**
* => GET /res/:rid
* <= JSON {name: "name", rid: 0, telephone: "302-xxx-xxxx",
*  website: "www.food.com", logo_url: "someurl.com", description: "we serve food"
* active_patrons: 0, current_flash_deals: [{fid: "0", code: "x212", description: "5% off"}] }
*
* - returns all the info for the restaurants matching
* the given rid
*
* - also returns number of active 
* patrons in given restaurant
*/
router.get('/res/:rid', function(req, res, next) {
  //var jsonToReturn = {status: "NOT implemented"};
	dbh.retrieveRestaurant(res, req.params.rid);
  //res.json(jsonToReturn);
});

// STATUS: Implemented
/**
* => GET /res/:rid/admin
* <= JSON {name: "name", rid: 0, telephone: "302-xxx-xxxx",
*  website: "www.food.com", logo_url: "someurl.com", description: "we serve food"
* active_patrons: 0, flash_deals: [{fid: "0", code: "x212", description: "5% off"}] }
*
* - returns all the info for the restaurants matching
* the given rid
*
*/
router.get('/res/:rid/admin', function(req, res, next) {
	//check priviledges first
	var jsonToReturn = {status: "NOT implemented"};

  res.json(jsonToReturn);
});

// STATUS: Implemented
/**
* => GET /res/:rid/flashdeals
* <= JSON {name: "name1", current_flash_deals: [{fid: 0, code: "x212", description: "5% off"}] }
*
* - returns a lis of all current flashdeals for the given restaurant
*/
router.get('/res/:rid/flashdeals', function(req, res, next) {
  //var jsonToReturn = {status: "NOT implemented"};
  dbh.retrieveActiveFlashDeals(res, req.params.rid);
  //res.json(jsonToReturn);
});

// STATUS: Implemented
/**
* => GET /res/:rid/hitorical
* <= JSON {name: "name",  patrons: [{pid: 0, time_in: "12:00am",
*          time_out: "12:00pm", active: false}] }
*
* - returns all the patrons ever at the restaurant
*/
router.get('/res/:rid/historical', function(req, res, next) {
  //var jsonToReturn = {status: "NOT implemented"};
  dbh.retrieveHistorical(res, req.params.rid);
  //res.json(jsonToReturn);
});

// STATUS: Implemented
/**
* => GET /flashdeals
* <= JSON { [{name: "name1", current_flash_deals: [{fid: 0, code: "x212", description: "5% off"}]}] }
*
* - returns all the active flash deals
*/
router.get('/flashdeals', function(req, res, next) {
	//Note, the function here should call the res/:rid/flashdeals function for all restaurants
  //var jsonToReturn = {status: "NOT implemented"};
	dbh.retrieveAllActiveFlashDeals(res);
  //res.json(jsonToReturn);
});

// STATUS: Implemented
/**
* => GET /flashdeals/:fid
* <= JSON { {name: "name1", rid: 0,  flash_deal: {fid: 0, code: "x212", description: "5% off"}}
*
* - returns a single flash deal and restaurant name
*/
router.get('/flashdeals/:fid', function(req, res, next) {
	//Note, the function here should call the res/:rid/flashdeals function for all restaurants
  //var jsonToReturn = {status: "NOT implemented"};
  dbh.retrieveFlashDeal(res, req.params.fid);
  //res.json(jsonToReturn);
});

// STATUS: Implemented
/**
* => GET /respop
* <= JSON { [{name: "name1", active_patrons: 0}, {name: "name2", active_patrons: 0}] } 
*
* - returns all restaurants names with the number of 
* active patrons per restaurant respectively
*/

router.get('/respop', function(req, res, next) {
  //var jsonToReturn = {status: "NOT implemented"};
  dbh.retrieveResPop(res);
  //res.json(jsonToReturn);
});


  //==============//
 //     POST     //
//==============//

// STATUS: Un-implemented
/**
* => POST /respop/hitorical
*    body: {date: "date", time: "timestamp"}
* <= JSON { [{name: "name1", patrons: 0}, {name: "name2", patrons: 0}] } 
*
* - returns all the patrons at the restaurant based on the given time
*/
router.post('/res/:rid/historical', function(req, res, next) {
  res.body();
});

// STATUS: Implemented
/**
* => POST /res/:rid/flashdeal
*    body: {name: "name", decription: "hi", start_date: "12:00am", end_date: "12:00pm",
*           active: "TRUE", code: "ABC-123"}
* <= JSON { status: "ok" } 
*
* - post request to create a new flashdeal
*
* - returns a status, ok if success, denied is no priviledge
*/
router.post('/res/:rid/flashdeal', function(req, res, next) {
	//check priviledges
	//connect to database to make a new flashdeal in the database
  dbh.postFlashDeal(res, req.params.rid, req.body);
});

// STATUS: Implemented
/**
* => POST /res/:rid/patron
*    body: {time_in: "12:00am"}
* <= JSON { status: "ok" } 
*
* - post request to create a new patron
*/
router.post('/res/:rid/patron', function(req, res, next) {
	//check priviledges
	//connect to database to make a new patron in the database
  dbh.postPatron(res, req.params.rid, req.body);
});


  //==============//
 //    UPDATE    //
//==============//

//no functions

  //==============//
 //    DELETE    //
//==============//

//no functions

module.exports = router;

// Use pg client pool for better efficiency
// pg.connect(dbh.conString, function(err, client, done) {
//   if(dbh.handleError(err, client, done, res)) return;
//
//   // Create prepared statement for repeated use
//   // Grab the latest 5 posts from the database and return their summary
//   // information
//   q = client.query({ name:'get_posts', text: 'SELECT id, title, summary, ' +
//   'created_at, tags FROM summary_posts ' +
//   'ORDER BY created_at DESC LIMIT 5 OFFSET $1;', values: [0] });
//
//   q.on('row', function(row, result) {
//     result.addRow(row);
//   });
//
//   q.on('err', function(err) {
//     dbh.handleError(err, client, done, res);
//   });
//
//   q.on('end', function(result) {
//     done(client);
//
//     // Format the post summaries and add it to the data to be passed to the
//     // view
//     var formatted_result = format_summary_result(result.rows);
//
//     data = {
//       posts: formatted_result,
//       nav_class: '',
//       page_num: 1
//     };
//
//     // Generate the sidebar content
//     create_sidebar(req, res, next, data);
//   });
// });
