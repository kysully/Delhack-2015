// Require the express app from our server directory and the http module in
// order to create a server out of it.
var app  = require('./src/server/app');
    http = require('http');

// Determine the port number
var port = 3000;

// Create the server using http module
var server = http.createServer(app);

// Start the Server
server.listen(process.env.PORT || port, process.env.IP || '0.0.0.0', function() {
  var address = server.address();
  console.log('Server is now started on ', address.address + ':' + address.port);
});

//find the shortest average wait and use that for the timeout
//Little's Law tells us that the average number of customers
//in the store L, is the effective arrival rate λ, times the 
//average time that a customer spends in the store W, or simply:
function littlesLaw()
{
   //apply the forumla here
   var L, A, W;
   setTimeout(littlesLaw, 60000);//once per minute?
}

littlesLaw();
