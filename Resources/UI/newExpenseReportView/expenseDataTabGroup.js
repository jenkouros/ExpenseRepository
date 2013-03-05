var expenseDataGroup = function() {
	var expenseDataTabGroup = Ti.UI.createTabGroup();
	var expenseDataWindow = Ti.UI.createWindow({
		url: '/UI/newExpenseReportView/expenseDataView.js',
		title: 'Stroški',
		tabBarHidden: true,
		backgroundColor: '#fff'
	});
	
	var expenseDataTab = Ti.UI.createTab({
		window: expenseDataWindow,
		title: 'Stroški',
		icon: '/UI/images/euro.png'
	});
	expenseDataTabGroup.addTab(expenseDataTab);
	
	return expenseDataTabGroup;
};

exports.expenseAddTabGroup = expenseDataGroup;
