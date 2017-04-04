var query;
var splitStart;
var splitEnd;

// need an ID in the index for query to grab from
 
     
//when clicking on this prototype button, we can set the date.
$('#submit').on("click", function(){
   var e = $("#queryUse");
  console.log(e);
  //set dates from values in the calader input
var startDate = $('#startDate').val();
var endDate = $('#endDate').val();
//eventful processes dates as YYYYMMDD00. Adding 00 to the end of the numbers.
var finalStart = startDate + "00";
var finalEnd = endDate + "00";
//removing hyphens in the numbers generated from the calander so eventful can read them.
splitStart = finalStart.split('-').join('');
splitEnd = finalEnd.split('-').join('');
});

//-----------------------------------------------------------------------------------//
// To Do: 1. link query to HTML, default to music. 
function createEvents(){

   var Events = {

      app_key: "SGJgVSbsbgT3pbP3",
//category
      c: query,
//location
      where: "Austin",
//sort the events in order of popularity
      sort_order: "popularity", 
//start and end date
    "date": splitStart + "-" + splitEnd,
// number of items to pull up
      page_size: 25

   };
//This is the function that does the searching
   EVDB.API.call("/events/search", Events, function(findEvents) {
    $("#test").empty();
   console.log(findEvents); 
//display the items on the page for testing purposes
    for (i=0;i<findEvents.events.event.length;i++){
       $("#test").append("<br>");
       //title of events
       $("#test").append(findEvents.events.event[i].title);
       $("#test").append("<br>");
       //start time of events
       $("#test").append(findEvents.events.event[i].start_time);
       $("#test").append("<br>");
       //location of events
       $("#test").append(findEvents.events.event[i].city_name);
    }
  });

};


