jQuery.sap.declare("common.GoogleMap");
jQuery.sap.declare("common.Common");

//var GoogleMap = null;

common.GoogleMap = {
		
	PAGEID : "",
	GoogleMap : null,
	
	/** 
	* @memberOf common.GoogleMap
	*/

	createMap : function(PAGEID) {
		
		
		common.GoogleMap.PAGEID = PAGEID;
		
		var doota = new google.maps.LatLng(37.569152, 127.009048);
//		var doosan = new google.maps.LatLng(37.397189, 127.2323203);//
//		var doosaninfra = new google.maps.LatLng(37.542624,127.149176);
		
		var mapOptions = {
		          center: doota,
		          zoom: 12,
		          disableDefaultUI: true,
		          mapTypeId: google.maps.MapTypeId.ROADMAP
		        };
		
		var directionsDisplay = new google.maps.DirectionsRenderer();
		
		common.GoogleMap.GoogleMap = new google.maps.Map(document.getElementById(PAGEID + '_MapLayout'), mapOptions);
		
//		var marker1 = new google.maps.Marker({
//		      position: doota,
//		      map: GoogleMap,
//		      title: '두산타워',
//		      draggable:true,
//		      animation: google.maps.Animation.DROP,
//		  });
//		
//		var marker2 = new google.maps.Marker({
//		      position: doosaninfra,
//		      map: GoogleMap,
//		      title: '연강원(연수원)',
//		      draggable:true,
//		      animation: google.maps.Animation.DROP,
//		  });
		
		directionsDisplay.setMap(common.GoogleMap.GoogleMap);
		
//		var lineSymbol = {
//		    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
//		 };
//		
//		var flightPath = new google.maps.Polyline({
//		    path: [doota, doosaninfra],
//		    strokeColor: '#FF0000',
//		    icons: [{
//		        icon: lineSymbol,
//		        offset: '100%'
//		      }],
//		  });
//
//		flightPath.setMap(common.GoogleMap.GoogleMap);
	},
	
	setMap : function(from, from_name, to, to_name) {
		if(from == "" && to == "") {
			return;
		}
		if(from == "" && to != "") {
			from = to;
			from_name = to_name;
		}
		if(from != "" && to == "") {
			to = from;
			to_name = from_name;
		}
		var froms = from.split(",");
		var tos = to.split(",");
		
		var fromLat = new google.maps.LatLng(parseFloat(froms[0]), parseFloat(froms[1]));
		var toLat = new google.maps.LatLng(parseFloat(tos[0]), parseFloat(tos[1]));
		
		if(from != to) {
			var marker1 = new google.maps.Marker({
			      position: fromLat,
			      map: common.GoogleMap.GoogleMap,
			      title: from_name,
			      draggable:true,
			      animation: google.maps.Animation.DROP,
			});
			
			var marker2 = new google.maps.Marker({
			      position: toLat,
			      map: common.GoogleMap.GoogleMap,
			      title: to_name,
			      draggable:true,
			      animation: google.maps.Animation.DROP,
			});
			
			var lineSymbol = {
				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
			};
				
			var flightPath = new google.maps.Polyline({
			    path: [fromLat, toLat],
			    strokeColor: '#FF0000',
			    icons: [{
			        icon: lineSymbol,
			        offset: '100%'
			    }],
			});

			flightPath.setMap(common.GoogleMap.GoogleMap);
		} else {
			var marker1 = new google.maps.Marker({
			      position: fromLat,
			      map: common.GoogleMap.GoogleMap,
			      title: from_name,
			      draggable:true,
			      animation: google.maps.Animation.DROP,
			});
		}
		
	}
};