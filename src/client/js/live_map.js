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
    $http.get('/api/respop').success(function(data) {
      var markers = create_markers(map, data);
      var heat = generateHeatLayer(map, data);
    });

    $http.get('/api/flashdeals').success(function(data) {
      $scope.deals = data;
    });

    // var dummy_data = [
    //   { name: "Newark Deli & Bagels", rid: 1, lat: 39.683231, long: -75.752073,
    //   capacity: 20, active_patrons: 20, logo_url: "http://www.newarkdeliandbagels.com/images/newark-deli-and-bagels-logo.gif" },
    //   { name: "Cal Tor", rid: 2, lat: 39.683068, long: -75.751104, capacity: 50,
    //   active_patrons: 40, logo_url: "www.temp.com/logo" },
    //   { name: "Trabant Chapel", rid: 3, lat: 39.682760, long: -75.754585,
    //   capacity: 100, active_patrons: 100, logo_url: "www.temp.com/logo" }
    // ];
    //
    // var markers = create_markers(map, dummy_data);
    // var heat = generateHeatLayer(map, dummy_data);
    //
    // var dummy_deals = [
    //   {r_name: "Newark Deli & Bagels", f_name: "5% off any bagel",
    //   description: "Receive 5% off any bagel in the next hour. 1 coupon per person.",
    //   code: "NID-83W", fid: 6,
    //   start_date: "", end_date: ""}
    // ];
    //
    // $scope.deals = dummy_deals;
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
    var rid = window.location.href.split("/").pop();
    $scope.res = {
    };

    var dummy_deals = [
    ];

    $scope.visitDeal = function(fid) {
      visitUrl('/flashdeals/' + fid);
    }

    $http.get('/api/res/' + rid).success(function(data) {
      data = data[0];
      console.log(data);
      $scope.res = data;

      // Create the leaflet map
      var map = L.map('minimap').setView([data.lat, data.long], 17);

      // Add the MapBox map data
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18,
          id: 'jerkeeler.ciezvjb551emgskm3sptep0iu',
          accessToken: 'pk.eyJ1IjoiamVya2VlbGVyIiwiYSI6ImNpZXp2amNhdDFlYzBzaGtyNG1yYXd1YmsifQ.NuTiQ7Dkv5-f2_9ajTzZZw'
      }).addTo(map);

      var new_marker = L.marker([data.lat, data.long]);
      new_marker.addTo(map);
      update_cap_colors(data.active_patrons, data.capacity);
    });

    $http.get('/api/res/' + rid + '/flashdeals').success(function(data) {
      $scope.deals = data;
    });
  }
]);

app.controller('DealsController', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    $scope.deals = [
    ];
    $scope.visitDeal = function(fid) {
      visitUrl('/flashdeals/' + fid);
    }
    $http.get('/api/flashdeals').success(function(data) {
      $scope.deals = data;
    });
  }
]);

app.controller('DealController', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    var fid = window.location.href.split("/").pop();

    $scope.deal = {};
    // Grab restaurant data?

    $http.get('/api/flashdeals/' + fid).success(function(data) {
      $scope.deal = data[0];
      console.log(data[0]);
    });
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
    $scope.restaurants = [];
    $http.get('/api/res').success(function(data) {
      console.log(data);
      $scope.restaurants = data;

      for(var i = 0, len = $scope.restaurants.length; i < len; i++) {
        update_cap_colors2($scope.restaurants[i].active_patrons, $scope.restaurants[i].capacity, i);
      }
    });
  }
]);

app.controller('ButtonController', ['$scope', '$location', '$http',
  function($scope, $locaiton, $http) {
    $scope.rid = -1;
    $scope.buttonPress = function() {
      var date_now = new Date();
      var now = date_now.toISOString().replace('T', ' ');
      now = now.replace('Z', '');
      var body = {
        time_in: "\'" + now + "\'",
        active: true,
        time_out: "",
      }
      console.log(now);
      $http.post('/api/res/' + $scope.rid + '/patron', body);
    }
  }
]);

app.controller('DealInputController', ['$scope', '$location', '$http',
  function($scope, $location, $http) {
    $scope.new_flash = {
      active: true
    };
    $scope.start_date = null;
    $scope.start_time = null;
    $scope.end_date = null;
    $scope.end_time =null;

    $scope.add_new_flash_deal = function() {
      var start_string = '\'' + $scope.start_date.getFullYear() + '-' +
        ($scope.start_date.getMonth() + 1) + '-' + $scope.start_date.getDate() +
        ' ' + $scope.start_time.getHours() + ':' + $scope.start_time.getMinutes() +
        ':' + $scope.start_time.getSeconds() + '\'';

      var end_string = '\'' + $scope.end_date.getFullYear() + '-' +
        ($scope.start_date.getMonth() + 1) + '-' + $scope.end_date.getDate() +
        ' ' + $scope.end_time.getHours() + ':' + $scope.end_time.getMinutes() +
        ':' + $scope.end_time.getSeconds() + '\'';

      $scope.new_flash.start_date = start_string;
      $scope.new_flash.end_date = end_string;
      $scope.new_flash.name = '\'' + $scope.new_flash.name + '\'';
      $scope.new_flash.description = '\'' + $scope.new_flash.description + '\'';
      $scope.new_flash.code = '\'' + $scope.new_flash.code + '\'';

      $http.post('/api/res/' + $scope.new_flash.rid + '/flashdeal', $scope.new_flash).success(function(data) {
        console.log('boop');
      });

      console.log($scope.new_flash);
    }
  }
]);
