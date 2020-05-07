var map;
var mapCenter = [];

function loadMapScenario() {
  map = new Microsoft.Maps.Map(document.getElementById("myMap"), {});
}

function GetMap() {
  //console.log("GetMap");
  map = new Microsoft.Maps.Map("#myMap", {
    credentials:
      "ArULTIYfxQSEZ0tXfKIG0yg3EawTuXGpK82x19OPe74Gbi3l02v1M1WgGZnqmyHL",
    center: new Microsoft.Maps.Location(mapCenter[0], mapCenter[1]),
    zoom: 13.5,
  });
  //39.73, -104.99
}
$(document).ready(function () {
  //Slide Out NavBar for Favorites List - uses JS from materialize library
  $(".sidenav").sidenav();

  //event listener for Go To Map button
  $("#mapButton").click(function () {
    var elmnt = document.getElementById("myMap");
    elmnt.scrollIntoView();
  });

  //Define Global Variables
  var entity_id = ""; //Used in the Zomato Search, represents the city
  var entity_type = "city"; //Used in teh API call for Zomato Search
  var apiKey = "75b4586940c208d07b537c70b9182501"; //API Key for Zomato
  var cityLatitude = 0; //Stores the latitude of the user's browser
  var cityLongitude = 0; // Stores the longitude of the user's broswer
  var cityName = ""; //String Name of the City
  var maxResults = 10; //This represents the maximum number of restaurants that the api will return
  var restArray = [];
  var favoritesArray = [];

  //Asynchronous function to get the User's browser location.  Utilize
  //getCityName() as the callback function once a value is received back
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCityName);
    } else {
      //console.log("Geolocation is not supported by this browser.");
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
      //Using JQuery, set the display of the field on the browser with the cityname
      $("#city").text(cityName);
    });
  }

  function searchRestaurants(search) {
    //empty the page and clear the array (clear prior results)
    $("#info").empty();
    $("#query").val("");
    restArray = [];

    //Using JQuery, set the text search paramter from the ID Field on the screen
    //var search = $("#query").val();
    //search = "Magianno's+Little+Italy";
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
      mapCenter = [];
      for (var i = 0; i < response.restaurants.length; i++) {
        var restaurantObject = {};
        restaurantObject.name = response.restaurants[i].restaurant.name;
        restaurantObject.address =
          response.restaurants[i].restaurant.location.address;
        restaurantObject.hours = response.restaurants[i].restaurant.timings;
        restaurantObject.hood =
          response.restaurants[i].restaurant.location.locality_verbose;
        restaurantObject.cuisine = response.restaurants[i].restaurant.cuisines;
        restaurantObject.latitude =
          response.restaurants[i].restaurant.location.latitude;
        restaurantObject.longitude =
          response.restaurants[i].restaurant.location.longitude;
        restaurantObject.image =
          response.restaurants[i].restaurant.featured_image;
        restaurantObject.id = response.restaurants[i].restaurant.id;
        restaurantObject.entityID =
          response.restaurants[i].restaurant.location.city_id;
        (restaurantObject.entityType = "city"),
          (restaurantObject.menuURL =
            response.restaurants[i].restaurant.menu_url),
          (restaurantObject.phone =
            response.restaurants[i].restaurant.phone_numbers);
        restArray.push(restaurantObject);
      }
      mapCenter.push(restArray[0].latitude, restArray[0].longitude);

      loadMapScenario();
      GetMap();
      pinToMap(restArray);
      populateCard();
    });
  }

  function searchFavorite(resID) {
    //empty the page and clear the array (clear prior results)
    $("#info").empty();
    $("#query").val("");
    restArray = [];
    mapCenter = [];
    //Construct Query URL with criteria to obtain the list of resatuants in the
    //city the user is located
    var queryURL =
      "https://developers.zomato.com/api/v2.1/restaurant?apikey=" +
      apiKey +
      "&res_id=" +
      resID;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var restaurantObject = {};
      restaurantObject.name = response.name;
      restaurantObject.address = response.location.address;
      restaurantObject.hours = response.timings;
      restaurantObject.hood = response.location.locality_verbose;
      restaurantObject.cuisine = response.cuisines;
      restaurantObject.latitude = response.location.latitude;
      restaurantObject.longitude = response.location.longitude;
      restaurantObject.image = response.featured_image;
      restaurantObject.id = response.id;
      restaurantObject.entityID = response.location.city_id;
      restArray.push(restaurantObject);
      mapCenter.push(restArray[0].latitude, restArray[0].longitude);
      //console.log(restArray);
      loadMapScenario();
      GetMap();
      pinToMap(restArray);
      populateCard();
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
  }
  //Get User location once the document is ready
  getUserLocation();

  //Used to invoke search of restaurants
  $("#submit").on("click", function () {
    searchRestaurants($("#query").val());
    $("#mapCard")
      .css("visibility", "visible")
      .removeClass("scale-out")
      .addClass("scale-in");
    $("#mapButton")
      .css("visibility", "visible")
      .removeClass("scale-out")
      .addClass("scale-in");
  });
  $(document).on("keypress", "input", function(e){
    if (e.which == 13){

      searchRestaurants($("#query").val());
    $("#mapCard")
      .css("visibility", "visible")
      .removeClass("scale-out")
      .addClass("scale-in");
    $("#mapButton")
      .css("visibility", "visible")
      .removeClass("scale-out")
      .addClass("scale-in");
    }
  });

  // function that creates info cards for each restaurant returned from the api
  function populateCard() {
    //element variables
    for (var i = 0; i < restArray.length; i++) {
      var info = $("#info");
      var infoCol = $("<div>").attr("class", "col s12 center-align");
      var infoCard = $("<div>").attr({
        class: "card horizontal hoverable",
      });
      var infoCardRow = $("<div>").attr("class", "row");
      var infoCardColL = $("<div>").attr("class", "col s4");
      var infoCardColR = $("<div>").attr("class", "col s8");
      var infoCardImage = $("<div>").attr("class", "card-image");
      var featuredImage = $("<img>").attr("src", restArray[i].image);
      var infoCardContent = $("<div>").attr("class", "card-content");
      var infoCardTitle = $("<h5>")
        .attr("class", "card-title")
        .text(restArray[i].name);
      var infoCardDetails = $("<div>");
      var infoCardCuisines = $("<p>").text(
        "Cuisine Offerings: " + restArray[i].cuisine
      );
      var infoCardHours = $("<p>").text("Hours: " + restArray[i].hours);
      var infoCardAddress = $("<p>").text("Address: " + restArray[i].address);
      var infoCardHood = $("<p>").text(restArray[i].hood);
      var infoCardMenu = $("<a>").attr({
        class: "waves-effect waves-light btn",
        id: "menuBtn",
        href: restArray[i].menuURL,
      });
      var infoCardMenuText = $("<span>")
        .attr("class", "hide-on-small-only")
        .text("FIND MENU");
      var infoCardMenuIcon = $("<i>")
        .attr("class", "material-icons right")
        .text("restaurant_menu");
      var infoCardCall = $("<a>").attr({
        class: "waves-effect waves-light btn",
        id: "callBtn",
        href: "tel:" + restArray[i].phone,
      });
      var infoCardCallText = $("<span>")
        .attr("class", "hide-on-small-only")
        .text("CALL");
      var infoCardCallIcon = $("<i>")
        .attr("class", "material-icons right")
        .text("phone");
      var infoCardFav = $("<a>")
        .attr("id", "favBtn" + [i])
        .addClass(
          "btn-floating halfway-fab waves-effect waves-light pink lighten-2"
        )
        .val(restArray[i]);
      var infoCardFavIcon = $("<i>")
        .attr("class", "material-icons")
        .text("favorite_border");
      var infoCardBtnRow = $("<div>").attr("class", "row");
      var infoCardMenuBtnCol = $("<div>").attr("class", "col s6 center-align");
      var infoCardCallBtnCol = $("<div>").attr("class", "col s6 center-align");

      //append elements to the page
      info.append(infoCol);
      infoCol.append(infoCard);
      infoCard.append(infoCardRow, infoCardImage);
      infoCardRow.append(infoCardColL, infoCardColR);
      infoCardColL.append(infoCardImage, infoCardContent);
      infoCardImage.append(featuredImage);
      infoCardContent.append(infoCardTitle);
      infoCardColR.append(infoCardDetails, infoCardFav);
      infoCardDetails.append(
        infoCardCuisines,
        infoCardHours,
        infoCardHood,
        infoCardAddress,
        infoCardBtnRow
      );
      infoCardBtnRow.append(infoCardMenuBtnCol, infoCardCallBtnCol);
      infoCardMenuBtnCol.append(infoCardMenu);
      infoCardMenu.append(infoCardMenuIcon, infoCardMenuText);
      infoCardCallBtnCol.append(infoCardCall);
      infoCardCall.append(infoCardCallIcon, infoCardCallText);
      infoCardFav.append(infoCardFavIcon);

      //add event listener for fav button on each restaurant card
      $("#favBtn" + [i]).on("click", function(event) {
        //add the restaurant to the favorites menu no matter what if the favorites menu is empty
        if (favoritesArray.length === 0){
          favoritesArray.push($(this).val())
          localStorage.setItem("favsStorage", JSON.stringify(favoritesArray));
          getFavHist();
          //but if there are already restaurants on the favorites slide out menu, don't add the same restaurant twice
        } else if (favoritesArray.length > 0) {
          var newArr = [];
          for (var i = 0; i < favoritesArray.length; i++){
            newArr.push(favoritesArray[i].name)
          }
          if (newArr.includes($(this).val().name)){
            console.log("You have already saved this restaurant")
          } else{
              favoritesArray.push($(this).val())
              localStorage.setItem("favsStorage", JSON.stringify(favoritesArray));
              getFavHist();
          }
        } console.log(newArr)
        
      })
    }
  };

  //function that grabs all favorited restaurants from local storage and adds them as buttons to the favorites slide out
  function getFavHist() {
    //grab items from local history
    var fromStor = localStorage.getItem("favsStorage");
    //parse items from local history
    fromStor = JSON.parse(fromStor);
    //dump favorites array
    favoritesArray = [];
    //loop through items from local storage adding each to favoritesArray (if the array from storage is not null)
    if (fromStor !== null) {
      for (var i = 0; i < fromStor.length; i++) {
        favoritesArray.push(fromStor[i]);
      }
    }
    //add each to the favorites slide out in the form of a button
    var favorites = $("#favorites");
    favorites.empty();
    for (var i = 0; i < favoritesArray.length; i++) {
      var favoritesLI = $("<li>");
      favoritesLI.attr("id", favoritesArray[i].id);
      var favoritesBtn = $("<a>")
        .attr("class", "waves-effect waves-light btn-small")
        .text(favoritesArray[i].name)
        .val(favoritesArray[i]);
      favorites.append(favoritesLI);
      favoritesLI.append(favoritesBtn);
    }
  }
  getFavHist();

  //event listener for favorites slide out
  $("#favorites").on("click", "li", function () {
    $("#mapCard")
      .css("visibility", "visible")
      .removeClass("scale-out")
      .addClass("scale-in");
    $("#mapButton")
      .css("visibility", "visible")
      .removeClass("scale-out")
      .addClass("scale-in");
    searchFavorite($(this).attr("id"));
  });
});
