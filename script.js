var map;

function loadMapScenario() {
  console.log("loadMapScenario");
  map = new Microsoft.Maps.Map(document.getElementById("myMap"), {});
}

function GetMap() {
  console.log("GetMap");
  map = new Microsoft.Maps.Map("#myMap", {
    credentials: "ArULTIYfxQSEZ0tXfKIG0yg3EawTuXGpK82x19OPe74Gbi3l02v1M1WgGZnqmyHL",
    center: new Microsoft.Maps.Location(39.93, -104.99),
  });
  var center = map.getCenter();
  console.log(center);
}
$(document).ready(function () {
  //Slide Out NavBar for Favorites List - uses JS from materialize library
  $(".sidenav").sidenav();
  //Define Global Variables
  var entity_id = ""; //Used in the Zomato Search, represents the city
  var entity_type = "city"; //Used in teh API call for Zomato Search
  var apiKey = "75b4586940c208d07b537c70b9182501"; //API Key for Zomato
  var cityLatitude = 0; //Stores the latitude of the user's browser
  var cityLongitude = 0; // Stores the longitude of the user's broswer
  var cityName = ""; //String Name of teh City
  var maxResults = 10; //This represents the maximum number of restaurants that the api will return
  var restArray = [];
  //Asynchronous function to get the User's browser location.  Utilize
  //getCityName() as the callback function once a value is received back
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCityName);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  // This function is called once the browser returns the latitude and
  //longitude of the user's broswer
  function getCityName(position) {
    cityLatitude = position.coords.latitude;
    cityLongitude = position.coords.longitude;
    //Construct Query URL with criteria to obtain the city the User is located in
    var queryURL =
      "https://developers.zomato.com/api/v2.1/cities?apikey=" +
      apiKey +
      "&lat=" +
      cityLatitude +
      "&lon=" +
      cityLongitude;
    //Ajax call to Zomato API that will return an array of 1, which is then used
    //to set the Global variables entity_ID and cityName
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      entity_id = response.location_suggestions[0].id;
      cityName = response.location_suggestions[0].name;
      console.log(entity_id);
      console.log(cityName);
      //Using JQuery, set the display of the field on the browser with the cityname
      $("#city").text(cityName);
    });
  }

  function searchRestaurants() {
    //Using JQuery, set the text search paramter from the ID Field on the screen
    var search = $("#query").val();
    //var search = "Italian";
    //Construct Query URL with criteria to obtain the list of resatuants in the
    //city the user is located
    var queryURL =
      "https://developers.zomato.com/api/v2.1/search?apikey=" +
      apiKey +
      "&entity_type=" +
      entity_type +
      "&entity_id=" +
      entity_id +
      "&q=" +
      search +
      "&count=" +
      maxResults;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      for (var i = 0; i < response.restaurants.length; i++) {
        var restaurantObject = {
          name: "",
          cuisine: "",
          latitude: "",
          longitude: "",
          image: "",
        };
        restaurantObject.name = response.restaurants[i].restaurant.name;
        restaurantObject.cuisine = response.restaurants[i].restaurant.cuisines;
        restaurantObject.latitude =
          response.restaurants[i].restaurant.location.latitude;
        restaurantObject.longitude =
          response.restaurants[i].restaurant.location.longitude;
        restaurantObject.image =
          response.restaurants[i].restaurant.featured_image;
        restArray.push(restaurantObject);
      }
      console.log(response);
      console.log(restArray);
      loadMapScenario();
      GetMap();
      pinToMap(restArray);
    });
  }
  // function for adding pins to map
  function pinToMap(restArray) {
    // loop through restArray array and pin each restaurant
    for (var i = 0; i < restArray.length; i++) {
      //inside loop...
      pin = new Microsoft.Maps.Pushpin(restArray[i], {
        title: restArray[i].name,
        subTitle: "",
      });
      map.entities.push(pin);
    }
    console.log("Restaurant Plots:  ", restArray);
  }
  //Get User location once the document is ready
  getUserLocation();
  //Used to invoke search of restaurants
  $("#submit").on("click", function () {
    searchRestaurants();
  });
  //Used to invoke search of restaurants
  $("#test").on("click", function () {
    //console.log(restArray);
    populateCard();
    // pinToMap();
  });
  // /*-----------------------------------------------------------------------------------------------------------------------------------------
  // RESTAURANT INFO CARD: add this into the for-loop within the ajax call that grabs data from the 10 restaurants in the API's response
  // This code should generate a card for each restaurant returned from the api.
  // I made variables for a few of the data records that we can get back from zomato API. we can change or add more or less, just getting a few examples in here.*/
  function populateCard() {
    // //element variables
    for (var i = 0; i < restArray.length; i++) {
      var info = $("#info");
      var infoCol = $("<div>").attr("class", "col s12 center-align");
      var infoCard = $("<div>").attr("class", "card horizontal");
      var infoCardRow = $("<div>").attr("class", "row");
      var infoCardColL = $("<div>").attr("class", "col s4");
      var infoCardColR = $("<div>").attr("class", "col s8");
      var infoCardImage = $("<div>").attr("class", "card-image");
      var featuredImage = $("<img>").attr("src", restArray[i].image);
      var infoCardContent = $("<div>").attr("class", "card-content");
      var infoCardTitle = $("<span>")
        .attr("class", "card-title")
        .text(restArray[i].name);
      var infoCardDetails = $("div");
      var infoCardCuisines = $("<p>").text(
        "Cuisine Offerings: " + restArray[i].cuisine
      );
      //var infoCardHours = $("<p>").text("Hours: " + hours);
      //var infoCardAddress = $("<p>").text("Address: " + address);
      //var infoCardHood = $("<p>").text(neighborhood);
      var infoCardMenu = $("<a>")
        .attr("class", "waves-effect waves-light btn", "id", "menuBtn")
        .text("VIEW FULL MENU");
      var infoCardMenuIcon = $("<i>")
        .attr("class", "material-icons right")
        .text("restaurant_menu");
      var infoCardCall = $("<a>")
        .attr("class", "waves-effect waves-light btn", "id", "callBtn")
        .text("CALL");
      var infoCardCallIcon = $("<i>")
        .attr("class", "material-icons right")
        .text("phone");
      var infoCardFav = $("<a>").attr("id","favBtn"+[i]).addClass("btn-floating halfway-fab waves-effect waves-light pink lighten-2").val(restArray[i].name);
      var infoCardFavIcon = $("<i>").attr("class", "material-icons").text("favorite_border");


      //append elements to the page
      info.append(infoCol);
      infoCol.append(infoCard);
      infoCard.append(infoCardRow);
      infoCardRow.append(infoCardColL, infoCardColR);
      infoCardColL.append(infoCardImage, infoCardContent);
      infoCardImage.append(featuredImage);
      infoCardContent.append(infoCardTitle);
      infoCardColR.append(
      //infoCardDetails,
      infoCardMenu,
      infoCardCall,
      infoCardFav
      );
      // infoCardDetails.append(infoCardCuisines); //, infoCardHours, infoCardHood, infoCardAddress);
      // infoCardMenu.append(infoCardMenuIcon);
      // infoCardCall.append(infoCardCallIcon);
      infoCardFav.append(infoCardFavIcon);
    
      //add event listener for fav button
      $("#favBtn"+[i]).on("click", function(){
        console.log($(this).val())
        var favorites = $("#favorites");
        var favoritesLI = $("<li>");
        var favoritesBtn = $("<a>").attr("class", "waves-effect waves-light btn-small").text($(this).val());
        //append elements to the favorites slide out
        favorites.append(favoritesLI);
        favoritesLI.append(favoritesBtn);
      });
    }
 


  }
  // /*Considerations/To-Do
  // We are probably going to need some if statements, in case a data record is null (for example, if there is nothing listed in "cuisines").
  // Need to figure out how to add an event listener to the CALL button that makes a smart phone call the number stored- and where to store it
  // Event listeners for MENU and FAV buttons
  // ------------------------------------------------------------------------------------------------------------------------------------------*/
  // /*-----------------------------------------------------------------------------------------------------------------------------------------
  // MAP CARD:
  // */
  // //variables for values from response
  // //var map = #;
  // //elements variables
  // var map = $("#map");
  // var mapCard = $("<div>").attr("class", "card");
  // var mapCardTitle = $("<div>").attr("class","card-title").text("Nav Your Grub")   //example text
  // var mapCardMap = $("div").attr("class", "card-content") //not exactly sure how a map is treated (text, src, ???)
  // //append elements to the page
  // map.append(mapCard);
  // mapCard.append(mapCardTitle, mapCardMap);
  // /*
  // --------------------------------------------------------------------------------------------------------------------------------------------*/
  // /*-----------------------------------------------------------------------------------------------------------------------------------------
  // FAVORITES SLIDE OUT: A button is created when the button id=#favBtn is clicked. The event listener attached to that button will call the function addToFavs
  // */
    // var addToFavs = function(){
    // //elements variables
    // var favorites = $("#favorites");
    // var favoritesLI = $("<li>");
    // var favoritesBtn = $("<a>").attr("class", "waves-effect waves-light btn-small").text(/*need to grab title from card on which fav button is located*/);
    // var favoritesBtnIcon = $("<i>").attr("class", "material-icons right").text("favorite");
    // //append elements to the favorites slide out
    // favorites.append(favoritesLI);
    // favoritesLI.append(favoritesBtn);
    // favoritesBtn.append(favoritesBtnIcon);
  //}
  // /*
  //--------------------------------------------------------------------------------------------------------------------------------------------*/


});