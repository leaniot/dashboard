var pointsMarkers = [],
	curveMarker;

// Info window options
var winOpts = {
	width : 250,     // 信息窗口宽度
	height: 80,     // 信息窗口高度
	title : 'Test' , // 信息窗口标题
	enableMessage:true//设置允许信息窗发送短息
};

var initMap = function (domId) {
	var map = new BMap.Map(domId);
	// map.enableScrollWheelZoom();
	// map.enableContinuousZoom();
	map.enableAutoResize();
	map.addControl(new BMap.NavigationControl());
	return map;
}

// TODO: use this function instead of clearOverlays()
var resetOverlays = function (map) {
	// // Remove pointsMarker
	// for (var i = 0; i < pointsMarkers.length; i ++) {
	// 	map.removeOverlay(pointsMarkers[i]);
	// }
	map.clearOverlays();
};

var plotOneDevicePoints = function (map, data, callback) {
	// Remove all the overlays
	resetOverlays(map);
	// Convert gps locations into Baidu Map Points objects
	var locations = data.locations,
		points    = _.map(locations, function (location) {
			return new BMap.Point(location[1], location[0]);
		});
	// Set the map bounds and center automatically
	map.setViewport(points);
	// Plot points as markers on the map
	for (var i = 0; i < points.length; i ++) {
		var marker = new BMap.Marker(points[i]);
		// Add click event for each of markers
		marker.addEventListener('click', function (e) {
			var p          = e.target,
				pt         = e.point,
				content    = '',
				geoc       = new BMap.Geocoder();

			geoc.getLocation(pt, function(rs){
				var addComp = rs.addressComponents,
					addr    = String.format('{0},{1},{2},{3},{4}', 
						addComp.province, addComp.city, addComp.district, 
						addComp.street, addComp.streetNumber);
				var	point      = new BMap.Point(p.getPosition().lng, p.getPosition().lat),
					infoWindow = new BMap.InfoWindow(addr, winOpts); // Create info window
				map.openInfoWindow(infoWindow, point);               // Open info window
			});
			// Run callback in click event
			// Share the raw data that belongs to the point
			callback(e);
		});
		map.addOverlay(marker);
		// Push maker into pointsMarkers
		// pointsMarkers.push(marker);
		// Set the first point animation bounce
		if (i == 0) {
			marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		}
	}
	// Set curve for each pair of two consecutive points
	curveMarker = new BMapLib.CurveLine(points, 
		{strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); 
	map.addOverlay(curveMarker); 
}

baiduMap = {
	liveProjectMap: function (projectId, domId, limit, interval) {

	},

	liveDeviceMap: function (deviceId, domId, limit, interval, callback) {
		// Init the map
		var map = initMap(domId);
		// First request
		requestBackEnd(
			{ deviceId: deviceId, limit: limit, token: token},
			'/geoSensorLatestMapView' 
		).then(function (data) {
			// Plot points on the map
			plotOneDevicePoints(map, data, callback);
			// Start timer to update the map periodically
			setInterval(function() {
				// Periodical request
				requestBackEnd(
					{ deviceId: deviceId, limit: limit, token: token},
					'/geoSensorLatestMapView' 
				).then(function (data) {
					// Plot points on the map
					plotOneDevicePoints(map, data, callback);
				});
			}, interval);
		});
	},

	updateSensorMap: function (deviceId, domId, lineChartData) {
		// Init the map
		var map = initMap(domId);

		var startTime = _.min(lineChartData.timestamps),
			endTime   = _.max(lineChartData.timestamps);

		requestBackEnd(
			{ deviceId: deviceId, limit: 100, token: token},
			'/geoSensorLatestMapView' 
		).then(function (data) {
			console.log(data);
			// var icon = new BMap.Icon(
			// 	url.iconUrl, 
			// 	new BMap.Size(32, 70), 
			// 	{imageOffset: new BMap.Size(0, 0)});
			// // Relocate the center of the map
			// var center = [116.403694, 39.927552];
			// var point = new BMap.Point(center);
			// map.centerAndZoom(point, 15);
			// // Set marker
			// marker = new BMap.Marker(center,{ icon: icon });
			// map.addOverlay(marker);
			// marker.setPosition(point);
		});
	}
};

