lib.gmap = {

	init: function(el, data, callback) {
			var latLng = new google.maps.LatLng( data.lat, data.lng );
			this.init.map = new google.maps.Map(document.querySelector(el), {
			zoom: data.zoom,
			center: latLng
			});
			callback();
		},
	marker: function(marker, data, hiddenData, callback){

		var map = this.init.map;

		if(marker){	

			if(data.Alt>99000) data.Alt = 99000;
			var Alt = '0000000'+data.Alt;
				Alt = Alt.slice(-6);

			var icon = marker.getIcon();
			var newPosition = new google.maps.LatLng(data.Lat, data.Long);
			icon.rotation = Number(google.maps.geometry.spherical.computeHeading(marker.getPosition(), newPosition));
			icon.scale = Number('0.'+ Alt)*1.3;
		    marker.setIcon(icon);
		    marker.setVisible(true);
			marker.setPosition({lat:data.Lat, lng:data.Long});	

		} else {

			var newPosition = new google.maps.LatLng(data.Lat, data.Long);
			var oldPosition = new google.maps.LatLng(hiddenData.Lat, hiddenData.Long);
			var Alt = '0000000'+data.Alt;
				Alt = Alt.slice(-6);
			var icon = {
			    path: 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684',
			    scale: Number('0.'+Alt)*1.3,
			    strokeOpacity: 1,
			    color: 'black',
			    fillColor: 'black',
	    		fillOpacity: 1,
	    		rotation: Number(google.maps.geometry.spherical.computeHeading(oldPosition, newPosition)),
			    strokeWeight: 1
			};

			var latLng = new google.maps.LatLng( data.Lat, data.Long );
	        var marker = new google.maps.Marker({
	         // label:'Alt: '+ ico.Alt,
	          map: map,
	          position: latLng,
	          icon: icon
	        });

	    }
	    callback(marker);
	}
}