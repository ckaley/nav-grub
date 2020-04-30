var entity_id = "305";
var entity_type = "city";
var apiKey = "75b4586940c208d07b537c70b9182501";

var queryURL =
  "https://developers.zomato.com/api/v2.1/search?apikey=" +
  apiKey +
  "&entity_type=" +
  entity_type +
  "&entity_id=" +
  entity_id;

console.log(queryURL);

$.ajax({
  url: queryURL,
  method: "GET",
}).then(function (response) {
  console.log(response);
});
