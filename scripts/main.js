var mymap = L.map('map').setView([-13.2543, 34.3015], 7);

function style(feature) {
	var prevalence = getPrevalence(feature.properties.adminLevel, feature.properties.label)

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
		var prev = getPrevalence(props.adminLevel, props.label);
	  if (typeof prev == 'undefined') {
	  	prev = 'No prevalence data for this set of filters';
	  }
  }
	this._div.innerHTML = '<h4>Malawi Prevalence</h4>' +  (props ?
        '<b>' + props.label + '</b><br />Mean prevalence: ' + 
        prev : 'Hover over a region');
};

info.addTo(mymap);

// Setup tooltip
var bounds = mymap.getBounds().pad(0.25); // slightly out of screen
var tooltip = L.tooltip({
  position: 'top',
  noWrap: true
})
  .addTo(mymap)
  .setContent('Test')
  .setLatLng(new L.LatLng(bounds.getNorth(), bounds.getCenter().lng));
mymap.removeLayer(tooltip);

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
	mymap.addLayer(tooltip);
	tooltip.setContent(layer.feature.properties.label);
	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	var region = e.target.feature.properties.region
	var adminLevel = e.target.feature.properties.adminLevel
	regionLayerGroups.forEach(function(layerGroup) {
		if (layerGroup.region == region) {
			layerGroup.resetStyle(e.target);
			info.update();
		}
	});
	mymap.removeLayer(tooltip);
}

function restyleLayers() {
	regionLayerGroups.forEach(function(layerGroup) {
		layerGroup.eachLayer(function(layer) {
		  var prevalence = getPrevalence(layer.feature.properties.adminLevel, 
		  	layer.feature.properties.label)
		  layer.setStyle({
			  fillColor: getColour(prevalence),
		  });
	  });
	});

}

// function movePopup(e) {
//   e.target.closeTooltip();
//   var popup = e.target.getPopup();
// 	popup.setLatLng(e.latlng).openOn(mymap);
// }

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		mousemove: updateTooltip
	});
}

// Setup tooltip
 // .setLatLng(new L.latLng(bounds.getNorth(), bounds.getCenter().lng));

// mymap
//   .on('mousemove', updateTooltip)

function updateTooltip(evt) {
	tooltip.updatePosition(evt.layerPoint);
}

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
      layerGroup.eachLayer(function(layer) {
      	layer.feature.properties.label = layer.feature.properties.district
      	layer.feature.properties.adminLevel = 2;
      })
      layerGroup.setStyle(style);
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
	// Cloning the JSON here as using the same json to
	// build these regions as the ones we do to build the district level
	// ones means they are pointing to the same underlying data (I think)
	// therefore updating any properties on this section also updates
	// them for the district level.
	cloneJson = JSON.parse(JSON.stringify(json));
	cloneJson.features.forEach(function(feature) {
    if (feature.properties.region == region) {
      regionJson.push(feature);
    }
	});
	// This unioning is super slow. We should do this server side
	// in the real app and make it available in the geojson
  var unionedData = turf.union(...regionJson);
  var layerGroup = new L.geoJSON(unionedData, {
  	style: style,
    onEachFeature: onEachFeature
  });
  // Add metadata about the region for use later
  layerGroup.eachLayer(function(layer) {
    layer.feature.properties.label = region;
    layer.feature.properties.adminLevel = 1;
  })

  layerGroup.setStyle(style);
  layerGroup.region = region;
  layerGroup.adminLevel = 1;
  regionLayerGroups.push(layerGroup);
  layerGroup.addTo(mymap);
  // Hidden initially
  mymap.removeLayer(layerGroup);
}

function addCountryAggregate(json) {
	cloneJson = JSON.parse(JSON.stringify(json)); 
	var unionedData = turf.union.apply(this, cloneJson.features)
	// Add label for the region for use later
  unionedData.properties.label = "Malawi";
  unionedData.properties.adminLevel = 0;
	// Remove info which no longer applies
	var countryGroup = new L.geoJSON(unionedData, {
	  style: style,
    onEachFeature: onEachFeature
  });
  countryGroup.adminLevel = 0
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
		mymap.flyToBounds(regionBounds, {
    	duration: 0.5
    });
    mymap.once('moveend', function() {
    	removeAllLayers();
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
