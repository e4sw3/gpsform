var formId = '';
var nameCode = 'entry.';
var nameCoord = 'entry.';

var formId = '1ZOm8rm6010TJwfmlqcaEkzFcj6vsSgTSaCdW2pyUG_c';
var nameCode = 'entry.71470181';
var nameCoord = 'entry.1551416708';




function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return decodeURIComponent(pair[1]);}
  }
  return '';
}

//Initialize the map
var map = L.map('map');
map.setView([45,10], 8);

//Add a basemap
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Add Location Options - override the plugin default popup and circle
var locOptions = {
    drawCircle: false,
    showPopup: false,
    follow:true,
};
//Add Location
var loc = L.control.locate(locOptions).addTo(map);
//Enable Location at page load and do things once the location is found
loc.start();

var marker, circle, lat, lng; //create variables used throughout the map
function collectData(e) {
    //console.log(e);
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    var code = getQueryVariable('code')

    var popupTemplate = $("#popup-template").html();
    var popupHtml = Mustache.render(popupTemplate, {code});

    if (e.accuracy) {
      var radius = (e.accuracy / 2) * 0.6;
      circle = L.circle(e.latlng, radius).addTo(map);
    }
    marker = L.marker(e.latlng).addTo(map).bindPopup(popupHtml, {maxWidth:230}, {maxHeight:200});
    
    //if you try and open the popup right away the location may not be ready, eventhough it's firing after locationfound
    setTimeout(function() {
      marker.openPopup();
      loc.stop();
    }, 100);

    marker.on('popupopen', function() {
      $('#projectform').submit(function(event) {
        event.preventDefault();

        if (code) {
          var queryparams = {'submit': 'Submit'};
          queryparams[nameCode] = code;
          queryparams[nameCoord] = lat + ' ' + lng;
          var querystring = $.param(queryparams)

          var iframeTemplate = $("#iframe-template").html();
          var iframeHtml = Mustache.render(iframeTemplate, {formId, querystring});
          $('#formdiv').html(iframeHtml);

        } else {
          $('#formHelp').html('<span style="color:red;">Errore: non è presente nessun Codice POS.</span>')
        }
      });
    });

    if (marker) {
      marker.on('popupclose', function() {
        map.removeLayer(marker);
        if (map.hasLayer(circle)) {
          map.removeLayer(circle);
        }
      });
    }
}

map.on('locationfound', function(e) {
    collectData(e);
});

map.on('click', function(e) {
    collectData(e);
});
