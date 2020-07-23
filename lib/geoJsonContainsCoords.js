const { geoContains } = require('d3');
const rewind = require('@mapbox/geojson-rewind');

const geoJsonContainsCoords = (polygonsObj, latlng) => {
  if (!polygonsObj) {
    return false;
  }
  const { lat, lng } = latlng;
  const rwGeoJson = rewind(polygonsObj, true);
  return geoContains(rwGeoJson, [lng, lat]);
};

module.exports = geoJsonContainsCoords;
