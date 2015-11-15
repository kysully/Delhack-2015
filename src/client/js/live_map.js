var app = angular.module('live-map-app', []);
var heat_dot_radius = 25;

// Create all of the markers for each restaurant
var create_markers = function(map, data) {
  var markers = [];
  for(var i = 0, len = data.length; i < len; i++) {
    var new_marker = L.marker([data[i].lat, data[i].long]);
    new_marker.bindPopup('<img class="popup_img" src="' + data[i].logo_url + '" alt="' + data[i].name + ' logo ">' +
      '<h2 class="popup_header"><a href="/res/' + data[i].rid + '">' + data[i].name +
      '</a></h2><br>' +
      '<h4 class="popup_customers">Current Customers: ' + data[i].active_patrons + ' / ' + data[i].capacity +
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

var visitUrl = function(url) {
  document.location.href = url;
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

    $scope.visitDeal = function(fid) {
      visitUrl('/flashdeals/' + fid);
    }

    // MAKE API REQUEST TO GRAB ALL THE DATA FOR RESTAURANTS
    /*
    $http.get('/api/respop').success(function(data) {
      var markers = create_markers(map, data);
      var heat = generateHeatLayer(map, data);
    });*/

    /*
    $http.get('/api/flashdeals').success(function(data) {
      $scope.deals = data;
    });
    */

    var dummy_data = [
      { name: "Newark Deli & Bagels", rid: 1, lat: 39.683231, long: -75.752073,
      capacity: 20, active_patrons: 20, logo_url: "http://www.newarkdeliandbagels.com/images/newark-deli-and-bagels-logo.gif" },
      { name: "Cal Tor", rid: 2, lat: 39.683068, long: -75.751104, capacity: 50,
      active_patrons: 40, logo_url: "www.temp.com/logo" },
      { name: "Trabant Chapel", rid: 3, lat: 39.682760, long: -75.754585,
      capacity: 100, active_patrons: 100, logo_url: "www.temp.com/logo" }
    ];

    var markers = create_markers(map, dummy_data);
    var heat = generateHeatLayer(map, dummy_data);

    var dummy_deals = [
      {r_name: "Newark Deli & Bagels", f_name: "5% off any bagel",
      description: "Receive 5% off any bagel in the next hour. 1 coupon per person.",
      code: "NID-83W", fid: 6,
      start_date: "", end_date: ""}
    ];

    $scope.deals = dummy_deals;
  }
]);

var update_cap_colors = function(active, cap) {
  $('#cap').removeClass('normal_cap');
  $('#cap').removeClass('high_cap');
  $('#cap').removeClass('max_cap');

  var percent = active / cap;
  if(percent < .6) {
    $('#cap').addClass('normal_cap');
  }
  if(percent >= .6 && percent <= .85) {
    $('#cap').addClass('high_cap');
  }
  if(percent > .85) {
    $('#cap').addClass('max_cap');
  }
};

app.controller('RestaurantController', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    $scope.res = {
      name: "Newark Deli & Bagels",
      rid: window.location.href.split("/").pop(),
      telephone: "302-xxx-xxxx",
      website: "www.ndb.com",
      logo_url: "http://www.newarkdeliandbagels.com/images/newark-deli-and-bagels-logo.gif",
      description: "The best bagel shop ever :)",
      active_patrons: 18,
      capacity: 20,
      lat: 39.683231,
      long: -75.752073,
      address: "35 E. Main Street, Newark DE, 19711"
    };

    var dummy_deals = [
      {r_name: "Newark Deli & Bagels", f_name: "5% off any bagel",
      description: "Receive 5% off any bagel in the next hour. 1 coupon per person.",
      code: "NID-83W", fid: 6,
      start_date: "", end_date: ""}
    ];

    $scope.deals = dummy_deals;

    // Create the leaflet map
    var map = L.map('minimap').setView([$scope.res.lat, $scope.res.long], 17);

    // Add the MapBox map data
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'jerkeeler.ciezvjb551emgskm3sptep0iu',
        accessToken: 'pk.eyJ1IjoiamVya2VlbGVyIiwiYSI6ImNpZXp2amNhdDFlYzBzaGtyNG1yYXd1YmsifQ.NuTiQ7Dkv5-f2_9ajTzZZw'
    }).addTo(map);

    var new_marker = L.marker([$scope.res.lat, $scope.res.long]);
    new_marker.addTo(map);
    update_cap_colors($scope.res.active_patrons, $scope.res.capacity);

    $scope.visitDeal = function(fid) {
      visitUrl('/flashdeals/' + fid);
    }

    /*
    $http.get('/api/res/' + $scope.rid).success(function(data) {
      $scope.res = data;
      update_cap_colors($scope.res.active_patrons, $scope.res.capacity);
    });

    $http.get('/api/res/' + $scope.rid + '/flashdeals').success(function(data) {
      $scope.deals = data;
    });
    */
  }
]);

app.controller('DealsController', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    $scope.deals = [

    ];

    var dummy_deals = [
      {r_name: "Newark Deli & Bagels", f_name: "5% off any bagel",
      description: "Receive 5% off any bagel in the next hour. 1 coupon per person.",
      code: "NID-83W", fid: 6,
      start_date: "", end_date: ""},
      {r_name: "Cal Tor", f_name: "FREE BURRITO", description: 'Get a free ' +
      'burrito today!', code:'POOPLOOP1', fid:7, start_date:"", end_date:""}
    ];

    $scope.deals = dummy_deals;
    $scope.visitDeal = function(fid) {
      visitUrl('/flashdeals/' + fid);
    }
    /*
    $http.get('/api/flashdeals').success(function(data) {
      $scope.deals = data;
    });
    */
  }
]);

app.controller('DealController', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    var fid = window.location.href.split("/").pop();

    var dummy_deal = {r_name: "Newark Deli & Bagels", f_name: "5% off any bagel",
          description: "Receive 5% off any bagel in the next hour. 1 coupon per person.",
          code: "NID-83W", fid: 6,
          start_date: "", end_date: ""}

    $scope.deal = dummy_deal;
    // Grab restaurant data?

    /*
    $http.get('/api/flashdeal/' + fid).success(function(data) {

    });
    */
  }
]);

var update_cap_colors2 = function(active, cap, index) {
  $('#cap' + index).removeClass('normal_cap');
  $('#cap' + index).removeClass('high_cap');
  $('#cap' + index).removeClass('max_cap');

  var percent = active / cap;
  if(percent < .6) {
    $('#cap' + index).addClass('normal_cap');
  }
  if(percent >= .6 && percent <= .85) {
    $('#cap' + index).addClass('high_cap');
  }
  if(percent > .85) {
    $('#cap' + index).addClass('max_cap');
  }
}

app.controller('ResListController', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    var dummy_data = [
      { name: "Newark Deli & Bagels", rid: 1, lat: 39.683231, long: -75.752073,
      capacity: 20, active_patrons: 20, logo_url: "http://www.newarkdeliandbagels.com/images/newark-deli-and-bagels-logo.gif",
      address: "1 Sparrow Lane"},
      { name: "Cal Tor", rid: 2, lat: 39.683068, long: -75.751104, capacity: 50,
      active_patrons: 40, logo_url: "www.temp.com/logo",
      address: "2 Sparrow Lane" },
      { name: "Trabant Chapel", rid: 3, lat: 39.682760, long: -75.754585,
      capacity: 100, active_patrons: 100, logo_url: "www.temp.com/logo",
      address: "1 Sparrow Lane"}
    ];

    $scope.restaurants = dummy_data;

    for(var i = 0, len = $scope.restaurants.length; i < len; i++) {
      update_cap_colors2($scope.restaurants[i].active_patrons, $scope.restaurants[i].capacity, i);
    }
    /*
    $http.get('/api/res').success(function(data) {
      $scope.restaurants = data;

      for(var i = 0, len = $scope.restaurants.length; i < len; i++) {
        update_cap_colors2($scope.restaurants[i].active_patrons, $scope.restaurants[i].capacity, i);
      }
    });
    */
  }
]);
