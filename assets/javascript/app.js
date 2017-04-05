
$(document).ready(function(){


var eventData;
var query;
// var locations={
//   title:[],
//   latitude:[],
//   longitude:[]
// };
var splitStart;
var splitEnd;
var search;
var map;
var markers =[];
initMap();

function initMap(){
  //Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 30.2229111, lng: -97.7594106},
    zoom: 12
  });
 }



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
  console.log("wtf2");
  createEvents();
  });

//Here we are setting up our specs to create the search.


//-----------------------------------------------------------------------------------//
// To Do: 1. link query to HTML, default to music. 2.sort by as a variable, such as date?
//


function createEvents(){
  console.log("wtf");
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
  "date": splitStart + "-" + splitEnd,

  // Number of Items to Pull Up
  page_size: 100
  };

  // This function does the searching
  EVDB.API.call("/events/search", Events, function(findEvents) {
    console.log(findEvents);
     
     
    //Display the items on the page for testing purposes
       console.log(findEvents.events.event.length);
       for (j=0;j<findEvents.events.event.length;j++){
        console.log("test " + j);
       $("#placeholder").append("<br>");
       //title of events
       $("#placeholder").append(findEvents.events.event[j].title);
       $("#placeholder").append("<br>");
       //start time of events
       $("#placeholder").append(findEvents.events.event[j].start_time);
       $("#placeholder").append("<br>");
       //location of events
       $("#placeholder").append(findEvents.events.event[j].city_name);
 
      var myLatlng = new google.maps.LatLng(findEvents.events.event[j].latitude,findEvents.events.event[j].longitude);
      checkForCrime(myLatlng);
      console.log('hey number '+ j);

      var marker = new google.maps.Marker({
      position: myLatlng,
      title: "hey"
      });
    marker.setMap(map);
    } 
  });
}

//------------------------------------------------------
//     Zachs crime circle code 
//------------------------------------------------------
//call checkForCrime("googlelatlng variable"); this will create
//a circle at the latlng


//global map variable
var map;  

//global crimeData variable
var crimeData;

//global variable for circle color;
var color = '#89ae4f';

$.ajax({
    url: "https://data.austintexas.gov/resource/rkrg-9tez.json?$where=longitude > -999",
    type: "GET",
    data: {
      "$limit" : 8000,
      "$$app_token" : "LOC6kIi383RsP58xLXRsWHNDh"
    }
      }).done(function(data) {
        //alert("Retrieved " + data.length + " records from the dataset!");
        crimeData = data;

     });

  //place a cirle on map with calculated location and color
  function placeMarker(location, color) {
    console.log(color);
      var circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.3,
        strokeWeight: 0,
        fillColor: color,
        fillOpacity: 0.4,
        map: map,
        center: location,
        radius: 1000

      });
  }

    //crime variables
    var theft = 0;
    var rape = 0;
    var bov = 0;
    var poss = 0;
    var harassment = 0;
    var ctn = 0;
    var fraud = 0;
    var autotheft = 0;
    var agg = 0;
    var rape = 0;

    //check for specific crimes
    var check = false;

    //function for counting crime in a specific area
    function checkForCrime(position){
      //console.log(position);
      //console.log(position.lat());

      
      //number of crime instances in an area
      var countCrime = 0;

      //set lat and lng of point
      var latIn = position.lat();
      var lngIn = position.lng();

      //ceate square
      var latA = latIn - .009;
      var lngA = lngIn + .009;

      var latB = latIn + .009;
      var lngB = lngIn + .009;

      var latC = latIn - .009;
      var lngC = lngIn - .009;

      var latD = latIn + .009;
      var lngD = lngIn - .009;

      //square test
      // var myLatlngA = new google.maps.LatLng(latA,lngA);
      // var myLatlngB = new google.maps.LatLng(latB,lngB);
      // var myLatlngC = new google.maps.LatLng(latC,lngC);
      // var myLatlngD = new google.maps.LatLng(latD,lngD);

      // var markerA = new google.maps.Marker({
      //   position: myLatlngA,
      //   title: "Point A " + latA + " " + lngA
      // })
      // var markerB = new google.maps.Marker({
      //   position: myLatlngB,
      //   title: "Point B" + latB + " " + lngB
      // })
      // var markerC = new google.maps.Marker({
      //   position: myLatlngC,
      //   title: "Point C" + latC + " " + lngC
      // })
      // var markerD = new google.maps.Marker({
      //   position: myLatlngD,
      //   title: "Point D" + latD + " " + lngD
      // })

      // markerA.setMap(map);
      // markerB.setMap(map);
      // markerC.setMap(map);
      // markerD.setMap(map);

      //loop to test crime data
      for(i=0;i< crimeData.length;i++){

        //check is default false
        check = false;
        
        //check data for crime types
        switch(crimeData[i].crime_type){
        case "THEFT":
          theft++;
          check = true;
          break;
        case "BURGLARY OF VEHICLE":
          bov++;
          check = true;
          break;
        case "INJURY TO ELDERLY PERSON":
          agg++;
          check = true;
          break;
        case "HARASSMENT":
          harassment++;
          check = true;
          break;
        case "CRIMINAL TRESPASS NOTICE":
          ctn++;
          check = true;
          break;
        case "AUTO THEFT":
          autotheft++;
          check = true;
          break; 
        case "AGG ASSAULT":
          agg++;
          check = true;
          break;
        case "ASSAULT  CONTACT-SEXUAL NATURE":
          agg++;
          check = true;
          break;
        case "POSS OF DRUG PARAPHERNALIA":
          poss++;
          check = true;
          break;
        case "PUBLIC INTOXICATION":
          poss++;
          check = true;
          break;
        case "AGG ASLT STRANGLE/SUFFOCATE":
          agg++;
          check = true;
          break;
        case "THEFT OF BICYCLE":
          theft++;
          check = true;
          break; 
        case "POSS MARIJUANA":
          poss++;
          check = true;
          break; 
        case "DEBIT CARD ABUSE":
          theft++;
          check = true;
          break;
        case "OUT OF CITY AUTO THEFT":
          theft++;
          check = true;
          break;
        case "POSS SYNTHETIC MARIJUANA":
          poss++;
          check = true;
          break;
        case "ASSAULT BY CONTACT":
          agg++;
          check = true;
          break;
        case "ASSAULT W/INJURY-FAM/DATE VIOL":
          agg++;
          check = true;
          break;
        case "ASSAULT WITH INJURY":
          agg++;
          check = true;
          break;
        case "FRAUD - OTHER":
          theft++;
          check = true;
          break;
        case "CRIMINAL MISCHIEF":
          harassment++;
          check = true;
          break;
        case "DAMAGE CITY PROP":
          harassment++;
          check = true;
          break;
        case "POSS CONTROLLED SUB/NARCOTIC":
          poss++;
          check = true;
          break;
        case "TERRORISTIC THREAT":
          agg++;
          check = true;
          break; 
        case "RAPE":
          rape++;
          check = true;
          break; 
        case "THEFT FROM PERSON":
          theft++;
          check = true;
          break; 
        case "ASSAULT BY THREAT":
          agg++;
          check = true;
          break; 
        case "ROBBERY BY ASSAULT":
          agg++;
          check = true;
          break; 
        case "POSS DANG DRUG":
          poss++;
          check = true;
          break; 
        case "IDENTITY THEFT":
          theft++;
          check = true;
          break;
        case "DEADLY CONDUCT":
          agg++;
          check = true;
          break;
        case "FORCED SODOMY":
          rape++;
          check = true;
          break;                                 
                                        
        }

       //if check passed 
       if(check === true){
         

          //lat and lng data testing
          // console.log("--------------------");
          // console.log(data[i].longitude);

          // console.log(lngA);
          // console.log(lngC);

          // console.log("--------------------");

          // console.log(data[i].latitude);

          // console.log(latD);
          // console.log(latC);

          //checks if point is inside square
          if ((crimeData[i].latitude <= latD) && (crimeData[i].latitude >= latC) 
            && (crimeData[i].longitude <= lngA) && (crimeData[i].longitude >= lngC)){
            countCrime++;
          }
        }
      }
      //print out crime types and numbers
      // console.log("Theft: " + theft);
      // console.log("Rape: " + rape);
      // console.log("Harassment: " + harassment);
      // console.log("Criminal Trespass Notice: " + ctn);
      // console.log("Auto Theft: " + autotheft);
      // console.log("AGG ASSAULT: " + agg);
      // console.log("latitude: " + lat);  

      //log crime count
      console.log("this much crime: " + countCrime);

      //default cirle color
      color = '#89ae4f';

      //yellow
      if (countCrime >= 15 && countCrime < 30){
        color = '#fbd05d';

        //red
      }else if(countCrime >= 30){
        color = '#f15c32';
      }
      
      //call cirlce function
      placeMarker(position, color);

    } 




})







 
  
