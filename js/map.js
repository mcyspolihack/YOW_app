var dat = "test"; 
var subj = "test";

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


function getColor(d)
{
	return d > 1000 ? '#084594' :
           d > 500  ? '#2171b5' :
           d > 200  ? '#4292c6' :
           d > 100  ? '#6baed6' :
           d > 50   ? '#9ecae1' :
           d > 20   ? '#c6dbef' :
           d > 10   ? '#deebf7' :
                      '#f7fbff';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties[window.dat]),
        weight: 1,
        opacity: 1,
        color: 'white',        
        fillOpacity: 0.6
    };
}


function buttonSelector(topic)
{
	switch(topic)
	{
		case "Targ_Pop":
			text = '<h5>Target Population (MCYS)</h5>'
            + '<input type="radio" name="Targ_Pop" value="YCL"> YCL<br>'
	  		+ '<input type="radio" name="Targ_Pop" value="RY"> RY<br>'
	  		+ '<input type="radio" name="Targ_Pop" value="HL"> HL<br>'
            + '<input type="radio" name="Targ_Pop" value="YM"> YM<br>'
            + '<input type="radio" name="Targ_Pop" value="GIY"> GIY<br>'
            + '<input type="radio" name="Targ_Pop" value="NETY"> NETY<br>'
            + '<input type="radio" name="Targ_Pop" value="YP"> YP<br>'
            + '<input type="radio" name="Targ_Pop" value="LGBY"> LGBY<br>'
	  		+ '<input type="radio" name="Targ_Pop" value="NET"> NET';
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
			text = '<h5>Coming Soon!</h5>';
			return text;
			break;	
	}

}

var mymap = L.map('mapid',{ zoomControl:false }).setView([43.6532, -79.3832], 6);

<<<<<<< HEAD
L.control.zoom({position: 'topright'}).addTo(mymap)


var pts = uploadFile("data/geojson/YOW_data.geojson");
console.log(pts);
=======
        L.control.zoom({position: 'topright'}).addTo(mymap);


        var pts = uploadFile("data/geojson/YOW_data.geojson");
        console.log(pts);
>>>>>>> d0fe6901e616aa923d47e5bc1c6bd961cd7224f6

var ptsLayer = L.geoJson(pts).addTo(mymap);

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
        //ptsLayer.clearLayers();
        //L.geoJson(pts).addTo(mymap);
    }
    document.getElementById("buttons").onchange = function()
    {      
        dat = document.querySelector('input[type="radio"]:checked').value;               
        ptsLayer.clearLayers();
        ptsLayer = L.geoJson(pts, {
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