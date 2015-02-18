$(document).ready(function() {

	var map,
		infoWindow = null,
		markers = {
			crime_1: [],
			crime_2: [],
			crime_3: [],
			crime_4: [],
			crime_5: []
		},
		boxes = $('#filters input:checkbox');

	function initialize() {
		var mapOptions = {
			center: { lat: 50.794348, lng: -1.074721 },
			zoom: 14,
			disableDefaultUI: true
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	$.ajax({
		dataType: "json",
		url: 'newdata.json',
		success: function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
			
				var location = new google.maps.LatLng(data[i].lat,data[i].long);

				var content = '<p><strong>'+data[i].crime+'</strong></p><p>'+data[i].day+' December 2014<p>';

				addPoint(location, content, data[i].crime_id);
			};
		}
	});

	function addPoint(position, content, crime_id) {
		var marker = new google.maps.Marker({
			position: position,
			map: map
		});

		markers['crime_'+crime_id].push(marker);

		google.maps.event.addListener(marker, 'click', function() {
			if (infoWindow) {
		        infoWindow.close();
		    }

			infoWindow = new google.maps.InfoWindow({
				content: content
			});

			infoWindow.open(map, marker);
		});
	};

	boxes.change(function(e){
		var crime_id = $(e.currentTarget).data('crimeId');
		var checked = $(e.currentTarget).prop('checked');

		$(markers['crime_'+crime_id]).each(function(id, marker) {
			if (checked) {
				marker.setVisible(true);
			}
			else {
				marker.setVisible(false);
			}
			// setTimeout(function() {
			// 	marker.setVisible(true);
			// }, 1000);
		})
	});

});