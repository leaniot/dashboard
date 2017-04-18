function addCustomLayer(map, customLayer, callback, keyword) {
	if (customLayer) {
		map.removeTileLayer(customLayer);
	}
	customLayer=new BMap.CustomLayer({
		geotableId: 30960,
		q: '',     // Keywords of query
		tags: '',  // multiple strings which was sperated by spaces
		filter: '' // Conditions for filtering, references: http://developer.baidu.com/map/lbs-geosearch.htm#.search.nearby
	});
	map.addTileLayer(customLayer);
	// customLayer.addEventListener('hotspotclick', callback);
}

baiduMap = {
	sensorMap: function (data, domId) {
		var map = new BMap.Map(domId),
			point = new BMap.Point(116.403694,39.927552),
			customLayer;

		map.centerAndZoom(point, 15);
		map.enableScrollWheelZoom();
		map.addControl(new BMap.NavigationControl());
		document.getElementById("open").onclick = function(){
			addCustomLayer(map, customLayer);
		};
		document.getElementById("open").click();
		document.getElementById("close").onclick = function(){
			if (customLayer) {
				map.removeTileLayer(customLayer);
			}
		};
	}
};

