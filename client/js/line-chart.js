lineChart = {
	liveLine: function (apiParam, apiUrl, domId) {
		var canvas = document.getElementById(domId),
    		ctx    = canvas.getContext('2d');
		// Request data first time.
		requestBackEnd(apiParam, apiUrl).then(
	 		function (data) {
	 			// Labels for starting data
	 			var labels   = data.timestamps,
	 			// datasets for starting data
	 				datasets = _.chain(data.data).
	 			// Extract temporal data from data according to "temporalKeys"
	 					map(function (item) {
		 					return _.map(data.temporalKeys, function (key) {
		 						return item[key];
	 						});
	 					// Unzip to reshape the 2d array, 
	 					// Make same type of data into a same array.
	 					}).unzip().value(), 
	 			// Starting data for chart.js
	 				startingData = {
	 					labels: labels,
	 					datasets: _.map(datasets, function (data) {
	 						return {
	 							fillColor: "rgba(220,220,220,0.2)",
								strokeColor: "rgba(220,220,220,1)",
								pointColor: "rgba(220,220,220,1)",
								pointStrokeColor: "#fff",
								data: data
	 						}
	 					})
	 				};
	 			// Reduce the animation steps for demo clarity.
				var liveChart = new Chart(ctx).Line(startingData, {animationSteps: 15});

				setInterval( function() {
					requestBackEnd(apiParam, apiUrl).then(
						function (data) {
					 		var item_ind = 0;
					 		_.map(data.data, function (item) {
					 			var key_ind = 0;
					 			_.map(data.temporalKeys, function (key) {
					 				liveChart.datasets[key_ind].points[item_ind].value = item[key];
									liveChart.datasets[key_ind].points[item_ind].label = item["timestamp"];
					 				key_ind ++;
					 			});
					 			item_ind ++;
					 		})
					 		// Update one of the points in the second dataset
					 		liveChart.update();
					});
					
					
				}, 5000);
	 	});
	}
};