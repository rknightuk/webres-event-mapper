$(document).ready(function() {

	var map,
		infoWindow = null,
		markers = [],
		boxes = $('#filters input:checkbox'),
		g_day = null,
		g_crime = null;

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

				addPoint(location, content, data[i].crime_id, data[i].day);
			};
		}
	});

	function addPoint(position, content, crime_id, day) {
		var marker = new google.maps.Marker({
			position: position,
			map: map
		});

		markers.push(marker);

		marker.crime_id = crime_id;
		marker.day = day;

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

		g_crime = crime_id;

		$(markers).each(function(id, marker) {
			if (marker.crime_id == crime_id) {
				if (checked)
					marker.setVisible(true);
				else
					marker.setVisible(false);
			}
		})
	});

	$('input[type=range]').on("change mousemove", function() {
		var day = $(this).val();

		g_day = day;

		$(this).next().html(day);

		$(markers).each(function(id, marker) {
			if (marker.day <= day) {
				marker.setVisible(true);
			}
			else {
				marker.setVisible(false);
			}
		});
	});

});