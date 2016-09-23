var dat = "test"; 
var subj = "test";

var popup = L.popup();//initialize new popup var

/* function used to determine where a user has clicked on a map */
function onMapClick(e){
  popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

function uploadFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file,  false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {	                
                console.log('Uploaded:' + file);	               
            }
        }
    }
    rawFile.send();
    return JSON.parse(rawFile.responseText);
}

function buttonSelector(topic)
{
	switch(topic)
	{
		case "Targ_Pop":
			text = '<h5>Target Population (MCYS)</h5>'
            + '<input type="radio" name="Targ_Pop" value="YCL"> Youth in conflict with the law<br>'
	  		+ '<input type="radio" name="Targ_Pop" value="RY"> Racialized youth<br>'
	  		+ '<input type="radio" name="Targ_Pop" value="HL"> Homeless youth<br>'
            + '<input type="radio" name="Targ_Pop" value="YM"> Youth with lived experience of a mental illness<br>'
            + '<input type="radio" name="Targ_Pop" value="GIY"> Gang involved youth<br>'
            + '<input type="radio" name="Targ_Pop" value="NETY"> Youth not in education, employment or training<br>'
            + '<input type="radio" name="Targ_Pop" value="YP"> Youth living in poverty<br>'
            + '<input type="radio" name="Targ_Pop" value="LGBY"> LBTTQ youth';
			return text;
			break;

		case "Targ_Pop_Spe":
			text = '<h5>Target Population (YOW)</h5><input type="radio" name="Targ_Pop_Spec" value="LGBTQ"> LGBTQ<br>'
	  		+ '<input type="radio" name="Targ_Pop_Spec" value="African Canadian"> African Canadian<br>'
	  		+ '<input type="radio" name="Targ_Pop_Spec" value="General"> General<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Chinese"> Chinese<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Indigenous"> Indigenous<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Roma"> Roma<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Social Media"> Social Media<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Tamil"> Tamil<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Youth Justice"> Youth Justice<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Concurrent Disorder"> Concurrent Disorder<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Afghan"> Afghan<br>'
            + '<input type="radio" name="Targ_Pop_Spec" value="Somali"> Somali<br>'
			return text;
			break;	

            		

		default:
      text = 'All of the YOW agencies for you!';
			var ptsLayer = L.geoJson(pts, {
        onEachFeature: onEachFeature
      }).addTo(mymap);
      return text;
			break;	
	}

}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.Full_Address) {
        //console.log(feature.properties);
        layer.bindPopup("<b>Organization Name: </b>" + " " + feature.properties.Org_Name + "<br>" +
          "<b>Address: </b>" + " " + feature.properties.Full_Address + "<br>" +
          "<b>Target Community: </b>" + " " + feature.properties.Targ_Comm + "<br>" +
          "<b>Target Population: </b>" + " " + feature.properties.Targ_Pop + "<br>" +
          "<b>Target Age: </b>" + " " + feature.properties.Targ_Age + "<br>" +
          "<b>Website: </b>" + " <a target='_blank' href=" + feature.properties.Website + ">" + feature.properties.Website + 
          "</a>" + "<br>" +
          "<b>Target Population Specification: </b>" + " " + feature.properties.Targ_Pop_Spe + "<br>" +
          "<b>Hours: </b>" + " " + feature.properties.Hours + "<br>" +
          "<b>Phone #: </b>" + " <a href=tel:" + feature.properties.Phone_Number + " >" + feature.properties.Phone_Number + 
          "</a>" + "<br>" +
          "<b>Lead Agency: </b>" + " " + feature.properties.Lead_Agency + "<br>" +
          "<b>YOW FTE: </b>" + " " + feature.properties.YOW_FTE + "<br>" +
          "<b>EYOW FTE: </b>" + " " + feature.properties.EYOW_FTE + "<br>" 
        );
    }
}

var mymap = L.map('mapid',{ zoomControl:false }).setView([43.6532, -79.3832], 6);

L.control.zoom({position: 'topright'}).addTo(mymap)

var pts = uploadFile("data/geojson/YOW_data.geojson");
console.log(pts);

var ptsLayer = L.geoJson(pts, {
  onEachFeature: onEachFeature
}).addTo(mymap);
   
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(mymap);

window.onload = function(){
    document.getElementById("topicSelect").onchange = function()
    {            
        subj = document.getElementById("topicSelect").value
        console.log(subj)
        document.getElementById("buttons").innerHTML = buttonSelector(document.getElementById("topicSelect").value)
    }
    document.getElementById("buttons").onchange = function()
    {      
        dat = document.querySelector('input[type="radio"]:checked').value;               
        ptsLayer.clearLayers();
        ptsLayer = L.geoJson(pts, {
            onEachFeature: onEachFeature,
            filter: function(feature, layer) {
                console.log(feature.properties[subj])
                if(feature.properties[subj] != null){
                    return feature.properties[subj].indexOf(dat) != -1
                }
                
            }
        }).addTo(mymap);      
    }

    var myIcon = L.icon({
    iconUrl: 'img/marker.svg',
    iconSize: [38, 95]
});

    var options = {
  		bounds: true,
  		position: 'topright',
  		expanded: true,
      markers: true,
      markers: {draggable: false, icon: myIcon},
      autocomplete: true,
      place: true,
      panToPoint: true
	};

  L.control.geocoder('mapzen-Ltbsia1', options).addTo(mymap);
};