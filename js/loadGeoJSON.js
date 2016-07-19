/**
 * Created by sonal on 2016-07-17.
 */
mapboxgl.accessToken = 'pk.eyJ1Ijoic29uYWxyIiwiYSI6ImI3ZGNmNTI1Mzc1NzFlYTExMGJkZTVlZDYxYWY4NzJmIn0.wxeViIZtMPq2IPoD9mB5qQ';

// Initialize new MapBox Map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/basic-v8',
    center: [-79.3832,43.6532],
    zoom: 11
});

//Grab GeoJSON data and store into object
var yowGJ = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url':"https://raw.githubusercontent.com/PoliHackSteppingStones/steppingstonesMapbox/master/yow-GJ.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

map.on('style.load', function(){
    //Load object as data for map
    map.addSource('yow',{
        "type": "geojson",
        "data": yowGJ
    });

    yowGJ.features.forEach(function(feature){
        var serviceSpecific = feature.properties['specific_service'];//Grab data to feed into filter
        var layerID = 'yow-' + serviceSpecific;
        console.log(serviceSpecific);
        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                "id":layerID,
                "type": "symbol",
                "source": "yow",
                "layout": {
                    "icon-image": "marker-15"
                },
                "filter": ["==", "specific_service", serviceSpecific]
            });
        }

    });

});

// When a click event occurs near a place, open a popup at the location of
// the feature, with description HTML from its properties.
map.on('click', function (e) {
    console.log(e);
    var features = map.queryRenderedFeatures(e.point, { layers: ['yow'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];

    // Populate the popup and set its coordinates
    // based on the feature found.
    var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML('<ul>'+'<h3>'+feature.properties.Org_Name + '</h3>' +
                 '<li>'+'<b>Address: </b>' + feature.properties.Address_w + '</li>' +
                 '<li>'+'<b>Target Age: </b>' + feature.properties.Targ_Age + '</li>' +
                 '<li>'+'<b>Postal Code: </b>' + feature.properties.postal + '</li>' +
                 '<li>'+'<b>Service Category: </b>'+ feature.properties.specific_service +'</li>' +
                 '<li>'+'<b>Website: </b>'+'<a target="_blank" href="'+feature.properties.Website+'">'+ feature.properties.Website + '</a>'+'</li>' +
                 '<li>'+'<b>Phone: </b>'+'<a href="tel:'+feature.properties.phone+'">'+feature.properties.phone+'</a>'+'</li>' +
                 '<li>'+'<b>Hours: </b>'+feature.properties.Hours+'</li>'+
                 '<li>'+'<b>Gender: </b>'+feature.properties.Gender+'</li>'

        +'</ul>')
        .addTo(map);
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['yow'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});
map.addControl(new mapboxgl.Geolocate({position: 'top-left'}));
