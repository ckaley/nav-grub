$(document).ready(function () {
  //Define Global Variables
  var entity_id = ""; //Used in the Zomato Search, represents the city
  var entity_type = "city"; //Used in teh API call for Zomato Search
  var apiKey = "75b4586940c208d07b537c70b9182501"; //API Key for Zomato
  var cityLatitude = 0; //Stores the latitude of the user's browser
  var cityLongitude = 0; // Stores the longitude of the user's broswer
  var cityName = ""; //String Name of teh City
  var maxResults = 10; //This represents the maximum number of restaurants that the api will return

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
    //var search = $("#SearchInput").val();
    var search = "Italian";

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
      console.log(response);
    });
  }

  //Get User location once the document is ready
  getUserLocation();

  //Used to test the search
  $("#searchRestaurants").on("click", function () {
    searchRestaurants();
  });
});
