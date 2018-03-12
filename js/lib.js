var dbg = function(data) {
	console.log(JSON.stringify(data));
}

var lib={};

lib.ajax = {

	getJsonp:function(url, callback){
		$.ajax({
	        url: url,
	        dataType: "jsonp",
	        jsonpCallback: callback
	    });
	},

	get:function(url, callback){
		$.ajax({
		  url: url,
		  method: 'GET',
		  dataType: 'json',
		  success: function(data){
		  	callback(data)
		  },
		  error: function(err, exception){
		        var msg = '';
		        if (err.status === 0) {
		            msg = 'Not connect.\n Verify Network.';
		        } else if (err.status == 404) {
		            msg = 'Requested page not found. [404]';
		        } else if (err.status == 500) {
		            msg = 'Internal Server Error [500].';
		        } else if (exception === 'parsererror') {
		            msg = 'Requested JSON parse failed.';
		        } else if (exception === 'timeout') {
		            msg = 'Time out error.';
		        } else if (exception === 'abort') {
		            msg = 'Ajax request aborted.';
		        } else {
		            msg = 'Uncaught Error.\n' + err.responseText;
		        }
		        callback(msg);		  	
		  }
		});
	}
};

lib.getView = function(tmpl, data, el){ 

	$.get( "view/"+tmpl, function( template ) {
		var content = Handlebars.compile(template);
		$(el).html(content(data));
	}, 'html');

};

lib.sortArrayObjects = function(arr, property) {

	if(property[0]=='-'){

		property = property.replace('-', '');

		arr.sort(function(obj1, obj2){
			return obj2[property]-obj1[property];
		});

	} else {
		arr.sort(function(obj1, obj2){
			return obj1[property]-obj2[property];
		});
	}
}

lib.makeHashAsync = function(arr, callback){
	
	var dataHash = {}; 

	async.each( arr, function (id,acb) {

		var h = id.Id;
		dataHash[h] = id;
		acb();

	}, function(err) {

	    if( err ) {
	      callback('Error create hash');
	    } else {
	      callback(dataHash);
	    }
	});
}

lib.error = function(title, head, content){
		$(".modal-title").html("<p>"+title+"</p>");
		$(".modal-body").html("<h3>"+head+"</h3><p>"+content+"</p>");
		$("#error").modal("show");
		return false;
}

