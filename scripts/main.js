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

getJsonData("data/district_prev.json", function(text) {
	filterData(text);
});

var rainbow;
var age15To49 = [];
var age0To14 = [];
function filterData(text) {
	var counter15To49 = 0;
	var counter0To14 = 0;
	var minPrev = 1;
	var maxPrev = 0;
	for (var i = 0; i < text.length; i++) {
  	var obj = text[i];
  	if (obj.period == "2018 Q3" && obj.sex == "both" && 
  		obj.survey_prevalence == "both") {
  		if (obj.agegr == "15-49") {
  			age15To49[counter15To49] = obj;
  			counter15To49 = counter15To49 + 1;
  		} else if (obj.agegr == "0-14") {
  			age0To14[counter0To14] = obj;
  			counter0To14 = counter0To14 + 1;
  		}
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

function getPrevalence(ageGroup, district) {
	if (ageGroup == "15-49") {
    for (var i = 0; i < age15To49.length; i++) {
  	  var obj = age15To49[i];
  	  if (obj.district == district) {
  		  return(obj.mean)
  	  }
  	}
  } else if (ageGroup == "0-14") {
	  for (var i = 0; i < age0To14.length; i++) {
  	  var obj = age0To14[i];
  	  if (obj.district == district) {
  		  return(obj.mean)
  	  }
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

function styleByAge(age, feature) {
	var prevalence = getPrevalence(age, feature.properties.district)

	return {
		fillColor: getColour(prevalence),
		weight: 2,
		opactiy: 1,
		fillOpacity: 0.9,
		color: 'grey'
	};

}

function style15To49(feature) {
	var prevalence = getPrevalence("15-49", feature.properties.district)

	return {
		fillColor: getColour(prevalence),
		weight: 2,
		opactiy: 1,
		fillOpacity: 0.9,
		color: 'grey'
	};
}

function style0To14(feature) {
	var prevalence = getPrevalence("0-14", feature.properties.district)

	return {
		fillColor: getColour(prevalence),
		weight: 2,
		opactiy: 1,
		fillOpacity: 0.9,
		color: 'grey'
	};
}

var geojson0;
var geojson15;

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
        getPrevalence(props.agegr, props.district) : 'Hover over a region');
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

function resetHighlight15(e) {
	geojson15.resetStyle(e.target);
	info.update();
}

function resetHighlight0(e) {
	geojson0.resetStyle(e.target);
	info.update();
}

function onEachFeature15(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight15
	});
}

function onEachFeature(age, feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: (feature, layer) => resetHighlight(age, feature, layer)
	});
}

geojson15 = new L.GeoJSON.AJAX("data/malawi.geojson", {
	style: (feature) => styleByAge("0-14", feature),
  onEachFeature: (feature) => onEachFeature("0-14", feature)
});

geojson0 = new L.GeoJSON.AJAX("data/malawi.geojson", {
	style: (feature) => styleByAge("15-49", feature),
  onEachFeature: (feature) => onEachFeature("15-49", feature)
});

mymap.addLayer(geojson15);
mymap.addLayer(geojson0);

var ageGroups = {
	"15-49": geojson15,
	"0-14": geojson0
}

$('div.leaflet-control-layers input[type="radio"]').on('change', function() {    
  var checkbox = $(this);
  // window used to get the object by name
  var layer = window[checkbox.attr("data-city")];

  // toggle the layer
  if (checkbox.prop('checked')) {
  	console.log("adding layer ");
    map.addLayer(layer);
  } else {
  	console.log("removing layer ");
    map.removeLayer(layer);
  }
})

var control = new L.Control.Layers(ageGroups).addTo(mymap);


// Notes - think about extending the layer and overwrite the add and remove events so that
// they update the list of active layers
// layer.name

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