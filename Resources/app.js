(function() {
	Ti.Database.install('potninalogi.sqlite', 'potninalogi');
	
	Ti.UI.setBackgroundColor('#fff');
	var tabGroup = Ti.UI.createTabGroup();
	var mainTabGroup = Ti.UI.createTabGroup();
	
	var loginTab = require('/UI/loginView/loginTab').init();
	tabGroup.addTab(loginTab);
	tabGroup.open();
	
	Ti.App.addEventListener('grantEntrance', function(event) {
		Ti.API.info('Event id is: '+event.id);
		Ti.App.Properties.setInt('IdUser', event.id);
		var newExpenseReportTab = require('/UI/newExpenseReportView/newExpenseReportTab').init();
		var previewExpenseReportTab = require('/UI/previewExpenseReport/previewExpenseReportTab').init();
		var settingsTab = require('/UI/settings/settingsTab').init();
		mainTabGroup.addTab(newExpenseReportTab);
		mainTabGroup.addTab(previewExpenseReportTab);
		mainTabGroup.addTab(settingsTab);
		mainTabGroup.open();
		tabGroup.close();
		
	});
	
	
})();
