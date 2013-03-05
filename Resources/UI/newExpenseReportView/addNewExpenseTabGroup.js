var addNewExpenseTabGroup = function() {
	var tabGroup = Ti.UI.createTabGroup();
	var win = Ti.UI.createWindow({
		url: '/UI/newExpenseReportView/addNewExpenseDataView.js',
		title: 'Novi strošek',
		tabBarHidden: true,
		backgroundColor: '#fff'
	});
	
	var addNewExpenseTab = Ti.UI.createTab({
		window: win,
		title: 'Novi strošek',
		icon: '/UI/images/euro.png'
	})
	
	tabGroup.addTab(addNewExpenseTab);
	
	return tabGroup;
};

exports.addNewExpenseTabGroup = addNewExpenseTabGroup;
