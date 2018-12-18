function activate_autocomplete() {
  $(function() {
    $(".inputField").autocomplete({
      minLength: 3,
      source: function(request, response) {
        console.log("term: " + request.term);
        var inputQuery = request.term.split(" ");
        console.log(request.term);
        console.log(inputQuery.pop());
        var lastString = inputQuery.pop() || request.term;
        console.log(lastString);
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
            console.log("Sample of data:", data);
            response(data.results);
          }
        });
      }
    });
  });
}
activate_autocomplete();
