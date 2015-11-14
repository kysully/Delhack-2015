var router = require('express').Router();
    pg     = require('pg');

router.get('/', function(req, res, next) {
  res.json({"message": "welcome"});
})

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
