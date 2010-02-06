/**
 * Helper class for creating google charts using information gathered from the Tweetalytc engine.
 * @author Ryan Sandor Richards.
 * @copyright 2010 Ryan Sandor Richards
 */
function GoogleChart() {
	this.baseURL = 'http://chart.apis.google.com/chart?';
	this.params = {
		'cht': 'lc',
		'chs': '300x200'
	};
	this.dataSets = []; // chd
	this.axisLabels = {}; // chxt & chxl
	this.axisPositions = {}; // chxp
	this.markers = []; 	// chm
	
	/**
	 * Evaluates the URL for the chart.
	 * @return The image URL for the chart.
	 */
	this.getURL = function() {
		var url = this.baseURL;
		
		// Add flat parameters
		for (var k in this.params) {
			url += '&' + k + '=' + escape(this.params[k]);
		}
		
		// Add datasets
		var sets = [];
		for (var i in this.dataSets) {
			var set = this.dataSets[i];
 			sets.push('t:' + set.join(','));
		}
		url += '&chd=' + sets.join('|');
		
		// Add axis labels and positions
		var axes = [];
		var labels = [];
		var positions = [];
		var count = 0;
		for (var axis in this.axisLabels) {
			axes.push(axis);
			labels.push(count + ":|" + this.axisLabels[axis].join('|'));
			if (this.axisPositions[axis] != null) {
				positions.push(count + "," + this.axisPositions[axis].join(','));
			}
			count++;
		}
		
		if (axes.length > 0) {
			url += '&chxt=' + axes.join(',');
			url += '&chxl=' + labels.join('|');
		}
		
		if (positions.length > 0) {
			url += '&chxp=' + positions.join('|');
		}
		
		// Chart markers
		url += '&chm=' + this.markers.join('|');
		
		return url;
	}
	
	/**
	 * Adds a dataset to the chart.
	 * @param data Dataset to add.
	 */
	this.addDataSet = function(data) {
		this.dataSets.push(data);
	};
	
	/**
	 * Removes a dataset with the given index.
	 * @return The data represented in the removed set.
	 * @throws Exception if index < 0 or >= the number of datasets.
	 */
	this.removeDataSet = function(index) {
		if (index < 0 || index >= this.dataSets.length) {
			throw "Dataset index out of bounds!";
		}
		return this.dataSets.splice(index, 1);		
	};
	
	/**
	 * Removes all datasets currently in the chart.
	 */
	this.clearDataSets = function() {
		this.dataSets = [];
	};
	
	/**
	 * Adds labels to an axis on the chart.
	 * @param axis The axis for the labels (can be: x, y, r, or t).
	 * @param labels Labels for the axis.
	 * @param (optional) Positions for the labels along the axis.
	 */
	this.addAxisLabels = function(axis, labels, positions) {
		this.axisLabels[axis] = labels;
		if (positions != null) {
			this.axisPositions[axis] = positions;
		}
	}
	
	/**
	 * Sets the type of the chart.
	 * @param type The type of the chart, see the chart type constants below.
	 */
	this.setChartType = function(type) {
		this.params['cht'] = type;
	};
	
	/**
	 * Sets the size of the chart.
	 * @param width Width for the chart image.
	 * @param height Height for the chart image.
	 * @throws Exception if the width or height exceeds 1,000 pixels or the total
	 *   number of pixels exceeds 300,000.
	 */
	this.setChartSize = function(width, height) {
		if (width > 1000) {
			throw "Chart width cannot exceed 1000 pixels";
		}
		if (height > 1000) {
			throw "Chart height cannot exceed 1000 pixels";
		}
		if (width * height > 300000) {
			throw "Total number of pixels cannot exceed 300,000"
		}
		this.params['chs'] = width + "x" + height;
	};
	
	/**
	 * Sets the color for the chart.
	 * @param c Six hexidecimal digit color representation.
	 */
	this.setChartColor = function(c) {
		this.params['chco'] = c;
	};
	
	/**
	 * Adds a chart market style for the chart.
	 * @param type (default: GoogleChart.MARKER_SQUARE) Type of the chart marker (see constants below).
	 * @param color (default: '000000') Marker color (in six hexidecimal digit format).
	 * @param datasetIndex (default: 0) Index of the dataset for which to mark.
	 * @param dataPoint (default: GoogleChart.ALL_DATA_POINTS) The data point for which to draw the marker.
	 * @param size (default: 5) Size of the marker in pixels.
	 * @param priority (default: GoogleChart.MARKERS_NORMAL) When the marker(s) are drawn (see constants below).
	 */
	this.addChartMarker = function(type, color, datasetIndex, dataPoint, size, priority) {
		if (type == null) { type = 's'; }
		if (color == null) { color = '000000'; }
		if (datasetIndex == null) { datasetIndex = 0; }
		if (dataPoint == null) { dataPoint = -1; }
		if (size == null) { size = '5.0'; }
		if (priority == null) { priority = 0; }
		var markerAry = [type, color, datasetIndex, dataPoint, size, priority];
		this.markers.push(markerAry.join(','));
	};
	
	/**
	 * Clears all chart markers associated with the chart.
	 */
	this.clearChartMarkers = function() {
		this.markers = [];
	};
	
	/**
	 * Sets the data scaling for the chart.
	 * @param min Minimum value for the chart.
	 * @param max Maximum value for the chart.
	 */
	this.setDataScaling = function(min, max) {
		this.params['chds'] = [min, max].join(',');
	};
}

/**
 * Chart type constants.
 */
GoogleChart.LINE = 'lc';

/**
 * Chart marker type constants.
 */
GoogleChart.ARROW = 'a';
GoogleChart.CROSS = 'c';
GoogleChart.DIAMOND = 'd';
GoogleChart.CIRCLE = 'o';
GoogleChart.SQUARE = 's';
GoogleChart.X = 'x';
GoogleChart.VERTICAL = 'v';
GoogleChart.VERTICAL_CHART = 'V';
GoogleChart.HORIZONTAL = 'h';

/**
 * Used to mark all data points.
 */
GoogleChart.ALL_DATA_POINTS = -1;

/**
 * Chart marker drawing priority constants.
 */
GoogleChart.MARKERS_BEFORE = -1;
GoogleChart.MARKERS_NORMAL = 0;
GoogleChart.MARKERS_AFTER = 1;

/**
 * Timeline charting frequency constants. These determine how data points are
 * distributed. For instance if choosing Chart.HOURLY then each data point would
 * represent compiled data from a given hour.
 */
GoogleChart.HOURLY = 0;
GoogleChart.DAILY = 1;
GoogleChart.WEEKLY = 2;

/**
 * Static helper function for creating charts based on timeline results returned
 * from the Tweetalytc statistics engine.
 * @param stats Processed timeline statistics.
 * @parma frequency How often to sample data points.
 * @param dataPoints Total number of sample data points to display. 
 * @return A GoogleChart object representing the chart.
 */
GoogleChart.timelineChart = function(stats, frequency, dataPoints) {
	if (frequency == null) { frequency = GoogleChart.DAILY;	}
	if (dataPoints == null) {	dataPoints = 10; }
	
	var chart = new GoogleChart();
	var dataSet = [];
	var labels = [];
	var max = 0;
	var min = null;
	
	// Construct dataset and labels for a daily chart.
	if (frequency == GoogleChart.DAILY) {
		for (var i = 0; i < stats.days.length; i++) {
			if (dataPoints == 0) { break; }
			dataPoints--;
			
			var count = stats.days[i].statuses.length;
			
			if (count > max) { max = count; }
			if (min == null || count < min) { min = count; }
			
			dataSet.push(count);
			
			var date = stats.days[i].date;
			var dateLabel = date.getMonth() + "/" + date.getDate();
			labels.push(escape(dateLabel));
		}
		dataSet.reverse();
		labels.reverse();
	}
	
	// Add data set to the chart
	chart.addDataSet(dataSet);
	chart.setDataScaling(0, max);
	
	// Label and style the chart
	chart.addAxisLabels('x', labels);
	chart.addAxisLabels('y', [0, max/4, max/2, 3*max/4, max]); // Disregarding minimum for now ;)
	
	
	chart.setChartColor('555555');
	chart.addChartMarker(GoogleChart.CIRCLE, '000099', 0, -1, 5);

	// Return the chart :)
	return chart;
}