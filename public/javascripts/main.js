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
					urlInput.val("127.0.0.1:8080/" + parsed["res"]);
					urlInput.select();
				}); 
			});
	});
})(jQuery);
