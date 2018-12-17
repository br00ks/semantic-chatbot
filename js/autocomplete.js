function activate_autocomplete() {
  $(function() {
    $(".inputField").autocomplete({
      minLength: 3,
      source: function(request, response) {
        console.log("term: " + request.term);
        var query_url =
          "http://lookup.dbpedia.org/api/search/PrefixSearch?QueryClass=&MaxHits=5&QueryString=" +
          request.term;
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
