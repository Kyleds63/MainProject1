

// jumps user to next date section when using keys to type date. could be annoying??
$(".userDate").keyup(function () {
    if ($(this).val().length == 10) {
      var nextCal = $(this).next('.userDate');
      if (nextCal.length)
          $(this).next('.userDate').focus();
      else
          $(this).blur();
    }
});



// 
$("#ratingButton").click(function(){
	// $("#popupRatingBox").toggleClass("show");
	
	//Materialize.toast(message, displayLength, className, completeCallback);
  	Materialize.toast('Ratings are calculated by the severity and number of crimes committed in one square mile of the event location. Regions outside of Austin and/or with out current crime data are labeled as &ldquo;NR&rdquo; or &ldquo;not rated&rdquo;.', 4000); // 4000 is the duration of the toast
})

$("document").resize(function(){
	google.maps.event.trigger(map, "resize");
});