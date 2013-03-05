var init = function() {
	var loginWindow = Ti.UI.createWindow({
		title: 'Prijava',
		tabBarHidden: true,
		url: '/UI/loginView/loginView.js'
	});
	var loginTab = Ti.UI.createTab({
		window: loginWindow,
		title: 'Prijava'
	});
	
	return loginTab;
};

exports.init = init;
