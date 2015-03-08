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
					var ip = parsed["ip"];
					if(id == null) {
						urlInput.val("Error: " + parsed["info"]);
						urlInput.select();
					} else {
						urlInput.val(ip+"/" + id);
						urlInput.select();
					}
				}); 
			});
	});
})(jQuery);
