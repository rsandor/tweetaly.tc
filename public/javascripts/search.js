/**
 * Initializes even scripting for the search box.
 * @param path (Default: 'users/') Path to the user display page.
 * @author Ryan Sandor Richards
 */
function initSearch(path) {
	if (path == null) {
		path = 'users/';
	}
	function user_search() {
		var name = $('#n').val();
		if (!name.match(/^[a-zA-Z0-9]+$/)) {
			alert('Invalid username!');
			return;
		}
		window.location = path + name;
	}
	$('#g').click(user_search);
	$('#n').keydown(function(event) {
		if (event.keyCode == 13) { user_search(); }
	});
}