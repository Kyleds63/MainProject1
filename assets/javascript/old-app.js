var query;
var locations={
  title:[],
  latitude:[],
  longitude:[]
};
var splitStart;
var splitEnd;
var search;


// need an ID in the index for query to grab from

//when clicking on this prototype button, we can set the date.
$('#submit').on("click", function(){

  query = $("#queryUse :selected").attr("value");
  search = $("#navSearchBox").val().trim();

  //set dates from values in the calader input
  var startDate = $('#startDate').val();
  var endDate = $('#endDate').val();
  //eventful processes dates as YYYYMMDD00. Adding 00 to the end of the numbers.
  var finalStart = startDate + "00";
  var finalEnd = endDate + "00";
  //removing hyphens in the numbers generated from the calander so eventful can read them.
  splitStart = finalStart.split('-').join('');
  splitEnd = finalEnd.split('-').join('');
  createEvents();
  });

//Here we are setting up our specs to create the search.


//-----------------------------------------------------------------------------------//
// To Do: 1. link query to HTML, default to music. 2.sort by as a variable, such as date?
//


function createEvents(){

  var Events = {

  app_key: "SGJgVSbsbgT3pbP3",

  q: search,
  
  // Category
  c: query,
  
  // Location
  location: ("30.307182, -97.755996"),
  within: 15,
  
  // Sort the events in order of popularity
  sort_order: "popularity",
  
  // Start and End Date
  "date": splitStart + "_" + splitEnd,

  // Number of Items to Pull Up
  page_size: 50
  };

  // This function does the searching
  EVDB.API.call("/events/search", Events, function(findEvents) {

    //Display the items on the page for testing purposes
       console.log(findEvents.events.event.length);
       for (i=0;i<findEvents.events.event.length;i++){
       $("#placeholder").append("<br>");
       //title of events
       $("#placeholder").append(findEvents.events.event[i].title);
       $("#placeholder").append("<br>");
       //start time of events
       $("#placeholder").append(findEvents.events.event[i].start_time);
       $("#placeholder").append("<br>");
       //location of events
       $("#placeholder").append(findEvents.events.event[i].city_name);
 
      locations.title[i]     = findEvents.events.event[i].title;
      locations.latitude[i]  = findEvents.events.event[i].latitude;
      locations.longitude[i] = findEvents.events.event[i].longitude;
    }
   
    return initMap(locations);

  }, initMap);


}




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
    checkForCrime(myLatlng);
    console.log('hey number '+ i);
    var marker = new google.maps.Marker({
      position: myLatlng,
      title: locations.title[i]
    });
    marker.setMap(map);
  }
}
