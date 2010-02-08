/**
 * Tweetaly.tc report page interface and event scripting.
 * @requires jquery-1.4.min.js, googlechart.js, twitter.js, and tweetalytc.js.
 * @author Ryan Sandor Richards.
 */
var UserReport = {
	engine: null,
	user: null,
	report: null,
	
	/**
	 * Initializes the reports page. Call this method after the DOM for the
	 * users page has been fully loaded.
	 * @param screen_name Screen name of the user for which to fetch the
	 *   analytics information.
	 */
	init: function(screen_name) {
		this.engine = new Tweetalytc(screen_name);
		
		// Load user information and generate the report
		this.engine.loadUser(this.createReport);
	},
	
	/** 
	 * Generates the report and charts based off the user data obtained from
	 * the Tweetalytc engine. This method is indended to be used as a callback
	 * to the Tweetalytc.loadUser method.
	 *
	 * @param userData User, timeline, friends, and followers data obtained via 
	 *   the tweetalytc engine.
	 */
	createReport: function(userData) {
		var user = UserReport.user = userData;

		// Create the report div
		var $report = $('#templates .report').clone();
		$('#loading').after($report);
		UserReport.report = $report;
		
		// Update the report
		UserReport.update();

		// Create the charts
		UserReport.addTimelineChart('Tweets', 'statuses');
		UserReport.addTimelineChart('Average Tweet Length', 'tweet_length');
		UserReport.addTimelineChart('Velocity', 'velocity');

		// Results events
		$report.find('a.refine').click(UserReport.addMore);

		// Show the report
		$('#loading').hide();
		$report.fadeIn(500);
		
		// Start the rate limit loop
		this.updateRateLimit(function() { $('#rate-limit').fadeIn(500); });
		setInterval(this.updateRateLimit, 4000);
	},
	
	/** 
	 * Updates the current report from user information obtained or updated from
	 * twitter.
	 */
	update: function() {
		var user = UserReport.user;
		var $report = UserReport.report;
		
		$report.find('.tweets').html(user.statuses_count);
		$report.find('.followers').html(user.followers_count);
		$report.find('.friends').html(user.friends_count);

		var timeline = user.timeline;
		$report.find('.avg_tweets_per_day').html(timeline.average_statuses_per_day);
		$report.find('.avg_tweet_length').html(timeline.average_status_length);
		$report.find('.current_velocity').html(timeline.days[0].velocity)
		$report.find('.num-tweets').html(timeline.statuses.length);

		var followers = user.followers;
		$report.find('.retweet_potential').html(followers.retweet_potential);
		$report.find('.avg_retweet_potential').html(followers.avg_retweet_potential);
		$report.find('.num-followers').html(followers.users.length);
	},
	
	/**
	 * Adds a timline chart to the report.
	 * @param title Title for the chart.
	 * @param metric Which metric to display, can be: statuses, tweet_length or velocity.
	 * @param dataPoints (Default: 7) Number of data points to display in the chart.
	 */
	addTimelineChart: function(title, metric, dataPoints) {
		if (dataPoints == null) {
			dataPoints = 7; 
		}
		
		var user = UserReport.user;
		var $container = UserReport.report.children('#charts');
		var gchart = GoogleChart.timelineChart(user.timeline, metric, dataPoints);
		
		var $chart = $('#templates .chart').clone();
		$chart.children('h2').html(title);
		$chart.children('img').attr('src', gchart.getURL());
		$chart.find('a.more').click(UserReport.seeFurther);

		$container.append($chart);

		$chart.data('metric', metric);
		$chart.data('dataPoints', dataPoints);
		$chart.data('changes', true);
	},
	
	/**
	 * Report event handler. This method is called in response to the user pressing
	 * the "Add more tweets and followers!" link located below the main reports
	 * section on the page. Specifically this method is bound to the click event of
	 * that link.
	 */
	addMore: function() {
		// Add the loading class and unbind the click event
		var $link = $(this);
		$link.addClass('loading');
		$link.unbind('click');
		
		// Fetch the new information using the Twitter API
		var user = UserReport.user;
		user.timeline.more(function(changes) { 
			user.followers.more(function(changes) {
				// Update the report with the new information
				UserReport.update();
				
				// Remove the loading class and bind the click event
				$link.removeClass('loading');
				$link.click(UserReport.addMore);
			}); 
		});
	},
	
	/**
	 * Charting event handler. This method is bound to the "see further" link located
	 * directly under a chart on the page. It queries the current user timeline to
	 * fetch more entries and then updates the image displayed in the chart.
	 */
	seeFurther: function() {
		var $link = $(this);
		var $this = $link.parents('div.chart');
		var dataPoints = $this.data('dataPoints') + 10;
		var metric = $this.data('metric');
		var user = UserReport.user;

		function updateChart() {
			var gchart = GoogleChart.timelineChart(user.timeline, metric, dataPoints);
			$this.find('img').attr('src', gchart.getURL());
			$this.data('dataPoints', dataPoints);
			$link.removeClass('loading');
			$link.click(UserReport.seeFurther);
		}

		$link.unbind('click');
		$link.addClass('loading');

		if ($this.data('changes')) {
			user.timeline.more(function(changes) {
				$this.data('changes', changes);
				updateChart();
			});
		}
		else {
			updateChart();
		}
	},
	
	/**
	 * Updates the rate limit status located at the top of the page. Specifically this
	 * queries the Twitter API to determine the number of remaining hits and the next
	 * reset time for the current IP. It formats the information and drops it into the
	 * p#rate-limit tag on the page. 
	 * 
	 * It also sets a status class of either: good, warning, or critical which change 
	 * the styles of the paragraph in order to more effectively communicate to the user 
	 * within in the current hour.
	 *
	 * The initialization function also sets an interval to call this method every four
	 * seconds so that the user has up-to-date information as they are browsing a user's
	 * twitter analytics.
	 * 
	 * @param callback (Default: null) Call back to execute upon completion.
	 */
	updateRateLimit: function(callback) {
		new Twitter().rateLimitStatus(function(response) {
			var remaining_hits = response.remaining_hits;
			var $p = $('#rate-limit');

			var statuses = ['.critical', '.warning', '.good'];
			for (var i = 0; i < statuses.length; i++) {
				var status = statuses[i];
				$p.removeClass(status)
			}

			if (parseInt(remaining_hits) < 50)
				$p.addClass('critical');
			else if (parseInt(remaining_hits) < 100) 
				$p.addClass('warning');
			else
				$p.addClass('good')

			$('.remaining-hits').html(response.remaining_hits);

			var reset_time = new Date(response.reset_time);
			var hours = reset_time.getHours();
			var min = reset_time.getMinutes();
			if (min < 10)
				min = "0" + min; 

			$('.reset-time').html(hours + ":" + min);

			if (callback != null && typeof(callback) == "function") {
				callback();
			}
		});
	}
};