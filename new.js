var map;
var pickupMarkers = [];
var orgMarkers = [];
var autocomplete;
var currmarker;
var user;
var place;
var currtableId;
var directionsService;
var directionsRenderer;
var pos;
const submitButton = document.getElementById('submitButton');
const searchboxInput = document.getElementById('searchbox');
submitButton.onclick = userSubmitEventHandler;
searchboxInput.onkeyup = userSubmitEventHandler;
const donorChoice = document.getElementById('donorChoice');
const orgChoice = document.getElementById('orgChoice');
donorChoice.onclick = userChoiceHandler;
orgChoice.onclick = userChoiceHandler;
const editButton = document.getElementById('editButton');
editButton.onclick = editHandler;
const subform = document.getElementById('subform');
const orgNav = document.getElementById('orgNav');
const donorNav = document.getElementById('donorNav');
const topNav = document.getElementById('topnav');
const editText = document.getElementById('editText');
var DOMLoaded = false;
var markersArray = [];
const donorText = document.getElementById('donorText');
const orgText = document.getElementById('orgText');

donorChoice.addEventListener('mouseover', function() {
    donorText.style.textDecoration = 'underline';
});
donorChoice.addEventListener('mouseout', function() {
    donorText.style.textDecoration = 'none';
});
orgChoice.addEventListener('mouseover', function() {
    orgText.style.textDecoration = 'underline';
});
orgChoice.addEventListener('mouseout', function() {
    orgText.style.textDecoration = 'none';
});
  
function setEditText(user) {
if(user == 'org')
    editText.innerHTML = 'Add your organization to the map';
else
    editText.innerHTML = 'Add a donation for pickup';
}

class Marker {
    constructor(marker, place, type) {
        this.marker = marker;
        this.place = place;
        this.type = type; // type is either org or donor
    }

    getPlace() {
        return this.place;
    }
    getMarker() {
        return this.marker;
    }
    getType() {
        return this.type;
    }
};


document.addEventListener("DOMContentLoaded", function() { DOMLoaded = true;});

orgNav.addEventListener('click', function(){
    user = 'org';
    hideById('subform');
    hideById('donorTable');
    hideById('orgTable');
    currtableId = 'orgTable';
    showTableById(currtableId);
    console.log("user: " + user);
    setEditText(user);
});
donorNav.addEventListener('click', function(){
    user = 'donor';
    hideById('subform');
    hideById('donorTable');
    hideById('orgTable');
    currtableId = 'donorTable';
    showTableById(currtableId);
    console.log("user: " + user);
    setEditText(user);
});

function showTableById(tableId)
{
    document.getElementById(tableId).style.display = 'table';
    console.log(`showed table: ${tableId}`)
}

function displayById(elementId) {
    var element = document.getElementById(elementId);
    element.style.display = 'block';
    console.log(`displayed: ${elementId}`);
}
function hideById(elementId) {
    var element = document.getElementById(elementId);
    element.style.display = 'none';
    console.log(`hid: ${elementId}`);
}

var firstEditInteraction = true;
function editHandler(){

    if(subform.style.display == 'none' || firstEditInteraction) {
        let i = 1;
        while(i<5) { 
            if (DOMLoaded)
                i = 6;
        }
        displayById('subform');
        console.log('user i want: ' + user);

        //set placeholder for form
        if(user == 'donor') {
            document.getElementById('orgNameInput').placeholder = 'List of items';
        }
        else
            document.getElementById('orgNameInput').placeholder = 'Organization name';

        firstEditInteraction = false;
    }
    else {
        hideById('subform');
        firstEditInteraction = false;
    }
}


function userChoiceHandler(event) 
{
    if(event.currentTarget.id == 'donorChoice') {
        user = 'donor';
        currtableId = 'donorTable';
    setEditText(user);

    }
    else {
        user = 'org';
        currtableId = 'orgTable';
    setEditText(user);

    }
    console.log(`user: ${user}`);
    
    hideById('userChoice');
    displayById('map');
    
    displayById('editButton');

    hideById('orgTable');
    hideById('donorTable');

    if(DOMLoaded)
        displayById('topnav');
       
    showTableById(currtableId);
}



function userSubmitEventHandler(event) {
    if (
        (event.keyCode && event.keyCode === 13) ||
        event.type === 'click'
    ) {
        let info = document.getElementById('orgNameInput').value;
        // var editBtn = document.getElementById('editButton');
        // subform.style.display ='block';
        //choose style and place marker
        var iconUrl = './donorMarker.png';
        if(user=='org') iconUrl = './orgMarker.png'
        var icon = {
            url: iconUrl, // url
            scaledSize: new google.maps.Size(60, 60), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(30, 60) // anchor
        };
        
        currmarker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          animation:google.maps.Animation.DROP,
          icon: icon
        });
        console.log("user of submitted marker: " + user);
        let type =(user=="donor") ? "donor" : "org";
        let markerToAdd = new Marker(currmarker, place, type);
        markersArray.push(markerToAdd);

        let contentString = '<h3>' + place.name + '</h3>';
        const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
        currmarker.addListener('click', () => {calcRoute(currmarker);});
        currmarker.addListener('mouseover',  () => {
            infowindow.open({
                anchor: currmarker,
                map,
                shouldFocus: false,
            });
        });
        currmarker.addListener('mouseout',  () => {
            infowindow.close();
        });
        //google.maps.event.addListener(currmarker, 'click', markerEventHandler(currmarker));
        console.log("submitted marker");
        addMarkerToTable(currmarker,currtableId, info);
    }  
}

function initMap() {

    //create new direction service
    directionsService = new google.maps.DirectionsService();


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
              console.log(`user lat: ${position.coords.latitude}`);
              console.log(`user lng: ${position.coords.longitude}`);


             pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              
            map.setCenter(pos);
          },
          () => {
            console.log('error getting location');
          }
        );
      } else {
        // Browser doesn't support Geolocation
        console.log('error getting location');
      }


      map = new google.maps.Map(document.getElementById('map'), {
        center: pos, //center of US
        zoom: 11,
    });
    

    // Create a renderer for directions and bind it to the map.
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });


    //initiate google autocomplete places searchbox
    autocomplete = new google.maps.places
        .Autocomplete(document.getElementById("searchbox"), {
            componentRestrictions: { 'country': ['US'] },
            fields: ['geometry','name'/*, 'adr_address'*/]
        });
    autocomplete.addListener('place_changed', onPlaceChanged);
    console.log("map initialized");
}


function onPlaceChanged() {
    place = autocomplete.getPlace();
    if (!place.geometry) {
        console.log("place.geometry couldn't be found");
        //reset
        document.getElementById('searchbox').innerText = 'incomplete';
    }
    else {
        console.log(place);
        map.setZoom(11); 
        map.panTo(place.geometry.location);
    }
}



function markerEventHandler(marker) {
    calcRoute(marker);
}


function addMarkerToTable(marker, tableId, info) {
    let oppositeTable = 'orgTable';
    if(tableId == 'orgTable')
        oppositeTable = 'donorTable';
    const table1 = document.getElementById(oppositeTable);
    let newRow = document.createElement('tr');
    let newEntry = document.createElement('td');
    let hdr = document.createElement('h3');
    let para = document.createElement('p');
    console.log(place.name);
    let paraText = document.createTextNode(info);
    let hdrText = document.createTextNode(place.name); 
    if (user == 'org' )
        [paraText, hdrText] = [hdrText, paraText]; //swaps
   
    newRow.addEventListener('click', function(event) {
        if(DOMLoaded) {
        console.log('target is: ');
        console.log(event.currentTarget);
        let wantedElement = (user=='donor') ? 'p' : 'h3';
        let children = event.currentTarget.getElementsByTagName(wantedElement);
        console.log('children:');
        console.log(children);
        let clickedNameElem = children.item(0);
        console.log(clickedNameElem);
        let clickedName = clickedNameElem.innerHTML;
        console.log(clickedName);
        let typeToFind = (user=='donor')? "org" : "donor"; //inverts user
        let foundMarker;
        console.log("clicked: " + clickedName);
        console.log("Markers array:");
        console.log(markersArray);
        
        console.log(clickedName == markersArray[0].getPlace().name);
        for (let i = 0; i < markersArray.length; i++)
        {

            if (markersArray[i].getPlace().name == clickedName 
                && markersArray[i].getType() == typeToFind)
                {
                    foundMarker = markersArray[i];
                    console.log("found marker:");
                    console.log(foundMarker);
                }
                
        }
        
        map.panTo(foundMarker.getMarker().getPosition());
        map.setZoom(13);
    }
    });
    para.appendChild(paraText);
    hdr.appendChild(hdrText);
    newEntry.appendChild(hdr);
    newEntry.appendChild(para);
    newRow.appendChild(newEntry);
    table1.appendChild(newRow);


}

function calcRoute(marker) {
    var start = { lat: 44.5, lng: 265 }; //center of US
 console.log('place of marker clicked: ' + marker.getPosition());
    var request = {
      origin: pos,
      destination: marker.getPosition(),
      travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
  }

