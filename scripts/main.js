
var mymap = L.map('map').setView([-13.2543, 34.3015], 7);

function style(feature) {
	var prevalence = getPrevalence(feature.properties.district, feature.properties.region)

	return {
		fillColor: getColour(prevalence),
		weight: 2,
		opactiy: 1,
		fillOpacity: 1.0,
		color: 'grey'
	};

}

// Info box top right
var info = L.control();

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function(props) {
	if (typeof props !== 'undefined') {
		var prev = getPrevalence(props.district, props.region);
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
	var region = e.target.feature.properties.region
	regionLayerGroups.forEach(function(layerGroup) {
		if (layerGroup.region == region) {
			layerGroup.resetStyle(e.target);
			info.update();
		}
	});
}

function restyleLayers() {
	regionLayerGroups.forEach(function(layerGroup) {
		layerGroup.eachLayer(function(layer) {
		  var prevalence = getPrevalence(layer.feature.properties.district, 
		  	layer.feature.properties.region)
		  layer.setStyle({
			  fillColor: getColour(prevalence),
		  });
	  });
	});

}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});
	layer.bindTooltip(
		feature.properties.district,
		{
			permanent: true,
			direction: 'center',
			className: 'districtLabel'
		}
  );
}

var visible = true;
// Show labels when beyond a certain zoom level
mymap.on('zoomend', function(e) {
	if (mymap.getZoom() > 7) {
		if (!visible) {
      regionLayerGroups.forEach(function(group) {
      	group.eachLayer(function(layer) {
      		layer.openTooltip();
      	});
      });
      visible = true;
		}
	} else {
		if (visible) {
			regionLayerGroups.forEach(function(group) {
      	group.eachLayer(function(layer) {
          layer.closeTooltip();
      	});
      });
      visible = false;
		}
	}
});

// Set up layer groups
// One layer group for each region, we do this so we can easily
// pan to a specific region and to hide other regions when
// a single region is in focus.
var regionLayerGroups = [];
var regions = [];
function getLayerGroups() {
	var regionQuery = $.getJSON("data/malawi.geojson", function(data, callback) {
		$.each(data.features, function(i, item) {
			if (!regions.includes(item.properties.region)) {
				regions.push(item.properties.region);
			}
		});
	});

  regionQuery.complete(function() {
    regions.forEach(function(region) {
    	var layerGroup = new L.geoJSON(regionQuery.responseJSON, {
	      style: style,
        onEachFeature: onEachFeature,
        filter: (feature) => regionFilter(feature, region)
      });
      // Add metadata about the region for use later
      layerGroup.region = region;
      layerGroup.adminLevel = 2;
      regionLayerGroups.push(layerGroup);
      layerGroup.addTo(mymap);
      addRegionAggregates(regionQuery.responseJSON, region);
    });
    addCountryAggregate(regionQuery.responseJSON);
  });
}

function addRegionAggregates(json, region) {
	var regionJson = [];
	json.features.forEach(function(feature) {
    if (feature.properties.region == region) {
      regionJson.push(feature);
    }
	});
  var unionedData = turf.union.apply(this, regionJson);
  var layerGroup = new L.geoJSON(unionedData, {
	  style: style,
    onEachFeature: onEachFeature
  });
  // Add metadata about the region for use later
  layerGroup.region = region;
  layerGroup.adminLevel = 1;
  regionLayerGroups.push(layerGroup);
  layerGroup.addTo(mymap);
  // Hidden initially
  mymap.removeLayer(layerGroup);
}

function addCountryAggregate(json) {
	var unionedData = turf.union.apply(this, json.features)
	// Remove info which no longer applies
	var countryGroup = new L.geoJSON(unionedData, {
	  style: style,
    onEachFeature: onEachFeature
  });
  countryGroup.region = "All";
  countryGroup.adminLevel = 0;
  regionLayerGroups.push(countryGroup);
  countryGroup.addTo(mymap);
  // Hidden initially
  mymap.removeLayer(countryGroup);
}

function regionFilter(feature, region) {
	return(feature.properties.region === region)
}

getLayerGroups();

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

$("#regionSelect").on('change', function() {
	var region = this.value;
	var adminLevel = $("#adminLevelSelect").val()
	redrawRegionsAndBounds(adminLevel, region);
});

$("#adminLevelSelect").on('change', function() {
	var adminLevel = this.value;
	var region = $("#regionSelect").val();
	redrawRegionsAndBounds(adminLevel, region);
});

function redrawRegionsAndBounds(adminLevel, region) {
	var visibleGroups = [];
	if (adminLevel == 0 || region == "All") {
		visibleGroups = getAdminLevelGroups(adminLevel);
	} else {
	  regionLayerGroups.forEach(function(layerGroup) {
	  	if (layerGroup.adminLevel == adminLevel && layerGroup.region == region) {
	  		visibleGroups.push(layerGroup);
	  	}
		});
	}

	var regionBounds;
	visibleGroups.forEach(function(group) {
		if (typeof regionBounds == 'undefined') {
		   regionBounds = L.latLngBounds(visibleGroups[0].getBounds());
		} else {
		  regionBounds.extend(group.getBounds());
		}
	});
	// If we haven't selected a specific region then log and do nothing
	if (typeof regionBounds == 'undefined') {
		console.log("Selected region does not match a region layer");
	} else {
		// We do removing layers and re-enabling to improve transition
		removeAllLayers();
    mymap.flyToBounds(regionBounds, {
    	duration: 0.5
    });
    mymap.once('moveend', function() {
      addVisibleGroups(visibleGroups);
    });
  }
}

function getRegionGroups(region) {
  var groups = [];
	regionLayerGroups.forEach(function(layerGroup) {
    if (layerGroup.region == region) {
    	groups.push(layerGroup);
    }
	});
	return(groups);
}

function getAdminLevelGroups(adminLevel) {
	var groups = [];
	regionLayerGroups.forEach(function(layerGroup) {
    if (layerGroup.adminLevel == adminLevel) {
    	groups.push(layerGroup);
    }
	});
	return(groups);
}

function removeAllLayers() {
	regionLayerGroups.forEach(function(group) {
		if (mymap.hasLayer(group)) {
	  	mymap.removeLayer(group);
	  }
	});
}

function addVisibleGroups(visibleGroups) {
  visibleGroups.forEach(function(visibleGroup) {
    mymap.addLayer(visibleGroup);   
  });
}
