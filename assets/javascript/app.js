$(document).ready(function(){
var ratingIn;
var eventResultList = [];
var eventData;
var query;
var splitStart;
var splitEnd;
var search;
var map;
var markers =[];
var circle;
var testicon = {
  url: "assets/images/iconGreen.png",
  size: new google.maps.Size(71, 71),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(17, 34),
  scaledSize: new google.maps.Size(25, 35)
};
initMap();

$("#addEvent").html("<img src = 'assets/images/gps.svg'\"></img>");

function event(num,id,latlng,image,starttime,title,venuename,venueaddress,url,venueurl,description,cityname,rating){
  this.num = num;
  this.id = id;
  this.latlng = latlng;
  this.image = image;
  this.starttime = starttime;
  this.title = title;
  this.venuename = venuename;
  this.venueaddress = venueaddress;
  this.url = url;
  this.venueurl = venueurl;
  this.description = description;
  this.cityname = cityname;
  this.rating = rating;
}

function initMap(){
  //Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 30.2229111, lng: -97.7594106},
    zoom: 12
  });
 }
 defaultEvents();

function defaultEvents(){
  query = "music";
  search = $("#navSearchBox").val().trim();
  ratingIn = "ALL";
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
}


//when clicking on this prototype button, we can set the date.
$('#submit').on("click", function(){
  $("#addEvent").html("<img src = 'assets/images/gps.svg'\"></img>");
  query = $("#queryUse :selected").attr("value");
  search = $("#navSearchBox").val().trim();
  ratingIn = $("#ratingSelect :selected").attr("value");
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

  eventResultList = [];

  var Events = {
    app_key: "SGJgVSbsbgT3pbP3",
    q: search,
    c: query,                             // Category
    location: ("30.307182, -97.755996"),  // Location
    within: 15,
    sort_order: "popularity",             // Sort the events in order of popularity
    "date": splitStart + "-" + splitEnd,  // Start and End Date
    page_size: 10                         // Number of Items to Pull Up
  };

  // This function does the searching
  EVDB.API.call("/events/search", Events, function(findEvents) {
    console.log(findEvents);
     var eventImage;
     
       //Display the items on the page for testing purposes
       if(findEvents.events != null){
       for (j=0;j<findEvents.events.event.length;j++){

        //console.log(j);

        var myLatlng = new google.maps.LatLng(findEvents.events.event[j].latitude,findEvents.events.event[j].longitude);

        if(findEvents.events.event[j].image != null){
          eventImage = findEvents.events.event[j].image.medium.url;
        }else{
          eventImage = "assets/images/imgDefault.png";
        }





        var obj = new event(
          j,
          findEvents.events.event[j].id,
          myLatlng,
          eventImage,
          findEvents.events.event[j].start_time,
          findEvents.events.event[j].title,
          findEvents.events.event[j].venue_name,
          findEvents.events.event[j].venue_address,
          findEvents.events.event[j].url,
          findEvents.events.event[j].venue_url,
          findEvents.events.event[j].description,
          findEvents.events.event[j].city_name,
          "A");

        
        
        eventResultList.push(obj);
        checkForCrime(eval("eventResultList["+ j +"].latlng"),j);



        //console.log("test " + j);
       // $("#placeholder").append("<br>");
       // //title of events
       // $("#placeholder").append(findEvents.events.event[j].title);
       // $("#placeholder").append("<br>");
       // //start time of events
       // $("#placeholder").append(findEvents.events.event[j].start_time);
       // $("#placeholder").append("<br>");
       // //location of events
       // $("#placeholder").append(findEvents.events.event[j].city_name);
 
      
      
      
    //   var marker = new google.maps.Marker
    //   ({
    //   position: myLatlng,
    //   title: "hey"
    //   });
    // marker.setMap(map);
    
    
    } 
   
  }else{
    var newDiv = $("<div>");
    newDiv.addClass("eventItem");
    newDiv.html("<h2>No Event Found<h2>");
    $("#addEvent").html(newDiv);
  }
    for(i=0; i<eventResultList.length;i++){
      //console.log(ratingIn);
      if (ratingIn === "A"){
        if(eventResultList[i].rating != ratingIn){
          //console.log();
          eventResultList.splice(i,1);
          i--;
        }
      }else if(ratingIn === "B"){
        if(eventResultList[i].rating != ratingIn){
          eventResultList.splice(i,1);
          i--;
        }
      }else if(ratingIn === "C"){
        if(eventResultList[i].rating != ratingIn){
          eventResultList.splice(i,1);
          i--;
        }
      }
    }
    if(findEvents.events != null){
    populateResuts();
  }
    console.log(eventResultList);




    
  });

  function populateResuts(){

    $("#addEvent").empty();

    for(i=0;i<eventResultList.length;i++){

    var newDiv = $("<div>");
    newDiv.addClass("eventItem");
    newDiv.attr("data-id",eventResultList[i].id);
    newDiv.attr("id", i);
   
    newDiv.append("<img src="+eventResultList[i].image+" alt=\"placehold for rating\" class=\"ratedImg\">");
    newDiv.append("<h3 class=\"eventHeader\">"+eventResultList[i].title+"</h3>");
    newDiv.append("<p class=\"eventDescr\">"+eventResultList[i].rating+"</p>");
     
    $("#addEvent").append(newDiv);

    }

   

 $(".eventItem").on("click",function(){
    console.log(eval("eventResultList["+ this.id +"].title"));
    deleteMarkers();
    map.setCenter(eval("eventResultList["+ this.id +"].latlng"));
    console.log("hey");
    console.log(eval("eventResultList["+ this.id +"]"));
    //eventResultList[i].latlng;

    var marker = new google.maps.Marker({
      position: eval("eventResultList["+ this.id +"].latlng"),
      title: eval("eventResultList["+ this.id +"].title"),
      icon: testicon,
      map: map
    });
    markers.push(marker);
    placeMarker(eval("eventResultList["+ this.id +"].latlng"),eval("eventResultList["+ this.id +"].rating"));
    
  })


  }
   function placeMarker(location, rating) {
      var color;
      console.log(rating);
      if (rating === "B"){
        color = '#fbd05d';
      }else if (rating === "C"){
        color = '#f15c32';
      }else{
        color = '#89ae4f';
      }
      circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.3,
        strokeWeight: 0,
        fillColor: color,
        fillOpacity: 0.4,
        map: map,
        center: location,
        radius: 1300

      });
  }







  //console.log(eventResultList);
}
function deleteMarkers() {
        try{
          circle.setMap(null);
        }catch(err){
          console.log(err);
        }
        for(i=0;i<markers.length;i++){
          markers[i].setMap(null);
        }

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
  // function placeMarker(location, color) {
    
  //     circle = new google.maps.Circle({
  //       strokeColor: color,
  //       strokeOpacity: 0.3,
  //       strokeWeight: 0,
  //       fillColor: color,
  //       fillOpacity: 0.4,
  //       map: map,
  //       center: location,
  //       radius: 1300

  //     });
  // }

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
    function checkForCrime(position,eventIndex){
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
            var crimeLatlng = new google.maps.LatLng(crimeData[i].latitude,crimeData[i].longitude);
            //get crime in area
            // var marker = new google.maps.Marker({
            //   position: crimeLatlng,
            //   title: crimeData[i].crime_type,
            //   map: map
            //   });
            // markers.push(marker);
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
      //console.log("this much crime: " + countCrime);

      //default cirle color
      color = '#89ae4f';

      //yellow
      if (countCrime >= 15 && countCrime < 30){
        
        eventResultList[eventIndex].rating = "B";

        //red
      }else if(countCrime >= 30){
        
        eventResultList[eventIndex].rating = "C";
      }
      
      //call cirlce function
     

    } 




})
