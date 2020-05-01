//Slide Out NavBar for Favorites List
$(document).ready(function(){
    $('.sidenav').sidenav();
  });


//------------------------------------------------------------------------------------------------------------------------------
//DYNAMICALLY GENERATED CONTENT

/*Restaurant Info Card: add this into the for-loop that within the ajax call that grabs data from the 10 restaurants in the API's response
----------------------*/
var info = $("#info");
var infoCol = $("<div>").attr("class", "col s12 center-align");
var infoCard = $("<div>").attr("class", "card horizontal");
var infoCardImage = $("<div>").attr("class", "card-image")
var featuredImage = $("<img>").attr("src", response.restaurants[i].featured_image);
var infoCardContent = $("<div>").attr("class", "card-content");
var infoCardTitle = $("<span>").attr("class", "card-title")




//------------------------------------------------------------------------------------------------------------------------------

