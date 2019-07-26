(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.turf = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
	union: require('@turf/union')
};

},{"@turf/union":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module helpers
 */
/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 *
 * @memberof helpers
 * @type {number}
 */
exports.earthRadius = 6371008.8;
/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.factors = {
    centimeters: exports.earthRadius * 100,
    centimetres: exports.earthRadius * 100,
    degrees: exports.earthRadius / 111325,
    feet: exports.earthRadius * 3.28084,
    inches: exports.earthRadius * 39.370,
    kilometers: exports.earthRadius / 1000,
    kilometres: exports.earthRadius / 1000,
    meters: exports.earthRadius,
    metres: exports.earthRadius,
    miles: exports.earthRadius / 1609.344,
    millimeters: exports.earthRadius * 1000,
    millimetres: exports.earthRadius * 1000,
    nauticalmiles: exports.earthRadius / 1852,
    radians: 1,
    yards: exports.earthRadius / 1.0936,
};
/**
 * Units of measurement factors based on 1 meter.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.unitsFactors = {
    centimeters: 100,
    centimetres: 100,
    degrees: 1 / 111325,
    feet: 3.28084,
    inches: 39.370,
    kilometers: 1 / 1000,
    kilometres: 1 / 1000,
    meters: 1,
    metres: 1,
    miles: 1 / 1609.344,
    millimeters: 1000,
    millimetres: 1000,
    nauticalmiles: 1 / 1852,
    radians: 1 / exports.earthRadius,
    yards: 1 / 1.0936,
};
/**
 * Area of measurement factors based on 1 square meter.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.areaFactors = {
    acres: 0.000247105,
    centimeters: 10000,
    centimetres: 10000,
    feet: 10.763910417,
    inches: 1550.003100006,
    kilometers: 0.000001,
    kilometres: 0.000001,
    meters: 1,
    metres: 1,
    miles: 3.86e-7,
    millimeters: 1000000,
    millimetres: 1000000,
    yards: 1.195990046,
};
/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geom, properties, options) {
    if (options === void 0) { options = {}; }
    var feat = { type: "Feature" };
    if (options.id === 0 || options.id) {
        feat.id = options.id;
    }
    if (options.bbox) {
        feat.bbox = options.bbox;
    }
    feat.properties = properties || {};
    feat.geometry = geom;
    return feat;
}
exports.feature = feature;
/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<any>} coordinates Coordinates
 * @param {Object} [options={}] Optional Parameters
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = "Point";
 * var coordinates = [110, 50];
 * var geometry = turf.geometry(type, coordinates);
 * // => geometry
 */
function geometry(type, coordinates, options) {
    if (options === void 0) { options = {}; }
    switch (type) {
        case "Point": return point(coordinates).geometry;
        case "LineString": return lineString(coordinates).geometry;
        case "Polygon": return polygon(coordinates).geometry;
        case "MultiPoint": return multiPoint(coordinates).geometry;
        case "MultiLineString": return multiLineString(coordinates).geometry;
        case "MultiPolygon": return multiPolygon(coordinates).geometry;
        default: throw new Error(type + " is invalid");
    }
}
exports.geometry = geometry;
/**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "Point",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.point = point;
/**
 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
 *
 * @name points
 * @param {Array<Array<number>>} coordinates an array of Points
 * @param {Object} [properties={}] Translate these properties to each Feature
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Point>} Point Feature
 * @example
 * var points = turf.points([
 *   [-75, 39],
 *   [-80, 45],
 *   [-78, 50]
 * ]);
 *
 * //=points
 */
function points(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return point(coords, properties);
    }), options);
}
exports.points = points;
/**
 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} Polygon Feature
 * @example
 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
 *
 * //=polygon
 */
function polygon(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
        var ring = coordinates_1[_i];
        if (ring.length < 4) {
            throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            // Check if first point of Polygon contains two numbers
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error("First and last Position are not equivalent.");
            }
        }
    }
    var geom = {
        type: "Polygon",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.polygon = polygon;
/**
 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
 *
 * @name polygons
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
 * @example
 * var polygons = turf.polygons([
 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
 * ]);
 *
 * //=polygons
 */
function polygons(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return polygon(coords, properties);
    }), options);
}
exports.polygons = polygons;
/**
 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<LineString>} LineString Feature
 * @example
 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
 *
 * //=linestring1
 * //=linestring2
 */
function lineString(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    if (coordinates.length < 2) {
        throw new Error("coordinates must be an array of two or more positions");
    }
    var geom = {
        type: "LineString",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.lineString = lineString;
/**
 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
 *
 * @name lineStrings
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
 * @example
 * var linestrings = turf.lineStrings([
 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
 * ]);
 *
 * //=linestrings
 */
function lineStrings(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return lineString(coords, properties);
    }), options);
}
exports.lineStrings = lineStrings;
/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {FeatureCollection} FeatureCollection of Features
 * @example
 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
 *
 * var collection = turf.featureCollection([
 *   locationA,
 *   locationB,
 *   locationC
 * ]);
 *
 * //=collection
 */
function featureCollection(features, options) {
    if (options === void 0) { options = {}; }
    var fc = { type: "FeatureCollection" };
    if (options.id) {
        fc.id = options.id;
    }
    if (options.bbox) {
        fc.bbox = options.bbox;
    }
    fc.features = features;
    return fc;
}
exports.featureCollection = featureCollection;
/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiLineString",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiLineString = multiLineString;
/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiPoint",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiPoint = multiPoint;
/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiPolygon",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiPolygon = multiPolygon;
/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = turf.geometry("Point", [100, 0]);
 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
 * var collection = turf.geometryCollection([pt, line]);
 *
 * // => collection
 */
function geometryCollection(geometries, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "GeometryCollection",
        geometries: geometries,
    };
    return feature(geom, properties, options);
}
exports.geometryCollection = geometryCollection;
/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (precision === void 0) { precision = 0; }
    if (precision && !(precision >= 0)) {
        throw new Error("precision must be a positive number");
    }
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}
exports.round = round;
/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToLength
 * @param {number} radians in radians across the sphere
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToLength(radians, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = exports.factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return radians * factor;
}
exports.radiansToLength = radiansToLength;
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name lengthToRadians
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} radians
 */
function lengthToRadians(distance, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = exports.factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return distance / factor;
}
exports.lengthToRadians = lengthToRadians;
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name lengthToDegrees
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function lengthToDegrees(distance, units) {
    return radiansToDegrees(lengthToRadians(distance, units));
}
exports.lengthToDegrees = lengthToDegrees;
/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAzimuth
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAzimuth(bearing) {
    var angle = bearing % 360;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}
exports.bearingToAzimuth = bearingToAzimuth;
/**
 * Converts an angle in radians to degrees
 *
 * @name radiansToDegrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radiansToDegrees(radians) {
    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}
exports.radiansToDegrees = radiansToDegrees;
/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degreesToRadians(degrees) {
    var radians = degrees % 360;
    return radians * Math.PI / 180;
}
exports.degreesToRadians = degreesToRadians;
/**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {Units} [originalUnit="kilometers"] of the length
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted length
 */
function convertLength(length, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "kilometers"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(length >= 0)) {
        throw new Error("length must be a positive number");
    }
    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
exports.convertLength = convertLength;
/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
 * @param {number} area to be converted
 * @param {Units} [originalUnit="meters"] of the distance
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "meters"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(area >= 0)) {
        throw new Error("area must be a positive number");
    }
    var startFactor = exports.areaFactors[originalUnit];
    if (!startFactor) {
        throw new Error("invalid original units");
    }
    var finalFactor = exports.areaFactors[finalUnit];
    if (!finalFactor) {
        throw new Error("invalid final units");
    }
    return (area / startFactor) * finalFactor;
}
exports.convertArea = convertArea;
/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num) && !/^\s*$/.test(num);
}
exports.isNumber = isNumber;
/**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 * @example
 * turf.isObject({elevation: 10})
 * //=true
 * turf.isObject('foo')
 * //=false
 */
function isObject(input) {
    return (!!input) && (input.constructor === Object);
}
exports.isObject = isObject;
/**
 * Validate BBox
 *
 * @private
 * @param {Array<number>} bbox BBox to validate
 * @returns {void}
 * @throws Error if BBox is not valid
 * @example
 * validateBBox([-180, -40, 110, 50])
 * //=OK
 * validateBBox([-180, -40])
 * //=Error
 * validateBBox('Foo')
 * //=Error
 * validateBBox(5)
 * //=Error
 * validateBBox(null)
 * //=Error
 * validateBBox(undefined)
 * //=Error
 */
function validateBBox(bbox) {
    if (!bbox) {
        throw new Error("bbox is required");
    }
    if (!Array.isArray(bbox)) {
        throw new Error("bbox must be an Array");
    }
    if (bbox.length !== 4 && bbox.length !== 6) {
        throw new Error("bbox must be an Array of 4 or 6 numbers");
    }
    bbox.forEach(function (num) {
        if (!isNumber(num)) {
            throw new Error("bbox must only contain numbers");
        }
    });
}
exports.validateBBox = validateBBox;
/**
 * Validate Id
 *
 * @private
 * @param {string|number} id Id to validate
 * @returns {void}
 * @throws Error if Id is not valid
 * @example
 * validateId([-180, -40, 110, 50])
 * //=Error
 * validateId([-180, -40])
 * //=Error
 * validateId('Foo')
 * //=OK
 * validateId(5)
 * //=OK
 * validateId(null)
 * //=Error
 * validateId(undefined)
 * //=Error
 */
function validateId(id) {
    if (!id) {
        throw new Error("id is required");
    }
    if (["string", "number"].indexOf(typeof id) === -1) {
        throw new Error("id must be a number or a string");
    }
}
exports.validateId = validateId;
// Deprecated methods
function radians2degrees() {
    throw new Error("method has been renamed to `radiansToDegrees`");
}
exports.radians2degrees = radians2degrees;
function degrees2radians() {
    throw new Error("method has been renamed to `degreesToRadians`");
}
exports.degrees2radians = degrees2radians;
function distanceToDegrees() {
    throw new Error("method has been renamed to `lengthToDegrees`");
}
exports.distanceToDegrees = distanceToDegrees;
function distanceToRadians() {
    throw new Error("method has been renamed to `lengthToRadians`");
}
exports.distanceToRadians = distanceToRadians;
function radiansToDistance() {
    throw new Error("method has been renamed to `radiansToLength`");
}
exports.radiansToDistance = radiansToDistance;
function bearingToAngle() {
    throw new Error("method has been renamed to `bearingToAzimuth`");
}
exports.bearingToAngle = bearingToAngle;
function convertDistance() {
    throw new Error("method has been renamed to `convertLength`");
}
exports.convertDistance = convertDistance;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("@turf/helpers");
/**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @name getCoord
 * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
 * @returns {Array<number>} coordinates
 * @example
 * var pt = turf.point([10, 10]);
 *
 * var coord = turf.getCoord(pt);
 * //= [10, 10]
 */
function getCoord(coord) {
    if (!coord) {
        throw new Error("coord is required");
    }
    if (!Array.isArray(coord)) {
        if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
            return coord.geometry.coordinates;
        }
        if (coord.type === "Point") {
            return coord.coordinates;
        }
    }
    if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
        return coord;
    }
    throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
exports.getCoord = getCoord;
/**
 * Unwrap coordinates from a Feature, Geometry Object or an Array
 *
 * @name getCoords
 * @param {Array<any>|Geometry|Feature} coords Feature, Geometry Object or an Array
 * @returns {Array<any>} coordinates
 * @example
 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
 *
 * var coords = turf.getCoords(poly);
 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
 */
function getCoords(coords) {
    if (Array.isArray(coords)) {
        return coords;
    }
    // Feature
    if (coords.type === "Feature") {
        if (coords.geometry !== null) {
            return coords.geometry.coordinates;
        }
    }
    else {
        // Geometry
        if (coords.coordinates) {
            return coords.coordinates;
        }
    }
    throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
}
exports.getCoords = getCoords;
/**
 * Checks if coordinates contains a number
 *
 * @name containsNumber
 * @param {Array<any>} coordinates GeoJSON Coordinates
 * @returns {boolean} true if Array contains a number
 */
function containsNumber(coordinates) {
    if (coordinates.length > 1 && helpers_1.isNumber(coordinates[0]) && helpers_1.isNumber(coordinates[1])) {
        return true;
    }
    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
        return containsNumber(coordinates[0]);
    }
    throw new Error("coordinates must only contain numbers");
}
exports.containsNumber = containsNumber;
/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @name geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function geojsonType(value, type, name) {
    if (!type || !name) {
        throw new Error("type and name required");
    }
    if (!value || value.type !== type) {
        throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + value.type);
    }
}
exports.geojsonType = geojsonType;
/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
function featureOf(feature, type, name) {
    if (!feature) {
        throw new Error("No feature passed");
    }
    if (!name) {
        throw new Error(".featureOf() requires a name");
    }
    if (!feature || feature.type !== "Feature" || !feature.geometry) {
        throw new Error("Invalid input to " + name + ", Feature with geometry required");
    }
    if (!feature.geometry || feature.geometry.type !== type) {
        throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
    }
}
exports.featureOf = featureOf;
/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function collectionOf(featureCollection, type, name) {
    if (!featureCollection) {
        throw new Error("No featureCollection passed");
    }
    if (!name) {
        throw new Error(".collectionOf() requires a name");
    }
    if (!featureCollection || featureCollection.type !== "FeatureCollection") {
        throw new Error("Invalid input to " + name + ", FeatureCollection required");
    }
    for (var _i = 0, _a = featureCollection.features; _i < _a.length; _i++) {
        var feature = _a[_i];
        if (!feature || feature.type !== "Feature" || !feature.geometry) {
            throw new Error("Invalid input to " + name + ", Feature with geometry required");
        }
        if (!feature.geometry || feature.geometry.type !== type) {
            throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
        }
    }
}
exports.collectionOf = collectionOf;
/**
 * Get Geometry from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {Geometry|null} GeoJSON Geometry Object
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeom(point)
 * //={"type": "Point", "coordinates": [110, 40]}
 */
function getGeom(geojson) {
    if (geojson.type === "Feature") {
        return geojson.geometry;
    }
    return geojson;
}
exports.getGeom = getGeom;
/**
 * Get GeoJSON object's type, Geometry type is prioritize.
 *
 * @param {GeoJSON} geojson GeoJSON object
 * @param {string} [name="geojson"] name of the variable to display in error message
 * @returns {string} GeoJSON type
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getType(point)
 * //="Point"
 */
function getType(geojson, name) {
    if (geojson.type === "FeatureCollection") {
        return "FeatureCollection";
    }
    if (geojson.type === "GeometryCollection") {
        return "GeometryCollection";
    }
    if (geojson.type === "Feature" && geojson.geometry !== null) {
        return geojson.geometry.type;
    }
    return geojson.type;
}
exports.getType = getType;

},{"@turf/helpers":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var martinez = require("martinez-polygon-clipping");
var invariant_1 = require("@turf/invariant");
var helpers_1 = require("@turf/helpers");
/**
 * Takes two {@link (Multi)Polygon(s)} and returns a combined polygon. If the input polygons are not contiguous, this function returns a {@link MultiPolygon} feature.
 *
 * @name union
 * @param {Feature<Polygon|MultiPolygon>} polygon1 input Polygon feature
 * @param {Feature<Polygon|MultiPolygon>} polygon2 Polygon feature to difference from polygon1
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] Translate Properties to output Feature
 * @returns {Feature<(Polygon|MultiPolygon)>} a combined {@link Polygon} or {@link MultiPolygon} feature
 * @example
 * var poly1 = turf.polygon([[
 *     [-82.574787, 35.594087],
 *     [-82.574787, 35.615581],
 *     [-82.545261, 35.615581],
 *     [-82.545261, 35.594087],
 *     [-82.574787, 35.594087]
 * ]], {"fill": "#0f0"});
 * var poly2 = turf.polygon([[
 *     [-82.560024, 35.585153],
 *     [-82.560024, 35.602602],
 *     [-82.52964, 35.602602],
 *     [-82.52964, 35.585153],
 *     [-82.560024, 35.585153]
 * ]], {"fill": "#00f"});
 *
 * var union = turf.union(poly1, poly2);
 *
 * //addToMap
 * var addToMap = [poly1, poly2, union];
 */
function union(polygon1, polygon2, options) {
    if (options === void 0) { options = {}; }
    var coords1 = invariant_1.getGeom(polygon1).coordinates;
    var coords2 = invariant_1.getGeom(polygon2).coordinates;
    var unioned = martinez.union(coords1, coords2);
    if (unioned.length === 0)
        return null;
    if (unioned.length === 1)
        return helpers_1.polygon(unioned[0], options.properties);
    else
        return helpers_1.multiPolygon(unioned, options.properties);
}
exports.default = union;

},{"@turf/helpers":2,"@turf/invariant":3,"martinez-polygon-clipping":5}],5:[function(require,module,exports){
/**
 * martinez v0.4.3
 * Martinez polygon clipping algorithm, does boolean operation on polygons (multipolygons, polygons with holes etc): intersection, union, difference, xor
 *
 * @author Alex Milevski <info@w8r.name>
 * @license MIT
 * @preserve
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.martinez = {})));
}(this, (function (exports) { 'use strict';

  function DEFAULT_COMPARE (a, b) { return a > b ? 1 : a < b ? -1 : 0; }

  var SplayTree = function SplayTree(compare, noDuplicates) {
    if ( compare === void 0 ) compare = DEFAULT_COMPARE;
    if ( noDuplicates === void 0 ) noDuplicates = false;

    this._compare = compare;
    this._root = null;
    this._size = 0;
    this._noDuplicates = !!noDuplicates;
  };

  var prototypeAccessors = { size: { configurable: true } };


  SplayTree.prototype.rotateLeft = function rotateLeft (x) {
    var y = x.right;
    if (y) {
      x.right = y.left;
      if (y.left) { y.left.parent = x; }
      y.parent = x.parent;
    }

    if (!x.parent)              { this._root = y; }
    else if (x === x.parent.left) { x.parent.left = y; }
    else                        { x.parent.right = y; }
    if (y) { y.left = x; }
    x.parent = y;
  };


  SplayTree.prototype.rotateRight = function rotateRight (x) {
    var y = x.left;
    if (y) {
      x.left = y.right;
      if (y.right) { y.right.parent = x; }
      y.parent = x.parent;
    }

    if (!x.parent)             { this._root = y; }
    else if(x === x.parent.left) { x.parent.left = y; }
    else                       { x.parent.right = y; }
    if (y) { y.right = x; }
    x.parent = y;
  };


  SplayTree.prototype._splay = function _splay (x) {
      var this$1 = this;

    while (x.parent) {
      var p = x.parent;
      if (!p.parent) {
        if (p.left === x) { this$1.rotateRight(p); }
        else            { this$1.rotateLeft(p); }
      } else if (p.left === x && p.parent.left === p) {
        this$1.rotateRight(p.parent);
        this$1.rotateRight(p);
      } else if (p.right === x && p.parent.right === p) {
        this$1.rotateLeft(p.parent);
        this$1.rotateLeft(p);
      } else if (p.left === x && p.parent.right === p) {
        this$1.rotateRight(p);
        this$1.rotateLeft(p);
      } else {
        this$1.rotateLeft(p);
        this$1.rotateRight(p);
      }
    }
  };


  SplayTree.prototype.splay = function splay (x) {
      var this$1 = this;

    var p, gp, ggp, l, r;

    while (x.parent) {
      p = x.parent;
      gp = p.parent;

      if (gp && gp.parent) {
        ggp = gp.parent;
        if (ggp.left === gp) { ggp.left= x; }
        else               { ggp.right = x; }
        x.parent = ggp;
      } else {
        x.parent = null;
        this$1._root = x;
      }

      l = x.left; r = x.right;

      if (x === p.left) { // left
        if (gp) {
          if (gp.left === p) {
            /* zig-zig */
            if (p.right) {
              gp.left = p.right;
              gp.left.parent = gp;
            } else { gp.left = null; }

            p.right = gp;
            gp.parent = p;
          } else {
            /* zig-zag */
            if (l) {
              gp.right = l;
              l.parent = gp;
            } else { gp.right = null; }

            x.left  = gp;
            gp.parent = x;
          }
        }
        if (r) {
          p.left = r;
          r.parent = p;
        } else { p.left = null; }

        x.right= p;
        p.parent = x;
      } else { // right
        if (gp) {
          if (gp.right === p) {
            /* zig-zig */
            if (p.left) {
              gp.right = p.left;
              gp.right.parent = gp;
            } else { gp.right = null; }

            p.left = gp;
            gp.parent = p;
          } else {
            /* zig-zag */
            if (r) {
              gp.left = r;
              r.parent = gp;
            } else { gp.left = null; }

            x.right = gp;
            gp.parent = x;
          }
        }
        if (l) {
          p.right = l;
          l.parent = p;
        } else { p.right = null; }

        x.left = p;
        p.parent = x;
      }
    }
  };


  SplayTree.prototype.replace = function replace (u, v) {
    if (!u.parent) { this._root = v; }
    else if (u === u.parent.left) { u.parent.left = v; }
    else { u.parent.right = v; }
    if (v) { v.parent = u.parent; }
  };


  SplayTree.prototype.minNode = function minNode (u) {
      if ( u === void 0 ) u = this._root;

    if (u) { while (u.left) { u = u.left; } }
    return u;
  };


  SplayTree.prototype.maxNode = function maxNode (u) {
      if ( u === void 0 ) u = this._root;

    if (u) { while (u.right) { u = u.right; } }
    return u;
  };


  SplayTree.prototype.insert = function insert (key, data) {
    var z = this._root;
    var p = null;
    var comp = this._compare;
    var cmp;

    if (this._noDuplicates) {
      while (z) {
        p = z;
        cmp = comp(z.key, key);
        if (cmp === 0) { return; }
        else if (comp(z.key, key) < 0) { z = z.right; }
        else { z = z.left; }
      }
    } else {
      while (z) {
        p = z;
        if (comp(z.key, key) < 0) { z = z.right; }
        else { z = z.left; }
      }
    }

    z = { key: key, data: data, left: null, right: null, parent: p };

    if (!p)                        { this._root = z; }
    else if (comp(p.key, z.key) < 0) { p.right = z; }
    else                           { p.left= z; }

    this.splay(z);
    this._size++;
    return z;
  };


  SplayTree.prototype.find = function find (key) {
    var z  = this._root;
    var comp = this._compare;
    while (z) {
      var cmp = comp(z.key, key);
      if    (cmp < 0) { z = z.right; }
      else if (cmp > 0) { z = z.left; }
      else            { return z; }
    }
    return null;
  };

  /**
   * Whether the tree contains a node with the given key
   * @param{Key} key
   * @return {boolean} true/false
   */
  SplayTree.prototype.contains = function contains (key) {
    var node     = this._root;
    var comparator = this._compare;
    while (node){
      var cmp = comparator(key, node.key);
      if    (cmp === 0) { return true; }
      else if (cmp < 0) { node = node.left; }
      else              { node = node.right; }
    }

    return false;
  };


  SplayTree.prototype.remove = function remove (key) {
    var z = this.find(key);

    if (!z) { return false; }

    this.splay(z);

    if (!z.left) { this.replace(z, z.right); }
    else if (!z.right) { this.replace(z, z.left); }
    else {
      var y = this.minNode(z.right);
      if (y.parent !== z) {
        this.replace(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.replace(z, y);
      y.left = z.left;
      y.left.parent = y;
    }

    this._size--;
    return true;
  };


  SplayTree.prototype.removeNode = function removeNode (z) {
    if (!z) { return false; }

    this.splay(z);

    if (!z.left) { this.replace(z, z.right); }
    else if (!z.right) { this.replace(z, z.left); }
    else {
      var y = this.minNode(z.right);
      if (y.parent !== z) {
        this.replace(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.replace(z, y);
      y.left = z.left;
      y.left.parent = y;
    }

    this._size--;
    return true;
  };


  SplayTree.prototype.erase = function erase (key) {
    var z = this.find(key);
    if (!z) { return; }

    this.splay(z);

    var s = z.left;
    var t = z.right;

    var sMax = null;
    if (s) {
      s.parent = null;
      sMax = this.maxNode(s);
      this.splay(sMax);
      this._root = sMax;
    }
    if (t) {
      if (s) { sMax.right = t; }
      else { this._root = t; }
      t.parent = sMax;
    }

    this._size--;
  };

  /**
   * Removes and returns the node with smallest key
   * @return {?Node}
   */
  SplayTree.prototype.pop = function pop () {
    var node = this._root, returnValue = null;
    if (node) {
      while (node.left) { node = node.left; }
      returnValue = { key: node.key, data: node.data };
      this.remove(node.key);
    }
    return returnValue;
  };


  /* eslint-disable class-methods-use-this */

  /**
   * Successor node
   * @param{Node} node
   * @return {?Node}
   */
  SplayTree.prototype.next = function next (node) {
    var successor = node;
    if (successor) {
      if (successor.right) {
        successor = successor.right;
        while (successor && successor.left) { successor = successor.left; }
      } else {
        successor = node.parent;
        while (successor && successor.right === node) {
          node = successor; successor = successor.parent;
        }
      }
    }
    return successor;
  };


  /**
   * Predecessor node
   * @param{Node} node
   * @return {?Node}
   */
  SplayTree.prototype.prev = function prev (node) {
    var predecessor = node;
    if (predecessor) {
      if (predecessor.left) {
        predecessor = predecessor.left;
        while (predecessor && predecessor.right) { predecessor = predecessor.right; }
      } else {
        predecessor = node.parent;
        while (predecessor && predecessor.left === node) {
          node = predecessor;
          predecessor = predecessor.parent;
        }
      }
    }
    return predecessor;
  };
  /* eslint-enable class-methods-use-this */


  /**
   * @param{forEachCallback} callback
   * @return {SplayTree}
   */
  SplayTree.prototype.forEach = function forEach (callback) {
    var current = this._root;
    var s = [], done = false, i = 0;

    while (!done) {
      // Reach the left most Node of the current Node
      if (current) {
        // Place pointer to a tree node on the stack
        // before traversing the node's left subtree
        s.push(current);
        current = current.left;
      } else {
        // BackTrack from the empty subtree and visit the Node
        // at the top of the stack; however, if the stack is
        // empty you are done
        if (s.length > 0) {
          current = s.pop();
          callback(current, i++);

          // We have visited the node and its left
          // subtree. Now, it's right subtree's turn
          current = current.right;
        } else { done = true; }
      }
    }
    return this;
  };


  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   * @param{Key}    low
   * @param{Key}    high
   * @param{Function} fn
   * @param{*?}     ctx
   * @return {SplayTree}
   */
  SplayTree.prototype.range = function range (low, high, fn, ctx) {
      var this$1 = this;

    var Q = [];
    var compare = this._compare;
    var node = this._root, cmp;

    while (Q.length !== 0 || node) {
      if (node) {
        Q.push(node);
        node = node.left;
      } else {
        node = Q.pop();
        cmp = compare(node.key, high);
        if (cmp > 0) {
          break;
        } else if (compare(node.key, low) >= 0) {
          if (fn.call(ctx, node)) { return this$1; } // stop if smth is returned
        }
        node = node.right;
      }
    }
    return this;
  };

  /**
   * Returns all keys in order
   * @return {Array<Key>}
   */
  SplayTree.prototype.keys = function keys () {
    var current = this._root;
    var s = [], r = [], done = false;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          r.push(current.key);
          current = current.right;
        } else { done = true; }
      }
    }
    return r;
  };


  /**
   * Returns `data` fields of all nodes in order.
   * @return {Array<Value>}
   */
  SplayTree.prototype.values = function values () {
    var current = this._root;
    var s = [], r = [], done = false;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          r.push(current.data);
          current = current.right;
        } else { done = true; }
      }
    }
    return r;
  };


  /**
   * Returns node at given index
   * @param{number} index
   * @return {?Node}
   */
  SplayTree.prototype.at = function at (index) {
    // removed after a consideration, more misleading than useful
    // index = index % this.size;
    // if (index < 0) index = this.size - index;

    var current = this._root;
    var s = [], done = false, i = 0;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          if (i === index) { return current; }
          i++;
          current = current.right;
        } else { done = true; }
      }
    }
    return null;
  };

  /**
   * Bulk-load items. Both array have to be same size
   * @param{Array<Key>}  keys
   * @param{Array<Value>}[values]
   * @param{Boolean}     [presort=false] Pre-sort keys and values, using
   *                                       tree's comparator. Sorting is done
   *                                       in-place
   * @return {AVLTree}
   */
  SplayTree.prototype.load = function load (keys, values, presort) {
      if ( keys === void 0 ) keys = [];
      if ( values === void 0 ) values = [];
      if ( presort === void 0 ) presort = false;

    if (this._size !== 0) { throw new Error('bulk-load: tree is not empty'); }
    var size = keys.length;
    if (presort) { sort(keys, values, 0, size - 1, this._compare); }
    this._root = loadRecursive(null, keys, values, 0, size);
    this._size = size;
    return this;
  };


  SplayTree.prototype.min = function min () {
    var node = this.minNode(this._root);
    if (node) { return node.key; }
    else    { return null; }
  };


  SplayTree.prototype.max = function max () {
    var node = this.maxNode(this._root);
    if (node) { return node.key; }
    else    { return null; }
  };

  SplayTree.prototype.isEmpty = function isEmpty () { return this._root === null; };
  prototypeAccessors.size.get = function () { return this._size; };


  /**
   * Create a tree and load it with items
   * @param{Array<Key>}        keys
   * @param{Array<Value>?}      [values]

   * @param{Function?}          [comparator]
   * @param{Boolean?}           [presort=false] Pre-sort keys and values, using
   *                                             tree's comparator. Sorting is done
   *                                             in-place
   * @param{Boolean?}           [noDuplicates=false] Allow duplicates
   * @return {SplayTree}
   */
  SplayTree.createTree = function createTree (keys, values, comparator, presort, noDuplicates) {
    return new SplayTree(comparator, noDuplicates).load(keys, values, presort);
  };

  Object.defineProperties( SplayTree.prototype, prototypeAccessors );


  function loadRecursive (parent, keys, values, start, end) {
    var size = end - start;
    if (size > 0) {
      var middle = start + Math.floor(size / 2);
      var key    = keys[middle];
      var data   = values[middle];
      var node   = { key: key, data: data, parent: parent };
      node.left    = loadRecursive(node, keys, values, start, middle);
      node.right   = loadRecursive(node, keys, values, middle + 1, end);
      return node;
    }
    return null;
  }


  function sort(keys, values, left, right, compare) {
    if (left >= right) { return; }

    var pivot = keys[(left + right) >> 1];
    var i = left - 1;
    var j = right + 1;

    while (true) {
      do { i++; } while (compare(keys[i], pivot) < 0);
      do { j--; } while (compare(keys[j], pivot) > 0);
      if (i >= j) { break; }

      var tmp = keys[i];
      keys[i] = keys[j];
      keys[j] = tmp;

      tmp = values[i];
      values[i] = values[j];
      values[j] = tmp;
    }

    sort(keys, values,  left,     j, compare);
    sort(keys, values, j + 1, right, compare);
  }

  var NORMAL               = 0;
  var NON_CONTRIBUTING     = 1;
  var SAME_TRANSITION      = 2;
  var DIFFERENT_TRANSITION = 3;

  var INTERSECTION = 0;
  var UNION        = 1;
  var DIFFERENCE   = 2;
  var XOR          = 3;

  /**
   * @param  {SweepEvent} event
   * @param  {SweepEvent} prev
   * @param  {Operation} operation
   */
  function computeFields (event, prev, operation) {
    // compute inOut and otherInOut fields
    if (prev === null) {
      event.inOut      = false;
      event.otherInOut = true;

    // previous line segment in sweepline belongs to the same polygon
    } else {
      if (event.isSubject === prev.isSubject) {
        event.inOut      = !prev.inOut;
        event.otherInOut = prev.otherInOut;

      // previous line segment in sweepline belongs to the clipping polygon
      } else {
        event.inOut      = !prev.otherInOut;
        event.otherInOut = prev.isVertical() ? !prev.inOut : prev.inOut;
      }

      // compute prevInResult field
      if (prev) {
        event.prevInResult = (!inResult(prev, operation) || prev.isVertical())
          ? prev.prevInResult : prev;
      }
    }

    // check if the line segment belongs to the Boolean operation
    event.inResult = inResult(event, operation);
  }


  /* eslint-disable indent */
  function inResult(event, operation) {
    switch (event.type) {
      case NORMAL:
        switch (operation) {
          case INTERSECTION:
            return !event.otherInOut;
          case UNION:
            return event.otherInOut;
          case DIFFERENCE:
            // return (event.isSubject && !event.otherInOut) ||
            //         (!event.isSubject && event.otherInOut);
            return (event.isSubject && event.otherInOut) ||
                    (!event.isSubject && !event.otherInOut);
          case XOR:
            return true;
        }
        break;
      case SAME_TRANSITION:
        return operation === INTERSECTION || operation === UNION;
      case DIFFERENT_TRANSITION:
        return operation === DIFFERENCE;
      case NON_CONTRIBUTING:
        return false;
    }
    return false;
  }
  /* eslint-enable indent */

  var SweepEvent = function SweepEvent (point, left, otherEvent, isSubject, edgeType) {

    /**
     * Is left endpoint?
     * @type {Boolean}
     */
    this.left = left;

    /**
     * @type {Array.<Number>}
     */
    this.point = point;

    /**
     * Other edge reference
     * @type {SweepEvent}
     */
    this.otherEvent = otherEvent;

    /**
     * Belongs to source or clipping polygon
     * @type {Boolean}
     */
    this.isSubject = isSubject;

    /**
     * Edge contribution type
     * @type {Number}
     */
    this.type = edgeType || NORMAL;


    /**
     * In-out transition for the sweepline crossing polygon
     * @type {Boolean}
     */
    this.inOut = false;


    /**
     * @type {Boolean}
     */
    this.otherInOut = false;

    /**
     * Previous event in result?
     * @type {SweepEvent}
     */
    this.prevInResult = null;

    /**
     * Does event belong to result?
     * @type {Boolean}
     */
    this.inResult = false;


    // connection step

    /**
     * @type {Boolean}
     */
    this.resultInOut = false;

    this.isExteriorRing = true;
  };


  /**
   * @param{Array.<Number>}p
   * @return {Boolean}
   */
  SweepEvent.prototype.isBelow = function isBelow (p) {
    var p0 = this.point, p1 = this.otherEvent.point;
    return this.left
      ? (p0[0] - p[0]) * (p1[1] - p[1]) - (p1[0] - p[0]) * (p0[1] - p[1]) > 0
      // signedArea(this.point, this.otherEvent.point, p) > 0 :
      : (p1[0] - p[0]) * (p0[1] - p[1]) - (p0[0] - p[0]) * (p1[1] - p[1]) > 0;
      //signedArea(this.otherEvent.point, this.point, p) > 0;
  };


  /**
   * @param{Array.<Number>}p
   * @return {Boolean}
   */
  SweepEvent.prototype.isAbove = function isAbove (p) {
    return !this.isBelow(p);
  };


  /**
   * @return {Boolean}
   */
  SweepEvent.prototype.isVertical = function isVertical () {
    return this.point[0] === this.otherEvent.point[0];
  };


  SweepEvent.prototype.clone = function clone () {
    var copy = new SweepEvent(
      this.point, this.left, this.otherEvent, this.isSubject, this.type);

    copy.inResult     = this.inResult;
    copy.prevInResult = this.prevInResult;
    copy.isExteriorRing = this.isExteriorRing;
    copy.inOut        = this.inOut;
    copy.otherInOut   = this.otherInOut;

    return copy;
  };

  function equals(p1, p2) {
    if (p1[0] === p2[0]) {
      if (p1[1] === p2[1]) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  // const EPSILON = 1e-9;
  // const abs = Math.abs;
  // TODO https://github.com/w8r/martinez/issues/6#issuecomment-262847164
  // Precision problem.
  //
  // module.exports = function equals(p1, p2) {
  //   return abs(p1[0] - p2[0]) <= EPSILON && abs(p1[1] - p2[1]) <= EPSILON;
  // };

  /**
   * Signed area of the triangle (p0, p1, p2)
   * @param  {Array.<Number>} p0
   * @param  {Array.<Number>} p1
   * @param  {Array.<Number>} p2
   * @return {Number}
   */
  function signedArea(p0, p1, p2) {
    return (p0[0] - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (p0[1] - p2[1]);
  }

  /**
   * @param  {SweepEvent} e1
   * @param  {SweepEvent} e2
   * @return {Number}
   */
  function compareEvents(e1, e2) {
    var p1 = e1.point;
    var p2 = e2.point;

    // Different x-coordinate
    if (p1[0] > p2[0]) { return 1; }
    if (p1[0] < p2[0]) { return -1; }

    // Different points, but same x-coordinate
    // Event with lower y-coordinate is processed first
    if (p1[1] !== p2[1]) { return p1[1] > p2[1] ? 1 : -1; }

    return specialCases(e1, e2, p1, p2);
  }


  /* eslint-disable no-unused-vars */
  function specialCases(e1, e2, p1, p2) {
    // Same coordinates, but one is a left endpoint and the other is
    // a right endpoint. The right endpoint is processed first
    if (e1.left !== e2.left)
      { return e1.left ? 1 : -1; }

    // const p2 = e1.otherEvent.point, p3 = e2.otherEvent.point;
    // const sa = (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
    // Same coordinates, both events
    // are left endpoints or right endpoints.
    // not collinear
    if (signedArea(p1, e1.otherEvent.point, e2.otherEvent.point) !== 0) {
      // the event associate to the bottom segment is processed first
      return (!e1.isBelow(e2.otherEvent.point)) ? 1 : -1;
    }

    return (!e1.isSubject && e2.isSubject) ? 1 : -1;
  }
  /* eslint-enable no-unused-vars */

  /**
   * @param  {SweepEvent} se
   * @param  {Array.<Number>} p
   * @param  {Queue} queue
   * @return {Queue}
   */
  function divideSegment(se, p, queue)  {
    var r = new SweepEvent(p, false, se,            se.isSubject);
    var l = new SweepEvent(p, true,  se.otherEvent, se.isSubject);

    /* eslint-disable no-console */
    if (equals(se.point, se.otherEvent.point)) {

      console.warn('what is that, a collapsed segment?', se);
    }
    /* eslint-enable no-console */

    r.contourId = l.contourId = se.contourId;

    // avoid a rounding error. The left event would be processed after the right event
    if (compareEvents(l, se.otherEvent) > 0) {
      se.otherEvent.left = true;
      l.left = false;
    }

    // avoid a rounding error. The left event would be processed after the right event
    // if (compareEvents(se, r) > 0) {}

    se.otherEvent.otherEvent = l;
    se.otherEvent = r;

    queue.push(l);
    queue.push(r);

    return queue;
  }

  //const EPS = 1e-9;

  /**
   * Finds the magnitude of the cross product of two vectors (if we pretend
   * they're in three dimensions)
   *
   * @param {Object} a First vector
   * @param {Object} b Second vector
   * @private
   * @returns {Number} The magnitude of the cross product
   */
  function crossProduct(a, b) {
    return (a[0] * b[1]) - (a[1] * b[0]);
  }

  /**
   * Finds the dot product of two vectors.
   *
   * @param {Object} a First vector
   * @param {Object} b Second vector
   * @private
   * @returns {Number} The dot product
   */
  function dotProduct(a, b) {
    return (a[0] * b[0]) + (a[1] * b[1]);
  }

  /**
   * Finds the intersection (if any) between two line segments a and b, given the
   * line segments' end points a1, a2 and b1, b2.
   *
   * This algorithm is based on Schneider and Eberly.
   * http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf
   * Page 244.
   *
   * @param {Array.<Number>} a1 point of first line
   * @param {Array.<Number>} a2 point of first line
   * @param {Array.<Number>} b1 point of second line
   * @param {Array.<Number>} b2 point of second line
   * @param {Boolean=}       noEndpointTouch whether to skip single touchpoints
   *                                         (meaning connected segments) as
   *                                         intersections
   * @returns {Array.<Array.<Number>>|Null} If the lines intersect, the point of
   * intersection. If they overlap, the two end points of the overlapping segment.
   * Otherwise, null.
   */
  function intersection (a1, a2, b1, b2, noEndpointTouch) {
    // The algorithm expects our lines in the form P + sd, where P is a point,
    // s is on the interval [0, 1], and d is a vector.
    // We are passed two points. P can be the first point of each pair. The
    // vector, then, could be thought of as the distance (in x and y components)
    // from the first point to the second point.
    // So first, let's make our vectors:
    var va = [a2[0] - a1[0], a2[1] - a1[1]];
    var vb = [b2[0] - b1[0], b2[1] - b1[1]];
    // We also define a function to convert back to regular point form:

    /* eslint-disable arrow-body-style */

    function toPoint(p, s, d) {
      return [
        p[0] + s * d[0],
        p[1] + s * d[1]
      ];
    }

    /* eslint-enable arrow-body-style */

    // The rest is pretty much a straight port of the algorithm.
    var e = [b1[0] - a1[0], b1[1] - a1[1]];
    var kross    = crossProduct(va, vb);
    var sqrKross = kross * kross;
    var sqrLenA  = dotProduct(va, va);
    //const sqrLenB  = dotProduct(vb, vb);

    // Check for line intersection. This works because of the properties of the
    // cross product -- specifically, two vectors are parallel if and only if the
    // cross product is the 0 vector. The full calculation involves relative error
    // to account for possible very small line segments. See Schneider & Eberly
    // for details.
    if (sqrKross > 0/* EPS * sqrLenB * sqLenA */) {
      // If they're not parallel, then (because these are line segments) they
      // still might not actually intersect. This code checks that the
      // intersection point of the lines is actually on both line segments.
      var s = crossProduct(e, vb) / kross;
      if (s < 0 || s > 1) {
        // not on line segment a
        return null;
      }
      var t = crossProduct(e, va) / kross;
      if (t < 0 || t > 1) {
        // not on line segment b
        return null;
      }
      if (s === 0 || s === 1) {
        // on an endpoint of line segment a
        return noEndpointTouch ? null : [toPoint(a1, s, va)];
      }
      if (t === 0 || t === 1) {
        // on an endpoint of line segment b
        return noEndpointTouch ? null : [toPoint(b1, t, vb)];
      }
      return [toPoint(a1, s, va)];
    }

    // If we've reached this point, then the lines are either parallel or the
    // same, but the segments could overlap partially or fully, or not at all.
    // So we need to find the overlap, if any. To do that, we can use e, which is
    // the (vector) difference between the two initial points. If this is parallel
    // with the line itself, then the two lines are the same line, and there will
    // be overlap.
    //const sqrLenE = dotProduct(e, e);
    kross = crossProduct(e, va);
    sqrKross = kross * kross;

    if (sqrKross > 0 /* EPS * sqLenB * sqLenE */) {
    // Lines are just parallel, not the same. No overlap.
      return null;
    }

    var sa = dotProduct(va, e) / sqrLenA;
    var sb = sa + dotProduct(va, vb) / sqrLenA;
    var smin = Math.min(sa, sb);
    var smax = Math.max(sa, sb);

    // this is, essentially, the FindIntersection acting on floats from
    // Schneider & Eberly, just inlined into this function.
    if (smin <= 1 && smax >= 0) {

      // overlap on an end point
      if (smin === 1) {
        return noEndpointTouch ? null : [toPoint(a1, smin > 0 ? smin : 0, va)];
      }

      if (smax === 0) {
        return noEndpointTouch ? null : [toPoint(a1, smax < 1 ? smax : 1, va)];
      }

      if (noEndpointTouch && smin === 0 && smax === 1) { return null; }

      // There's overlap on a segment -- two points of intersection. Return both.
      return [
        toPoint(a1, smin > 0 ? smin : 0, va),
        toPoint(a1, smax < 1 ? smax : 1, va)
      ];
    }

    return null;
  }

  /**
   * @param  {SweepEvent} se1
   * @param  {SweepEvent} se2
   * @param  {Queue}      queue
   * @return {Number}
   */
  function possibleIntersection (se1, se2, queue) {
    // that disallows self-intersecting polygons,
    // did cost us half a day, so I'll leave it
    // out of respect
    // if (se1.isSubject === se2.isSubject) return;
    var inter = intersection(
      se1.point, se1.otherEvent.point,
      se2.point, se2.otherEvent.point
    );

    var nintersections = inter ? inter.length : 0;
    if (nintersections === 0) { return 0; } // no intersection

    // the line segments intersect at an endpoint of both line segments
    if ((nintersections === 1) &&
        (equals(se1.point, se2.point) ||
         equals(se1.otherEvent.point, se2.otherEvent.point))) {
      return 0;
    }

    if (nintersections === 2 && se1.isSubject === se2.isSubject) {
      // if(se1.contourId === se2.contourId){
      // console.warn('Edges of the same polygon overlap',
      //   se1.point, se1.otherEvent.point, se2.point, se2.otherEvent.point);
      // }
      //throw new Error('Edges of the same polygon overlap');
      return 0;
    }

    // The line segments associated to se1 and se2 intersect
    if (nintersections === 1) {

      // if the intersection point is not an endpoint of se1
      if (!equals(se1.point, inter[0]) && !equals(se1.otherEvent.point, inter[0])) {
        divideSegment(se1, inter[0], queue);
      }

      // if the intersection point is not an endpoint of se2
      if (!equals(se2.point, inter[0]) && !equals(se2.otherEvent.point, inter[0])) {
        divideSegment(se2, inter[0], queue);
      }
      return 1;
    }

    // The line segments associated to se1 and se2 overlap
    var events        = [];
    var leftCoincide  = false;
    var rightCoincide = false;

    if (equals(se1.point, se2.point)) {
      leftCoincide = true; // linked
    } else if (compareEvents(se1, se2) === 1) {
      events.push(se2, se1);
    } else {
      events.push(se1, se2);
    }

    if (equals(se1.otherEvent.point, se2.otherEvent.point)) {
      rightCoincide = true;
    } else if (compareEvents(se1.otherEvent, se2.otherEvent) === 1) {
      events.push(se2.otherEvent, se1.otherEvent);
    } else {
      events.push(se1.otherEvent, se2.otherEvent);
    }

    if ((leftCoincide && rightCoincide) || leftCoincide) {
      // both line segments are equal or share the left endpoint
      se2.type = NON_CONTRIBUTING;
      se1.type = (se2.inOut === se1.inOut)
        ? SAME_TRANSITION : DIFFERENT_TRANSITION;

      if (leftCoincide && !rightCoincide) {
        // honestly no idea, but changing events selection from [2, 1]
        // to [0, 1] fixes the overlapping self-intersecting polygons issue
        divideSegment(events[1].otherEvent, events[0].point, queue);
      }
      return 2;
    }

    // the line segments share the right endpoint
    if (rightCoincide) {
      divideSegment(events[0], events[1].point, queue);
      return 3;
    }

    // no line segment includes totally the other one
    if (events[0] !== events[3].otherEvent) {
      divideSegment(events[0], events[1].point, queue);
      divideSegment(events[1], events[2].point, queue);
      return 3;
    }

    // one line segment includes the other one
    divideSegment(events[0], events[1].point, queue);
    divideSegment(events[3].otherEvent, events[2].point, queue);

    return 3;
  }

  /**
   * @param  {SweepEvent} le1
   * @param  {SweepEvent} le2
   * @return {Number}
   */
  function compareSegments(le1, le2) {
    if (le1 === le2) { return 0; }

    // Segments are not collinear
    if (signedArea(le1.point, le1.otherEvent.point, le2.point) !== 0 ||
      signedArea(le1.point, le1.otherEvent.point, le2.otherEvent.point) !== 0) {

      // If they share their left endpoint use the right endpoint to sort
      if (equals(le1.point, le2.point)) { return le1.isBelow(le2.otherEvent.point) ? -1 : 1; }

      // Different left endpoint: use the left endpoint to sort
      if (le1.point[0] === le2.point[0]) { return le1.point[1] < le2.point[1] ? -1 : 1; }

      // has the line segment associated to e1 been inserted
      // into S after the line segment associated to e2 ?
      if (compareEvents(le1, le2) === 1) { return le2.isAbove(le1.point) ? -1 : 1; }

      // The line segment associated to e2 has been inserted
      // into S after the line segment associated to e1
      return le1.isBelow(le2.point) ? -1 : 1;
    }

    if (le1.isSubject === le2.isSubject) { // same polygon
      var p1 = le1.point, p2 = le2.point;
      if (p1[0] === p2[0] && p1[1] === p2[1]/*equals(le1.point, le2.point)*/) {
        p1 = le1.otherEvent.point; p2 = le2.otherEvent.point;
        if (p1[0] === p2[0] && p1[1] === p2[1]) { return 0; }
        else { return le1.contourId > le2.contourId ? 1 : -1; }
      }
    } else { // Segments are collinear, but belong to separate polygons
      return le1.isSubject ? -1 : 1;
    }

    return compareEvents(le1, le2) === 1 ? 1 : -1;
  }

  function subdivide(eventQueue, subject, clipping, sbbox, cbbox, operation) {
    var sweepLine = new SplayTree(compareSegments);
    var sortedEvents = [];

    var rightbound = Math.min(sbbox[2], cbbox[2]);

    var prev, next, begin;

    while (eventQueue.length !== 0) {
      var event = eventQueue.pop();
      sortedEvents.push(event);

      // optimization by bboxes for intersection and difference goes here
      if ((operation === INTERSECTION && event.point[0] > rightbound) ||
          (operation === DIFFERENCE   && event.point[0] > sbbox[2])) {
        break;
      }

      if (event.left) {
        next  = prev = sweepLine.insert(event);
        begin = sweepLine.minNode();

        if (prev !== begin) { prev = sweepLine.prev(prev); }
        else                { prev = null; }

        next = sweepLine.next(next);

        var prevEvent = prev ? prev.key : null;
        var prevprevEvent = (void 0);
        computeFields(event, prevEvent, operation);
        if (next) {
          if (possibleIntersection(event, next.key, eventQueue) === 2) {
            computeFields(event, prevEvent, operation);
            computeFields(event, next.key, operation);
          }
        }

        if (prev) {
          if (possibleIntersection(prev.key, event, eventQueue) === 2) {
            var prevprev = prev;
            if (prevprev !== begin) { prevprev = sweepLine.prev(prevprev); }
            else                    { prevprev = null; }

            prevprevEvent = prevprev ? prevprev.key : null;
            computeFields(prevEvent, prevprevEvent, operation);
            computeFields(event,     prevEvent,     operation);
          }
        }
      } else {
        event = event.otherEvent;
        next = prev = sweepLine.find(event);

        if (prev && next) {

          if (prev !== begin) { prev = sweepLine.prev(prev); }
          else                { prev = null; }

          next = sweepLine.next(next);
          sweepLine.remove(event);

          if (next && prev) {
            possibleIntersection(prev.key, next.key, eventQueue);
          }
        }
      }
    }
    return sortedEvents;
  }

  /**
   * @param  {Array.<SweepEvent>} sortedEvents
   * @return {Array.<SweepEvent>}
   */
  function orderEvents(sortedEvents) {
    var event, i, len, tmp;
    var resultEvents = [];
    for (i = 0, len = sortedEvents.length; i < len; i++) {
      event = sortedEvents[i];
      if ((event.left && event.inResult) ||
        (!event.left && event.otherEvent.inResult)) {
        resultEvents.push(event);
      }
    }
    // Due to overlapping edges the resultEvents array can be not wholly sorted
    var sorted = false;
    while (!sorted) {
      sorted = true;
      for (i = 0, len = resultEvents.length; i < len; i++) {
        if ((i + 1) < len &&
          compareEvents(resultEvents[i], resultEvents[i + 1]) === 1) {
          tmp = resultEvents[i];
          resultEvents[i] = resultEvents[i + 1];
          resultEvents[i + 1] = tmp;
          sorted = false;
        }
      }
    }


    for (i = 0, len = resultEvents.length; i < len; i++) {
      event = resultEvents[i];
      event.pos = i;
    }

    // imagine, the right event is found in the beginning of the queue,
    // when his left counterpart is not marked yet
    for (i = 0, len = resultEvents.length; i < len; i++) {
      event = resultEvents[i];
      if (!event.left) {
        tmp = event.pos;
        event.pos = event.otherEvent.pos;
        event.otherEvent.pos = tmp;
      }
    }

    return resultEvents;
  }


  /**
   * @param  {Number} pos
   * @param  {Array.<SweepEvent>} resultEvents
   * @param  {Object>}    processed
   * @return {Number}
   */
  function nextPos(pos, resultEvents, processed, origIndex) {
    var newPos = pos + 1;
    var length = resultEvents.length;
    if (newPos > length - 1) { return pos - 1; }
    var p  = resultEvents[pos].point;
    var p1 = resultEvents[newPos].point;


    // while in range and not the current one by value
    while (newPos < length && p1[0] === p[0] && p1[1] === p[1]) {
      if (!processed[newPos]) {
        return newPos;
      } else   {
        newPos++;
      }
      p1 = resultEvents[newPos].point;
    }

    newPos = pos - 1;

    while (processed[newPos] && newPos >= origIndex) {
      newPos--;
    }
    return newPos;
  }


  /**
   * @param  {Array.<SweepEvent>} sortedEvents
   * @return {Array.<*>} polygons
   */
  function connectEdges(sortedEvents, operation) {
    var i, len;
    var resultEvents = orderEvents(sortedEvents);

    // "false"-filled array
    var processed = {};
    var result = [];
    var event;

    for (i = 0, len = resultEvents.length; i < len; i++) {
      if (processed[i]) { continue; }
      var contour = [[]];

      if (!resultEvents[i].isExteriorRing) {
        if (operation === DIFFERENCE && !resultEvents[i].isSubject && result.length === 0) {
          result.push(contour);
        } else if (result.length === 0) {
          result.push([[contour]]);
        } else {
          result[result.length - 1].push(contour[0]);
        }
      } else if (operation === DIFFERENCE && !resultEvents[i].isSubject && result.length > 1) {
        result[result.length - 1].push(contour[0]);
      } else {
        result.push(contour);
      }

      var ringId = result.length - 1;
      var pos = i;

      var initial = resultEvents[i].point;
      contour[0].push(initial);

      while (pos >= i) {
        event = resultEvents[pos];
        processed[pos] = true;

        if (event.left) {
          event.resultInOut = false;
          event.contourId   = ringId;
        } else {
          event.otherEvent.resultInOut = true;
          event.otherEvent.contourId   = ringId;
        }

        pos = event.pos;
        processed[pos] = true;
        contour[0].push(resultEvents[pos].point);
        pos = nextPos(pos, resultEvents, processed, i);
      }

      pos = pos === -1 ? i : pos;

      event = resultEvents[pos];
      processed[pos] = processed[event.pos] = true;
      event.otherEvent.resultInOut = true;
      event.otherEvent.contourId   = ringId;
    }

    // Handle if the result is a polygon (eg not multipoly)
    // Commented it again, let's see what do we mean by that
    // if (result.length === 1) result = result[0];
    return result;
  }

  var tinyqueue = TinyQueue;
  var default_1 = TinyQueue;

  function TinyQueue(data, compare) {
      var this$1 = this;

      if (!(this instanceof TinyQueue)) { return new TinyQueue(data, compare); }

      this.data = data || [];
      this.length = this.data.length;
      this.compare = compare || defaultCompare;

      if (this.length > 0) {
          for (var i = (this.length >> 1) - 1; i >= 0; i--) { this$1._down(i); }
      }
  }

  function defaultCompare(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
  }

  TinyQueue.prototype = {

      push: function (item) {
          this.data.push(item);
          this.length++;
          this._up(this.length - 1);
      },

      pop: function () {
          if (this.length === 0) { return undefined; }

          var top = this.data[0];
          this.length--;

          if (this.length > 0) {
              this.data[0] = this.data[this.length];
              this._down(0);
          }
          this.data.pop();

          return top;
      },

      peek: function () {
          return this.data[0];
      },

      _up: function (pos) {
          var data = this.data;
          var compare = this.compare;
          var item = data[pos];

          while (pos > 0) {
              var parent = (pos - 1) >> 1;
              var current = data[parent];
              if (compare(item, current) >= 0) { break; }
              data[pos] = current;
              pos = parent;
          }

          data[pos] = item;
      },

      _down: function (pos) {
          var this$1 = this;

          var data = this.data;
          var compare = this.compare;
          var halfLength = this.length >> 1;
          var item = data[pos];

          while (pos < halfLength) {
              var left = (pos << 1) + 1;
              var right = left + 1;
              var best = data[left];

              if (right < this$1.length && compare(data[right], best) < 0) {
                  left = right;
                  best = data[right];
              }
              if (compare(best, item) >= 0) { break; }

              data[pos] = best;
              pos = left;
          }

          data[pos] = item;
      }
  };
  tinyqueue.default = default_1;

  var max = Math.max;
  var min = Math.min;

  var contourId = 0;


  function processPolygon(contourOrHole, isSubject, depth, Q, bbox, isExteriorRing) {
    var i, len, s1, s2, e1, e2;
    for (i = 0, len = contourOrHole.length - 1; i < len; i++) {
      s1 = contourOrHole[i];
      s2 = contourOrHole[i + 1];
      e1 = new SweepEvent(s1, false, undefined, isSubject);
      e2 = new SweepEvent(s2, false, e1,        isSubject);
      e1.otherEvent = e2;

      if (s1[0] === s2[0] && s1[1] === s2[1]) {
        continue; // skip collapsed edges, or it breaks
      }

      e1.contourId = e2.contourId = depth;
      if (!isExteriorRing) {
        e1.isExteriorRing = false;
        e2.isExteriorRing = false;
      }
      if (compareEvents(e1, e2) > 0) {
        e2.left = true;
      } else {
        e1.left = true;
      }

      var x = s1[0], y = s1[1];
      bbox[0] = min(bbox[0], x);
      bbox[1] = min(bbox[1], y);
      bbox[2] = max(bbox[2], x);
      bbox[3] = max(bbox[3], y);

      // Pushing it so the queue is sorted from left to right,
      // with object on the left having the highest priority.
      Q.push(e1);
      Q.push(e2);
    }
  }


  function fillQueue(subject, clipping, sbbox, cbbox, operation) {
    var eventQueue = new tinyqueue(null, compareEvents);
    var polygonSet, isExteriorRing, i, ii, j, jj; //, k, kk;

    for (i = 0, ii = subject.length; i < ii; i++) {
      polygonSet = subject[i];
      for (j = 0, jj = polygonSet.length; j < jj; j++) {
        isExteriorRing = j === 0;
        if (isExteriorRing) { contourId++; }
        processPolygon(polygonSet[j], true, contourId, eventQueue, sbbox, isExteriorRing);
      }
    }

    for (i = 0, ii = clipping.length; i < ii; i++) {
      polygonSet = clipping[i];
      for (j = 0, jj = polygonSet.length; j < jj; j++) {
        isExteriorRing = j === 0;
        if (operation === DIFFERENCE) { isExteriorRing = false; }
        if (isExteriorRing) { contourId++; }
        processPolygon(polygonSet[j], false, contourId, eventQueue, cbbox, isExteriorRing);
      }
    }

    return eventQueue;
  }

  var EMPTY = [];


  function trivialOperation(subject, clipping, operation) {
    var result = null;
    if (subject.length * clipping.length === 0) {
      if        (operation === INTERSECTION) {
        result = EMPTY;
      } else if (operation === DIFFERENCE) {
        result = subject;
      } else if (operation === UNION ||
                 operation === XOR) {
        result = (subject.length === 0) ? clipping : subject;
      }
    }
    return result;
  }


  function compareBBoxes(subject, clipping, sbbox, cbbox, operation) {
    var result = null;
    if (sbbox[0] > cbbox[2] ||
        cbbox[0] > sbbox[2] ||
        sbbox[1] > cbbox[3] ||
        cbbox[1] > sbbox[3]) {
      if        (operation === INTERSECTION) {
        result = EMPTY;
      } else if (operation === DIFFERENCE) {
        result = subject;
      } else if (operation === UNION ||
                 operation === XOR) {
        result = subject.concat(clipping);
      }
    }
    return result;
  }


  function boolean(subject, clipping, operation) {
    if (typeof subject[0][0][0] === 'number') {
      subject = [subject];
    }
    if (typeof clipping[0][0][0] === 'number') {
      clipping = [clipping];
    }
    var trivial = trivialOperation(subject, clipping, operation);
    if (trivial) {
      return trivial === EMPTY ? null : trivial;
    }
    var sbbox = [Infinity, Infinity, -Infinity, -Infinity];
    var cbbox = [Infinity, Infinity, -Infinity, -Infinity];

    //console.time('fill queue');
    var eventQueue = fillQueue(subject, clipping, sbbox, cbbox, operation);
    //console.timeEnd('fill queue');

    trivial = compareBBoxes(subject, clipping, sbbox, cbbox, operation);
    if (trivial) {
      return trivial === EMPTY ? null : trivial;
    }
    //console.time('subdivide edges');
    var sortedEvents = subdivide(eventQueue, subject, clipping, sbbox, cbbox, operation);
    //console.timeEnd('subdivide edges');

    //console.time('connect vertices');
    var result = connectEdges(sortedEvents, operation);
    //console.timeEnd('connect vertices');
    return result;
  }

  function union (subject, clipping) {
    return boolean(subject, clipping, UNION);
  }

  function diff (subject, clipping) {
    return boolean(subject, clipping, DIFFERENCE);
  }

  function xor (subject, clipping){
    return boolean(subject, clipping, XOR);
  }

  function intersection$1 (subject, clipping) {
    return boolean(subject, clipping, INTERSECTION);
  }

  /**
   * @enum {Number}
   */
  var operations = { UNION: UNION, DIFFERENCE: DIFFERENCE, INTERSECTION: INTERSECTION, XOR: XOR };

  exports.union = union;
  exports.diff = diff;
  exports.xor = xor;
  exports.intersection = intersection$1;
  exports.operations = operations;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}]},{},[1])(1)
});
