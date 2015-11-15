var app = angular.module('live-map-app', []);
var heat_dot_radius = 25;

// Create all of the markers for each restaurant
var create_markers = function(map, data) {
  var markers = [];
  for(var i = 0, len = data.length; i < len; i++) {
    var new_marker = L.marker([data[i].lat, data[i].long]);
    new_marker.bindPopup('<h2><a href="/res/' + data[i].rid + '">' + data[i].name +
      '</a></h2><br>' +
      '<h4>Current Customers: ' + data[i].active_patrons + ' / ' + data[i].capacity +
      '</h4><br>');
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
    var map = L.map('map').setView([39.683421, -75.751226], 18);

    // Add the MapBox map data
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'jerkeeler.ciezvjb551emgskm3sptep0iu',
        accessToken: 'pk.eyJ1IjoiamVya2VlbGVyIiwiYSI6ImNpZXp2amNhdDFlYzBzaGtyNG1yYXd1YmsifQ.NuTiQ7Dkv5-f2_9ajTzZZw'
    }).addTo(map);

    // MAKE API REQUEST TO GRAB ALL THE DATA FOR RESTAURANTS
    /*
    $http.get('/api/respop').success(function(data) {
      var markers = create_markers(map, dummy_data);
      var heat = generateHeatLayer(map, dummy_data);
    });*/

    /*
    $http.get('/api/flashdeals').success(function(data) {
      $scope.deals = data;
    });
    */

    var dummy_data = [
      { name: "Newark Deli & Bagels", rid: 1, lat: 39.683231, long: -75.752073,
      capacity: 20, active_patrons: 20 },
      { name: "Cal Tor", rid: 2, lat: 39.683068, long: -75.751104, capacity: 50,
      active_patrons: 40 },
      { name: "Trabant Chapel", rid: 3, lat: 39.682760, long: -75.754585,
      capacity: 100, active_patrons: 100 }
    ];

    var markers = create_markers(map, dummy_data);
    var heat = generateHeatLayer(map, dummy_data);

    var dummy_deals = [
      
    ];
    $scope.deals = dummy_deals;
  }
]);
