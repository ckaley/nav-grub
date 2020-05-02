//Slide Out NavBar for Favorites List - uses JS from materialize library
$(document).ready(function(){
    $('.sidenav').sidenav();
  });


/*-----------------------------------------------------------------------------------------------------------------------------------------
RESTAURANT INFO CARD: add this into the for-loop within the ajax call that grabs data from the 10 restaurants in the API's response

This code should generate a card for each restaurant returned from the api.

I made variables for a few of the data records that we can get back from zomato API. we can change or add more or less, just getting a few examples in here.*/

//variables for values from response
var restaurantImage = response.restaurants[i].restaurant.featured_image;
var restaurantName = response.restaurants[i].restaurant.name;
var cuisines = response.restaurants[i].restaurant.cuisines;
var hours = response.restaurants[i].restaurant.timings;
var address = response.restaurants[i].restaurant.location.address;
var neighborhood = response.restaurants[i].restaurant.location.locality;


//element variables
var info = $("#info");
var infoCol = $("<div>").attr("class", "col s12 center-align");
var infoCard = $("<div>").attr("class", "card horizontal");
var infoCardRow = $("<div>").attr("class", "row");
var infoCardColL = $("<div>").attr("class", "col s4");
var infoCardColR = $("<div>").attr("class", "col s8");
var infoCardImage = $("<div>").attr("class", "card-image")
var featuredImage = $("<img>").attr("src", restaurantImage);
var infoCardContent = $("<div>").attr("class", "card-content");
var infoCardTitle = $("<span>").attr("class", "card-title").text(restaurantName);
var infoCardDetails = $("div");
var infoCardCuisines = $("<p>").text("Cuisine Offerings: "+cuisines);
var infoCardHours = $("<p>").text("Hours: "+hours);
var infoCardAddress = $("<p>").text("Address: "+address);
var infoCardHood = $("<p>").text("Neighborhood: "+neighborhood);
var infoCardMenu = $("<a>").attr("class", "waves-effect waves-light btn", "id", "menuBtn").text("VIEW FULL MENU");
var infoCardMenuIcon = $("<i>").attr("class", "material-icons right").text("restaurant_menu");
var infoCardCall = $("<a>").attr("class", "waves-effect waves-light btn", "id", "callBtn").text("CALL");
var infoCardCallIcon = $("<i>").attr("class", "material-icons right").text("phone");
var infoCardFav = $("<a>").attr("class", "btn-floating halfway-fab waves-effect waves-light pink lighten-2", "id", "favBtn");
var infoCardFavIcon = $("<i>").attr("class", "material-icons").text("favorite_border");


//append elements to the page
info.append(infoCol);
infoCol.append(infoCard);
infoCard.append(infoCardRow);
infoCardRow.append(infoCardColL, infoCardColR);
infoCardColL.append(infoCardImage, infoCardContent);
infoCardImage.append(featuredImage);
infoCardContent.append(infoCardTitle);
infoCardColR.append(infoCardDetails, infoCardMenu,infoCardCall, infoCardFav);
infoCardDetails.append(infoCardCuisines, infoCardHours, infoCardHood, infoCardAddress);
infoCardMenu.append(infoCardMenuIcon);
infoCardCall.append(infoCardCallIcon);
infoCardFav.append(infoCardFavIcon);


/*Considerations/To-Do
We are probably going to need some if statements, in case a data record is null (for example, if there is nothing listed in "cuisines").
Need to figure out how to add an event listener to the CALL button that makes a smart phone call the number stored- and where to store it
Event listeners for MENU and FAV buttons
------------------------------------------------------------------------------------------------------------------------------------------*/


/*-----------------------------------------------------------------------------------------------------------------------------------------
MAP CARD:

*/

//variables for values from response
//var map = #;


//elements variables
var map = $("#map");
var mapCard = $("<div>").attr("class", "card");
var mapCardTitle = $("<div>").attr("class","card-title").text("Nav Your Grub")   //example text
var mapCardMap = $("div").attr("class", "card-content") //not exactly sure how a map is treated (text, src, ???)

//append elements to the page
map.append(mapCard);
mapCard.append(mapCardTitle, mapCardMap);

/*

--------------------------------------------------------------------------------------------------------------------------------------------*/


/*-----------------------------------------------------------------------------------------------------------------------------------------
FAVORITES SLIDE OUT: A button is created when the button id=#favBtn is clicked. THe event listener attached to that button will call the function addToFavs

*/
//var addToFavs = function(){

  
  //elements variables
  var favorites = $("#favorites");
  var favoritesLI = $("<li>");
  var favoritesBtn = $("<a>").attr("class", "waves-effect waves-light btn-small").text(/*need to grab title from card on which fav button is located*/);
  var favoritesBtnIcon = $("<i>").attr("class", "material-icons right").text("favorite");
  

  //append elements to the favorites slide out
  favorites.append(favoritesLI);
  favoritesLI.append(favoritesBtn);
  favoritesBtn.append(favoritesBtnIcon);
   
  
//}
/*

--------------------------------------------------------------------------------------------------------------------------------------------*/