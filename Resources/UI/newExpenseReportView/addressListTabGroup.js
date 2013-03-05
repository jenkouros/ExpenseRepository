var addressDataGroup = function() {
	var addressDataTabGroup = Ti.UI.createTabGroup();
	var addressDataWindow = Ti.UI.createWindow({
		url: '/UI/newExpenseReportView/addressListView.js',
		title: 'Pot',
		tabBarHidden: true,
		backgroundColor: '#fff'
	});
	var addressDataTab = Ti.UI.createTab({
		window: addressDataWindow,
		title: 'Pot',
		icon: '/UI/images/path_line.png'
	});
	addressDataTabGroup.addTab(addressDataTab);
	return addressDataTabGroup;
};
exports.addressListTabGroup = addressDataGroup;