// Get the data from path
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

var jsonData;
var plotData;
// Levels for the legend
var levels;
var filters;
getJsonData("data/district_prev.json", function(text) {
	jsonData = text;
	plotData = filterData();
	legend.update();
});

// Get selected 
$(document).ready(function() {
  $('#filtersForm input').on('change', function() {
	  plotData = filterData();
	  restyleLayers();
	  legend.update();
  });
});

function getSelectedFilters() {
	var ageGroup = $('input[name=ageGroup]:checked', '#filtersForm').val();
	var sex = $('input[name=sex]:checked', '#filtersForm').val();
	return({
		ageGroup: ageGroup,
		sex: sex
	});
}

function filterData() {
	filters = getSelectedFilters();
	var data = [];
	var counter = 0;
	var min = 1;
	var max = 0;
	for (var i = 0; i < jsonData.length; i++) {
  	var obj = jsonData[i];
  	if (obj.period == "2018 Q3" && obj.survey_prevalence == "both") {
  		if (obj.agegr == filters.ageGroup && obj.sex == filters.sex) {
  			data[counter] = obj;
  			counter = counter + 1;
  			if (obj.mean < min) {
  	      min = obj.mean;
  	    }
  	    if (obj.mean > max) {
  	      max = obj.mean;
  	    }
  		}
  	}
  }
  drawRainbow(min, max);
  levels = setLevels(min, max);
  return(data);
}

function setLevels(min, max) {
	if (max > min) {
	  // Arbitraily choose to show 5 levels
	  step = (max - min)/4;
	  return([min, min + step, min + 2 * step, min + 3 * step, max]);
	}
}

function drawRainbow(min, max) {
	rainbow = new Rainbow();
	if (max > min) {
		rainbow.setSpectrum("#f7fcb9", "#addd8e", "#31a354");
    rainbow.setNumberRange(min, max);
	} else {
    // Set default spectrum for bad data
		rainbow.setSpectrum("#5a5a5a", "#5a5a5a");
		rainbow.setNumberRange(0, 1);
  }
}

function getColour(d) {
	var colour;
	if (typeof d !=='undefined') {
	  colour = '#' + rainbow.colourAt(d);
	} else {
    colour = '#5a5a5a';
	}
	return(colour)
}

function getPrevalence(district) {
  for (var i = 0; i < plotData.length; i++) {
  	var obj = plotData[i];
  	if (obj.district == district) {
  		return(obj.mean)
  	}
  }
}