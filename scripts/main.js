
var mymap = L.map('map').setView([-13.2543, 34.3015], 7);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

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
	if (typeof props !== 'undefined') {
		var prev = getPrevalence(props.district);
	  if (typeof prev == 'undefined') {
	  	prev = 'No prevalence data for this set of filters';
	  }
  }
	this._div.innerHTML = '<h4>Malawi Prevalence</h4>' +  (props ?
        '<b>' + props.district + '</b><br />Mean prevalence: ' + 
        prev : 'Hover over a region');
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

function restyleLayers() {
	geojson.eachLayer(function(layer) {
		var prevalence = getPrevalence(layer.feature.properties.district)
		layer.setStyle({
			fillColor: getColour(prevalence),
		});
	});
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

mymap.addLayer(geojson);

// Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info legend');
  this.update();
  return this._div;
};

legend.update = function() {
	this._div.innerHTML = drawLegend();
};

legend.addTo(mymap);

function drawLegend() {
	var html = '';
	if (typeof levels !== 'undefined') {
	  for (var i = 0; i < levels.length; i++) {
      html +=
        '<i style="background:' + getColour(levels[i]) + '"></i> ' +
        levels[i] + (levels[i + 1] ? '<br>' : '');
    }
  } else {
  	html = 'No prevalence data for this set of filters';
  }
  return(html);
}
