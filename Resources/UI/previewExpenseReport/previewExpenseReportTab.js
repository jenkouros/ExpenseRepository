var init = function() {
	var win = Ti.UI.createWindow({
		title: 'Pregled potnih nalogov',
		url: '/UI/newExpenseReportView/newExpenseReportView.js'
	});
	
	var tab = Ti.UI.createTab({
		title: 'Pregled',
		window: win,
		icon: '/UI/images/notes_2.png'
	});
	
	return tab;
}

exports.init = init;
