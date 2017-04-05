var Query;
var locations={
  title:[],
  latitude:[],
  longitude:[]
};



Query = "music";
function createEvents(){

  var Events = {

  app_key: "SGJgVSbsbgT3pbP3",

  c: Query,

  where: "Austin",

  t: "This+Weekend"


  };

  EVDB.API.call("/events/search", Events, function(findEvents) {



    for (i=0;i<findEvents.events.event.length;i++){
      locations.title[i]     = findEvents.events.event[i].title;
      locations.latitude[i]  = findEvents.events.event[i].latitude;
      locations.longitude[i] = findEvents.events.event[i].longitude;
    }
   
    return initMap(locations);

  }, initMap);


}

createEvents();


var map;

//Create a new blank array for all the listing markers.
var markers =[];



function initMap(){
  //Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 30.307182, lng: -97.755996},
    zoom: 13
  });
  for(var i=0;i<locations.title.length;i++){
    var myLatlng = new google.maps.LatLng(locations.latitude[i],locations.longitude[i]);
    var marker = new google.maps.Marker({
      position: myLatlng,
      title: locations.title[i]
    });
    marker.setMap(map);
  }
}
