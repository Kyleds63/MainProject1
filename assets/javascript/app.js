$(document).ready(function(){
  //global variables
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
  //green map icon need to replace!!!
  var testicon = {
    url: "assets/images/iconGreen.png",
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 35)
  };
  //init map call
  initMap();

  //loading icon
  $("#addEvent").html("<img src = 'assets/images/gps.svg'\"></img>");

  //event constructor
  function event(num,id,latlng,image,starttime,title,venuename,venueaddress,url,venueurl,description,cityname,rating,topCrime){
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
    this.topCrime = topCrime;
  }

  //init map function
  function initMap(){
    //Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'),{
      center: {lat: 30.2229111, lng: -97.7594106},
      zoom: 12
    });
   }

   //creates default events onload
  defaultEvents();
  function defaultEvents(){
    query = "music"; //type
    search = $("#navSearchBox").val().trim(); //search input
    ratingIn = "C";
    var startDate = $('#startDate').val(); //set dates from values in the calader input
    var endDate = $('#endDate').val(); //set dates from values in the calader input

    //eventful processes dates as YYYYMMDD00. Adding 00 to the end of the numbers.
    var finalStart = startDate + "00";
    var finalEnd = endDate + "00";

    //removing hyphens in the numbers generated from the calander so eventful can read them.
    splitStart = finalStart.split('-').join('');
    splitEnd = finalEnd.split('-').join('');

    //call to create event objects
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
      page_size: 50                         // Number of Items to Pull Up
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
            "A",
            "filler");
 
          eventResultList.push(obj);
          checkForCrime(eval("eventResultList["+ j +"].latlng"),j);
      
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
          if(eventResultList[i].rating === "C"){
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
      newDiv.append("<p class=\"eventDescr\">"+eventResultList[i].topCrime+"</p>");
       
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
      

      //check for specific crimes
      var check = false;

      //function for counting crime in a specific area
      function checkForCrime(position,eventIndex){
        //console.log(position);
        //console.log(position.lat());

        
        //number of crime instances in an area
        var rank = 0;
        var countCrime = 0;
        var totalRank = 0;
        
        var crimeTypes = {
          theft: 0,
          assault: 0,
          harassment: 0,
          tresspass: 0,
          autotheft: 0,
          poss: 0,
          rape: 0
        }

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

        //loop to test crime data

        for(i=0;i< crimeData.length;i++){

          //check is default false
          check = false;
          
          //check data for crime types
          switch(crimeData[i].crime_type){
          case "THEFT":
            rank = 3;
            type = "theft";
            theft++;
            check = true;
            break;
          case "BURGLARY OF VEHICLE":
            rank = 4;
            type = "theft";
            bov++;
            check = true;
            break;
          case "INJURY TO ELDERLY PERSON":
            rank = 2;
            type = "assault";
            agg++;
            check = true;
            break;
          case "HARASSMENT":
            rank = 3;
            type = "harassment";
            harassment++;
            check = true;
            break;
          case "CRIMINAL TRESPASS NOTICE":
            rank = 2;
            type = "tresspass";
            ctn++;
            check = true;
            break;
          case "AUTO THEFT":
            rank = 4;
            type = "autotheft";
            autotheft++;
            check = true;
            break; 
          case "AGG ASSAULT":
            rank = 5;
            type = "assault";
            agg++;
            check = true;
            break;
          case "ASSAULT  CONTACT-SEXUAL NATURE":
            rank = 5;
            type = "assault";
            agg++;
            check = true;
            break;
          case "POSS OF DRUG PARAPHERNALIA":
            rank = 2;
            type = "poss";
            poss++;
            check = true;
            break;
          case "PUBLIC INTOXICATION":
            rank = 1;
            poss++;
            check = true;
            break;
          case "AGG ASLT STRANGLE/SUFFOCATE":
            rank = 5;
            type = "poss";
            agg++;
            check = true;
            break;
          case "THEFT OF BICYCLE":
            rank = 2;
            type = "theft";
            theft++;
            check = true;
            break; 
          case "POSS MARIJUANA":
            rank = 1;
            type = "poss";
            poss++;
            check = true;
            break; 
          case "DEBIT CARD ABUSE":
            rank = 3;
            type = "theft";
            theft++;
            check = true;
            break;
          case "OUT OF CITY AUTO THEFT":
            rank = 4;
            type = "auto-theft";
            theft++;
            check = true;
            break;
          case "POSS SYNTHETIC MARIJUANA":
            rank = 1;
            type = "poss";
            poss++;
            check = true;
            break;
          case "ASSAULT BY CONTACT":
            rank = 4;
            type = "assault";
            agg++;
            check = true;
            break;
          case "ASSAULT W/INJURY-FAM/DATE VIOL":
            rank = 4;
            type = "assault";
            agg++;
            check = true;
            break;
          case "ASSAULT WITH INJURY":
            rank = 4;
            type = "assault";
            agg++;
            check = true;
            break;
          case "FRAUD - OTHER":
            rank = 2;
            type = "theft";
            theft++;
            check = true;
            break;
          case "CRIMINAL MISCHIEF":
            rank = 2;
            type = "tresspass";
            harassment++;
            check = true;
            break;
          case "DAMAGE CITY PROP":
            rank = 2;
            type = "tresspass";
            harassment++;
            check = true;
            break;
          case "POSS CONTROLLED SUB/NARCOTIC":
            rank = 3;
            type = "poss";
            poss++;
            check = true;
            break;
          case "TERRORISTIC THREAT":
            rank = 5;
            type = "assault";
            agg++;
            check = true;
            break; 
          case "RAPE":
            rank = 5;
            type = "rape";
            rape++;
            check = true;
            break; 
          case "THEFT FROM PERSON":
            rank = 5;
            type = "theft";
            theft++;
            check = true;
            break; 
          case "ASSAULT BY THREAT":
            rank = 2;
            type = "assault";
            agg++;
            check = true;
            break; 
          case "ROBBERY BY ASSAULT":
            rank = 5;
            type = "assault";
            agg++;
            check = true;
            break; 
          case "POSS DANG DRUG":
            rank = 3;
            type = "poss";
            poss++;
            check = true;
            break; 
          case "IDENTITY THEFT":
            rank = 4;
            type = "theft";
            theft++;
            check = true;
            break;
          case "DEADLY CONDUCT":
            rank = 5;
            type = "assault";
            agg++;
            check = true;
            break;
          case "FORCED SODOMY":
            rank = 5;
            type = "rape";
            rape++;
            check = true;
            break;                                 
                                          
          }

         //if check passed 
         if(check === true){
           
            //checks if point is inside square
            if ((crimeData[i].latitude <= latD) && (crimeData[i].latitude >= latC) 
              && (crimeData[i].longitude <= lngA) && (crimeData[i].longitude >= lngC)){
              totalRank = totalRank + rank;
              countCrime++;

               // var crimeTypes{
               //    theft: 0;
               //    assault: 0;
               //    harassment: 0;
               //    tresspass: 0;
               //    autotheft: 0;
               //    poss: 0;
               //  }

               if(type === "theft"){
                crimeTypes.theft++;
               }else if(type === "assault"){
                crimeTypes.assault++;
               }else if(type === "harassment"){
                crimeTypes.harassment++;
               }else if(type === "tresspass"){
                crimeTypes.tresspass++;
               }else if(type === "autotheft"){
                crimeTypes.autotheft++;
               }else if(type === "poss"){
                crimeTypes.poss++;
               }else if(type === "rape"){
                crimeTypes.rape++;
               }



              var crimeLatlng = new google.maps.LatLng(crimeData[i].latitude,crimeData[i].longitude);
              
            }

          }
          
        }
        var mostCrime = "No Data Available";
        var number = 0;
        
          //console.log(Object.keys(crimeTypes)[i]);
          if(crimeTypes.theft > number){
            number = crimeTypes.theft;
            mostCrime = "Theft";
          }
          if(crimeTypes.assault > number){
            number = crimeTypes.assault;
            mostCrime = "Assault";
          }
          if(crimeTypes.harassment > number){
            number = crimeTypes.harassment;
            mostCrime = "Harassment";
          }
          if(crimeTypes.tresspass > number){
            number = crimeTypes.tresspass;
            mostCrime = "Tresspassing";
          }
          if(crimeTypes.autotheft > number){
            number = crimeTypes.autotheft;
            mostCrime = "Auto-Theft";
          }
          if(crimeTypes.poss > number){
            number = crimeTypes.poss;
            mostCrime = "Possesion of Drugs";
          }
          if(crimeTypes.rape > number){
            number = crimeTypes.rape;
            mostCrime = "Rape";
          }
          eventResultList[eventIndex].topCrime = mostCrime;
        



        

        // var theft = 0;
        // var rape = 0;
        // var bov = 0;
        // var poss = 0;
        // var harassment = 0;
        // var ctn = 0;
        // var fraud = 0;
        // var autotheft = 0;
        // var agg = 0;

        //B
        if (totalRank >= 400 && totalRank < 700){
          
          eventResultList[eventIndex].rating = "B";

          //C
        }else if(totalRank >= 700){
          
          eventResultList[eventIndex].rating = "C";
        }             
      } 
})