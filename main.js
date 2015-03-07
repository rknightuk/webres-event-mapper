$(document).ready(function() {

	var map,
		infoWindow = null,
		markers = [],
		boxes,
		g_day = 31,
		g_single = false;
		g_crimes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
		g_index = [
			"Anti-social behaviour",
			"Bicycle theft",
			"Criminal damage and arson",
			"Other theft",
			"Public order",
			"Shoplifting",
			"Violence and sexual offences",
			"Burglary",
			"Drugs",
			"Vehicle crime",
			"Robbery",
			"Theft from the person",
			"Other crime",
			"Possession of weapons"
		];

	function initialize() {
		var mapOptions = {
			center: { lat: 50.817293, lng: -1.073966 },
			zoom: 13,
			disableDefaultUI: true
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	$.ajax({
		dataType: "json",
		url: 'data.json',
		success: function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
			
				var location = new google.maps.LatLng(data[i].Latitude,data[i].Longitude);

				var content = '<p><strong>'+data[i].crime_type+'</strong></p><p>'+data[i].day+' January 2014<p>';

				var crime_id = getCrimeId(data[i].crime_type);
				var crime_type = data[i].crime_type;

				addPoint(location, content, crime_id, data[i].day);

				if ( ! $('*[data-crime-id="'+crime_id+'"]').length) {
					generateCheckbox(crime_id, crime_type)
				}
			};

			addListeners();
		}
	});

	function getCrimeId(type) {
		return g_index.indexOf(type);
	}

	function generateCheckbox(id, type) {
		var title = type;
        var checkbox = document.createElement('p');
        checkbox.innerHTML = '<label><input type="checkbox" data-crime-id="' + id + '" checked> <img src="icons/' + id + '.png"> ' + type + '</label>';
        document.getElementById('filters').appendChild(checkbox);
	}

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

	function addListeners() {
		$('#filters input:checkbox').on('change', function(e) {
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
	};

	$('input[type=range]').on("change mousemove", function() {
		var day = $(this).val();

		g_day = day;

		$(this).next().html('January ' + day+getOrdinal(day) + ' 2015');

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
		boxes = $('#filters input:checkbox');

		$(boxes).each(function(box) {
			if ($(this).prop('checked')) {
				g_crimes.push($(this).data('crime-id'));
			}
		});
	}

});