// Load up express and all required middleware
var express    = require('express');
    app        = express();
    path       = require('path');
    bodyParser = require('body-parser');
    passport   = require('passport');
    googlePass = require('passport-google-oauth').OAuth2Strategy;
    cookies    = require('cookie-parser');
    session    = require('express-session');
    pgStore    = require('connect-pg-simple')(session);
    //dbCon      = require('./config/db');

// =============================================================================
// EXPRESS CONFIGURATION
// =============================================================================
// Define where our static files will be found and views are held
app.use(express.static(path.resolve('src/client')));
app.set('views', path.resolve('src/client/html'));

// Add body parser to parse requests easiers
app.use(bodyParser.json());

// Connect to the postgres database for sessions
//var conString = 'postgres://' + dbCon.user + ':' + dbCon.pass + '@localhost/' +
  //dbCon.db;

app.use(cookies());
app.use(session({
    secret: 'adfhsadfjkashdnfceo',
    resave: false,
    saveUninitialized: true,
    // store: new pgStore({
    //   conString: conString
    // }),
    cookie: { maxAge: 1 * 60 * 60 * 1000 }
}));

// Set our rendering engine to EJS
app.set('view engine', 'ejs');

// =============================================================================
// ROUTES
// =============================================================================
var main_router = require('./main_router');
var api_router = require('./api_router');

app.use('/', main_router);
app.use('/api', api_router);

// Catch all other calls and return a 404 page and status
app.get('*', function(req, res, next) {
  res.status(404);
  res.send('404');
});

module.exports = app;
