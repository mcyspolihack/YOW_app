/**
 * Created by sonal on 2016-07-17.
 */
mapboxgl.accessToken = 'pk.eyJ1Ijoic29uYWxyIiwiYSI6ImI3ZGNmNTI1Mzc1NzFlYTExMGJkZTVlZDYxYWY4NzJmIn0.wxeViIZtMPq2IPoD9mB5qQ';

// Initialize new MapBox Map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.3832,43.6532],
    zoom: 13
});
map.on('style.load', function(){
    map.addSource('yow',{
        "type": "geojson",
        "data": "https://raw.githubusercontent.com/PoliHackSteppingStones/steppingstonesMapbox/master/yow-GJ.json"
    });

    map.addLayer({
        "id":"yow",
        "type": "circle",
        "source": "yow",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#ff0000"
        }
    });

});

// When a click event occurs near a place, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['yow'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];

    // Populate the popup and set its coordinates
    // based on the feature found.
    var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.Org_Name)
        .addTo(map);
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['yow'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});
map.addControl(new mapboxgl.Geolocate({position: 'top-left'}));
