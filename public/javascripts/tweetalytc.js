/**
 * Tweetalytc Twitter Statistics Gathering Engine
 * @requires tweetalytc.js
 * @author Ryan Sandor Richards
 * @copyright 2010 Ryan Sandor Richards
 */
function Tweetalytc() {
	/**
	 * Given two Date objects this determines if they represent different days.
	 * @param d1 First Date object.
	 * @param d2 Second Date object.
	 * @return True if the the Dates are different, false otherwise.
	 */
	this.differentDay = function(d1, d2) {
		return d1.getDate() != d2.getDate() || d1.getMonth() != d2.getMonth() || d1.getYear() != d2.getYear();
	};
	
	/**
	 * Processes timelines and extracts data from Twitter API responses. Specifically it buckets
	 * all of the statuses by day and collects totals and averages over the statuses in the
	 * timeline.
	 * 
	 * The method returns a hash containing the processed timeline information. That hash contains
	 * the following keys:
	 *
	 *   statuses - An array containing all the statuses from the processed timeline.
	 *   days - An array containing daily information for active days ordered decreasing by date.
	 *   total_statuses_length - Total amount of text in all statuses in given timeline.
	 *   average_status_length - The average length of a status update.
	 *   average_statuses_per_day - Average number of status updates per day.
	 *   total_statuses - Total number of status update processed.
	 *   
	 * Each of the days in the "days" array has the following information:
	 *
	 *   date - The exact date of the last status update on that day.
	 *   statuses - An array containing the statuses that occurred on that day.
	 *   total_status_length - The combined length of all statuses that occured on that day.
	 *   average_status_length - The average length of statuses on that day.
	 *   velocity - The rate of change in statuses from the day before (if available, null otherwise).
	 *   
	 * @param timeline Object containing timeline information.
	 * @return A stats hash containing as described above.
	 */
	this.processTimeline = function(timeline) {
		var stats = {
			statuses: timeline,
			days: [],
			total_statuses_length: 0,
			average_status_length: 0,
			average_statuses_per_day: 0
		};
		var lastDate = null;
		
		for (var i = 0; i < timeline.length; i++) {
			var entry = timeline[i];
			var date = new Date(Date.parse(entry.created_at));
			
			if (lastDate == null || this.differentDay(date, lastDate)) {
				// Calculate averages if need be
				if (lastDate != null) {
					var lastIndex = stats.days.length-1;
					stats.days[lastIndex].average_status_length = 
						stats.days[lastIndex].total_statuses_length / stats.days[lastIndex].statuses.length;
				}
				
				// Calculate velocity if need be
				if (stats.days.length > 1) {
					var x0 = stats.days.length - 1;
					var x1 = stats.days.length - 2;
					stats.days[x1].velocity = stats.days[x1].statuses.length - stats.days[x0].statuses.length;
				}
				
				// Append a new day hash
				stats.days.push({
					date: date,
					statuses: [], 
					total_statuses_length: 0,
					average_status_length: 0,
					velocity: null
				});
			}
			lastDate = date;
			
			stats.total_statuses_length += entry.text.length;
			var dayIndex = stats.days.length - 1;
			stats.days[dayIndex].statuses.push(entry);
			stats.days[dayIndex].total_length += entry.text.length;	
		}
		
		stats.average_status_length = stats.total_statuses_length / timeline.length;
		stats.average_statuses_per_day = timeline.length / stats.days.length;
		
		return stats;
	};
}