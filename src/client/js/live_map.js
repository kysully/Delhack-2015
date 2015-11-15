var app = angular.module('live-map-app', []);
var heat_dot_radius = 25;

// Accumulate all of the flash deals into a nice array for display at the bottom
// of the page
var accumulate_deals = function(data) {
  var deals = [];
  for(var i = 0, len = data.length; i < len; i++) {
    for(var j = 0, lenj = data[i].current_flash_deals.length; j < lenj; j++) {
      deals.push(data[i].current_flash_deals[j]);
    }
  }
  return deals;
}

// Create all of the markers for each restaurant
var create_markers = function(map, data) {
  var markers = [];
  for(var i = 0, len = data.length; i < len; i++) {
    var new_marker = L.marker([data[i].lat, data[i].long]);
    new_marker.bindPopup('<b>' + data[i].name + '</b><br>' +
      'Website: ' + data[i].website + '<br>' +
      '# Current Customers: ' + data[i].active_patrons + '<br>' +
      '');
    new_marker.addTo(map);
    markers.push(new_marker);
  }
  return markers;
}

// Generate the heat map of all of the data
var generateHeatLayer = function(map, data) {
  var heat_points = [];
  for(var i = 0, len = data.length; i < len; i++) {
    var intensity = data[i].active_patrons / data[i].capacity;
    heat_points.push([data[i].lat, data[i].long, intensity]);
  }
  var heatLayer = L.heatLayer(heat_points, {radius: heat_dot_radius}).addTo(map);
  return heatLayer;
}

app.controller('MapController', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    // Create the leaflet map
    var map = L.map('map').setView([39.683421, -75.751226], 17);

    // Add the MapBox map data
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'jerkeeler.ciezvjb551emgskm3sptep0iu',
        accessToken: 'pk.eyJ1IjoiamVya2VlbGVyIiwiYSI6ImNpZXp2amNhdDFlYzBzaGtyNG1yYXd1YmsifQ.NuTiQ7Dkv5-f2_9ajTzZZw'
    }).addTo(map);

    // MAKE API REQUEST TO GRAB ALL THE DATA FOR RESTAURANTS
    // $http.get('/api/res').success(function(data) {
    //
    // });
    var dummy_data = [
      { name: "Newark Deli & Bagels", rid: 1, telephone: "302-xxx-xxxx",
      website: "www.ndb.com", logo_url: "www.ndb.com/logo",
      capacity: 20,
      description: "Best bagel shop in town!", lat: 39.683231,
      long: -75.752073, active_patrons: 20, current_flash_deals: [
        {fid: 0, code: "AXCADSF", description: "5% off", start_date: "",
        end_date: ""}
      ]},

      {name: "Cal Tor", rid: 2, telephone: "302-xxx-xxxx",
      website: "www.caltor.com", logo_url: "www.caltor.com/logo",
      capacity: 50, description: "BEST MEX EVER!", lat: 39.683068,
      long: -75.751104, active_patrons: 40, current_flash_deals: []},

      {name: "Trabant Chapel", rid: 3, telephone: "302-xxx-xxx",
      website: "www.chapel.com", logo_url: "www.chapel.com/logo",
      capcity: 100, description: "BEST HACKATHON EVER!", lat: 39.682760,
      long: -75.754585, active_patrons: 1, current_flash_deals: []}
    ]


    var deals = accumulate_deals(dummy_data);
    var markers = create_markers(map, dummy_data);
    var heat = generateHeatLayer(map, dummy_data);

    $scope.deals = deals;
  }
]);
