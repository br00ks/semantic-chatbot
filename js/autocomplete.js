var currentUserQuery = {
  firstPart: "",
  property: "",
  secondPart: ""
};
var propertiesArray = [];
const RESOURCE_PREFIX = "http://dbpedia.org/resource/";

function activate_autocomplete() {
  $(function() {
    $(".inputField").autocomplete({
      minLength: 3,
      source: function(request, response) {
        if ((request.term.split(" ")).length < 2)
        {
          currentUserQuery["firstPart"] = "";
          currentUserQuery["property"] = "";
          var inputQuery = request.term.split(" ");
          console.log("inputQuery: " + inputQuery.pop());
          var lastString = inputQuery.pop() || request.term;
          console.log("lastString: " + lastString);
          var query_url =
            "http://lookup.dbpedia.org/api/search/PrefixSearch?QueryClass=&MaxHits=10&QueryString=" +
            lastString;
          console.log("query: " + query_url);
          $.ajax({
            method: "GET",
            url: query_url,
            dataType: "json"
          }).done(function(data) {
            if (console && console.log) {
              console.log("Sample of data:", data.results);
              response(data.results);
            }
          });
        }

        else if (currentUserQuery["firstPart"] !== "" 
        && currentUserQuery["property"] !== "") {
          response("");
        }

        else {
          var inputQuery = request.term.split(" ");
          let last = inputQuery.pop();
          var currentSource = [];
          //currentSource = propertiesArray;
          for (i in propertiesArray) {
            let propertyLen = propertiesArray[i].length - 1;
            var propertyLC = propertiesArray[i].toLowerCase();
            var lastLC = last.toLowerCase();
            if (propertyLC.substring(
              currentUserQuery["firstPart"].length - 1, propertyLen).includes(lastLC)) {
              currentSource.push(propertiesArray[i]);
            }
          }
          response(currentSource);
        }
      }
    });
  });
}


$('.inputField').keypress(function(event){
  if (event.key === ' ' || event.key === 'Spacebar') {
    let text  = $(this).val();
    if (currentUserQuery["firstPart"] === "") {
      text = text.replace(/ /g, '_');
      $(this).val(text);
      console.log("FirstPart done, property will be filled, input: " + text); 
      currentUserQuery["firstPart"] = text;
      exec();
    }
    else if (currentUserQuery["firstPart"] !== "" 
         && (currentUserQuery["property"] === "")) {
      console.log("FirstPart done, secondPart done, input: " + text); 
      currentUserQuery["property"] = text.split(" ")[1];
    }
    else {
      console.log("Both parts done, input: " + text); 
    }
    
  }
});

$('.inputField').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  let text  = $(this).val();
  if(keycode == '13'){
      alert("Sending string: \""+ text +"\" to team 5"); 
  }
});

function exec() {
  var endpoint = "http://dbpedia.org/sparql"
  let sparql = "SELECT DISTINCT ?label " +
  "WHERE { " +
   "<" + RESOURCE_PREFIX + "" + currentUserQuery["firstPart"] + "> ?p ?o. " +
   "?p <http://www.w3.org/2000/01/rdf-schema#label> ?label . " +
  "FILTER(LANG(?label) = \"\" || LANGMATCHES(LANG(?label), \"en\")) " +
  " }";
  
  var url = endpoint + "?query=" + encodeURIComponent(sparql)
  console.log(url)

  var mime = "application/sparql-results+json"
  d3.xhr(url, mime, function(request) {
    var json = JSON.parse(request.responseText);
    console.log(json);
    
    let properties = json.results.bindings;
    console.log("Prop: " + properties);
    propertiesArray = [];

    for (i in properties) {
      var prop = currentUserQuery["firstPart"] + " " + properties[i].label.value.replace(/ /g, '_');
      propertiesArray.push(prop);
      console.log()
    }

    propertiesArray.sort();

  })
}

activate_autocomplete();
