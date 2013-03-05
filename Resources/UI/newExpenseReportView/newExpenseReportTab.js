var init = function() {
	var win = Ti.UI.createWindow({
		title: 'Nov potni nalog',
		url: '/UI/newExpenseReportView/newExpenseReportView.js'
	});
	
	var tab = Ti.UI.createTab({
		title: 'Nov',
		window: win,
		icon: '/UI/images/cars.png'
	});
	
	return tab;
}

exports.init = init;
