

// click function to make the toast alert box appear
$("#ratingButton").click(function(){
	//Materialize.toast(message, displayLength, className, completeCallback);
  	Materialize.toast('Ratings are calculated by the severity and number of crimes committed in one square mile of the event location. Regions outside of Austin and/or regions with out current crime data are labeled as &ldquo;NR&rdquo; for not rated.'); // 4000 is the duration of the toast
  	$("#ratingButton").prop("disabled",true);
});

// on click function to make the toast disappear when the user clicks the toast. Users can swipe toast in mobile view
$(document).on("click", "#toast-container .toast", function() {
    $(this).fadeOut(function(){
        $(this).remove();
    });
    $("#ratingButton").prop("disabled",false);
});

// resize the map based on screen size, fixes potential mobile viewer bugs
$("document").resize(function(){
	google.maps.event.trigger(map, "resize");
});