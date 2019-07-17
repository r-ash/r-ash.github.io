function getJsonData(path, callback) {
	$.ajax({
		type: "GET",
		url: path,
		dataType: "text",
		success: function(response) {
			var jsonData = jQuery.parseJSON(response);
			console.log("successfully loaded prevalence data");
			callback(jsonData);
		}
	});
}

var data = [];
getJsonData("data/district_prev.json", function(text) {
	filterData(text);
});

var rainbow;
function filterData(text) {
	var counter = 0;
	var minPrev = 1;
	var maxPrev = 0;
	for (var i = 0; i < text.length; i++) {
  	var obj = text[i];
  	if (obj.agegr == "15-49" &&
  		obj.period == "2018 Q3" && obj.sex == "both" && 
  		obj.survey_prevalence == "both") {
  		data[counter] = obj;
  	  counter = counter + 1;
  	  if (obj.mean < minPrev) {
  	  	minPrev = obj.mean;
  	  }
  	  if (obj.mean > maxPrev) {
  	  	maxPrev = obj.mean;
  	  }
  	}
  }

  initRainbow(minPrev, maxPrev);
}

function initRainbow(min, max) {
	rainbow = new Rainbow();
  rainbow.setSpectrum("#f7fcb9", "#addd8e", "#31a354");
  rainbow.setNumberRange(min, max);
}

function getPrevalence(district) {
  for (var i = 0; i < data.length; i++) {
  	var obj = data[i];
  	if (obj.district == district) {
  		return(obj.mean)
  	}
  }
}

var mymap = L.map('map').setView([-13.2543, 34.3015], 7);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

function getColour(d) {
	return '#' + rainbow.colourAt(d);
}

function style(feature) {
	var prevalence = getPrevalence(feature.properties.district)

	return {
		fillColor: getColour(prevalence),
		weight: 2,
		opactiy: 1,
		fillOpacity: 0.9,
		color: 'grey'
	};
}

var geojson;

// Info box top right
var info = L.control();

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function(props) {
	this._div.innerHTML = '<h4>Malawi Prevalence</h4>' +  (props ?
        '<b>' + props.district + '</b><br />Mean prevalence: ' + 
        getPrevalence(props.district) : 'Hover over a region');
};

info.addTo(mymap);

// Highlighting region on mouse over
function highlightFeature(e) {
	var layer = e.target;
	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});
}

geojson = new L.GeoJSON.AJAX("data/malawi.geojson", {
	style: style,
  onEachFeature: onEachFeature
});
geojson.addTo(mymap);


// Legend
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function(map) {
// 	var div = L.DomUtil.create('div', 'info legend'),
// 	  grades = [0, 10, 20, 50, 100, 200, 500, 1000],
//     labels = [];

//   for (var i = 0; i < grades.length; i++) {
//     div.innerHTML +=
//       '<i style="background:' + getColour(grades[i] + 1) + '"></i> ' +
//       grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//   }

//   return div;
// }

// legend.addTo(map);