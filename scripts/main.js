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
var rainbow;
getJsonData("data/district_prev.json", function(text) {
	// Filter data
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

  rainbow = new Rainbow();
  rainbow.setSpectrum("#f7fcb9", "#addd8e", "#31a354")
  rainbow.setNumberRange(minPrev, maxPrev);
});


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
		color: 'black'
	};
}

var geojson = new L.GeoJSON.AJAX("data/malawi.geojson", {style: style});
geojson.addTo(mymap);

