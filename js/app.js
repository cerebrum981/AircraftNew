var APP = {
	baseUrl: window.location.href,
	json:'https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?callback=?',
	jsonLogo:'https://autocomplete.clearbit.com/v1/companies/suggest?query=:',
	gmap:{
		settings:{ zoom:8 },
		marker:{}
	},
	acList:[],
	dataHash:{}
};

APP.getMap = function(coords){
	var coords = Object.assign(APP.gmap.settings, coords);
	
	lib.gmap.init('#google-map', coords, function(){	
		$('#page-map').fadeIn(1000);
		$('#google-map').fadeOut(1);
		$('#google-map').fadeIn(2000);
		$('#loading-div').fadeOut(2000);
		APP.setMarker();
	});


}

APP.setMarker = function(){
	var gmap = lib.gmap.init.map;

	lib.ajax.get(APP.json, function(json){
		APP.acList=[];
		async.each( json.acList, function (data,acb) {
			var h = data.Id; 

				data.orient = 'fa-rotate-180';

			if(APP.dataHash[h] && APP.dataHash[h].Long && data.Long){
				if(APP.dataHash[h].Long<data.Long || (APP.dataHash[h].Long>170 && data.Long>-180)){
					
					data.orient='';

				}
			}

			if( data.Lat && data.Long && gmap.getBounds().contains({ lat:data.Lat, lng:data.Long })) { 


				APP.acList.push(data);
				var hiddenData = APP.dataHash[h]||data;
				lib.gmap.marker(APP.gmap.marker[h], data, hiddenData, function(marker){
					APP.dataHash[h] = data;
					APP.gmap.marker[h] = marker;
				});

			} else {
			
				if(APP.gmap.marker[h])
				APP.gmap.marker[h].setVisible(false);
			
			}
			acb();
		}, function(err) {

		    if( err ) {
		      	alert('Error compare data');
		    } else {

				lib.sortArrayObjects(APP.acList, '-Alt'); 
				lib.getView('list.hbs', APP, '#plane-list');
				setTimeout(APP.setMarker, 12000 );
		    }
		});

	});
}

APP.startUp = function(){
//	APP.getMap({ lat:50, lng:20 });

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position){ alert(JSON.stringify(position.coords.latitude))

		var coords = {lat:position.coords.latitude, lng:position.coords.longitude };

		APP.startUp(coords);
	}, function(error){
		  if (error.code == error.PERMISSION_DENIED){
		     lib.error('Application Error', 'Geolocation Error', 'You must enable Geolocation to use this application.');
		  }
	},
	{
		  enableHighAccuracy: true,
		  timeout: 5000,
		  maximumAge: 0
	});
}
/*

		navigator.geolocation.watchPosition(function(position) {
			APP.startUp(position);
		},
		function (error) { 

		  if (error.code == error.PERMISSION_DENIED){
		     lib.error('Application Error', 'Geolocation Error', 'You must enable Geolocation to use this application.');
		  } else {
		  	 lib.error('Application Error', 'Geolocation Error', error.code);
		  }

		});
*/

}

lib.ajax.get(APP.json, function(data){

	lib.makeHashAsync(data.acList, function(hash){
		APP.dataHash = hash;
		APP.startUp();
	});

});

APP.ajaxHistory = function(){

	var newUrl = window.location.href;

	if(newUrl == APP.baseUrl && newUrl != APP.newUrl){ 
		$('#logo').attr('src','./img/loading.gif');
		$('#page-map').css({'display':'block'});
		$('.company-info').css({'display':'none'});

	}
}

setInterval(APP.ajaxHistory, 200);

$(function() {

	$(document).on('click','.flight-info>td', function(){
		
		var url = window.location.href;
		var id = $(this).parent().attr('id');
		var hashId =  id.split('id-');
			hashId = hashId[1];

		var data = APP.dataHash[hashId];

		lib.ajax.get(APP.jsonLogo+data.Op, function(res){


			data.logo = './img/unknown.png';
			data.Mdl = data.Mdl||'Unknown';
			data.Man = data.Man||'Unknown';
			data.From = data.From||'Unknown';
			data.To = data.To||'Unknown';
			
			if(res.length>0){ data.logo = res[0].logo; }
			

			lib.getView('company.hbs', data, '#company-info');

		});	

		$(location).attr('href', url+'#flight-info-'+id);
		$('#page-map').css({'display':'none'});
		$('.company-info').css({'display':'block'});

	});

});
