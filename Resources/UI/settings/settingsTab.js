var init = function() {
	var win = Ti.UI.createWindow({
		title: 'Nastavitve',
		url: '/UI/newExpenseReportView/newExpenseReportView.js'
	});
	
	var tab = Ti.UI.createTab({
		title: 'Nastavitve',
		window: win,
		icon: '/UI/images/cogwheels.png'
	});
	
	return tab;
}

exports.init = init;
