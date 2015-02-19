$(document).ready(function() {

	var map,
		infoWindow = null,
		markers = [],
		boxes = $('#filters input:checkbox'),
		g_day = 31,
		g_single = false;
		g_crimes = [1,2,3,4,5];

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
			map: map,
			icon: 'icons/'+crime_id+'.png'
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

		setFilters();

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

		$(this).next().html(day+getOrdinal(day));

		sortMarkers(day);
	});

	$('#single-day').change(function(e) {
		var checked = $(e.currentTarget).prop('checked');

		g_single = checked ? true : false;

		sortMarkers(g_day);
	});

	function getOrdinal(day)
	{
		if (day >= 11 && day <= 13) return 'th';

		day = day % 10;

		if (day == 1) return 'st';
        if (day == 2) return 'nd';
        if (day == 3) return 'rd';

        return 'th';
	}

	function sortMarkers(day) {
		$(markers).each(function(id, marker) {
			if (g_crimes.indexOf(marker.crime_id) == -1) return;

			if (g_single) {
				if (marker.day == day) {
					marker.setVisible(true);
				}
				else {
					marker.setVisible(false);
				}
			}
			else {
				if (marker.day <= day) {
					marker.setVisible(true);
				}
				else {
					marker.setVisible(false);
				}
			}
		});
	}

	function setFilters() {
		g_crimes = [];

		$(boxes).each(function(box) {
			if ($(this).prop('checked')) {
				g_crimes.push($(this).data('crime-id'));
			}
		});
	}

});