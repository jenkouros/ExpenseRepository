var addressDataGroup = function(locationAddress) {
	var addressDataTabGroup = Ti.UI.createTabGroup();
	var addressDataWindow = Ti.UI.createWindow({
		url: '/UI/newExpenseReportView/addressDataView.js',
		layout: 'vertical',
		title: 'Lokacija',
		tabBarHidden: true,
		backgroundColor: '#fff',
		locationAddress: locationAddress
	});
	
	var addressDataTab = Ti.UI.createTab({
		window: addressDataWindow,
		title: 'Lokacija',
		icon: '/UI/images/direction.png'
	});
	addressDataTabGroup.addTab(addressDataTab);
	return addressDataTabGroup;
};
exports.addressAddTabGroup = addressDataGroup;