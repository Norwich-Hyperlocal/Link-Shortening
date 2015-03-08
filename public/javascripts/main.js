(function($) {
	$.noConflict();
	$(document).ready(function() {
		//Variables
			//Url input box
			var urlInput = $("#urlInput");
			//Complete the shorten
			var urlGo = $("#urlGo");
		//Events
			urlGo.on("click", function(e) {
			//When the go button is pressed make our post request
				$.post("api/store", {url: urlInput.val()}, function(res) {
					var parsed = JSON.parse(res);
					var id = parsed["res"];
					console.log(parsed);
					if(id == null) {
						urlInput.val("Error: " + parsed["info"]);
						urlInput.select();
					} else {
						urlInput.val("127.0.0.1:8080/" + id);
						urlInput.select();
					}
				}); 
			});
	});
})(jQuery);
