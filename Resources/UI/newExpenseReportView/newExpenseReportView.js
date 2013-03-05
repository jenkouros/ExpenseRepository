var win = Ti.UI.currentWindow;

var idUser = Ti.App.Properties.getInt('IdUser', 0);
Ti.API.info(idUser);
var db = require('/db');

var addNewExpenseReportBtn = Ti.UI.createButton({
	title: 'Nov potni nalog',
	backgroundColor: '#006dcc',
	height: 60,
	color: '#fff',
	backgroundImage: 'none',
	width: '80%'
});

// Potni nalog view
var openExpenseReportView = Ti.UI.createScrollView({
	layout: 'vertical'
});

var endExpenseReportBtn = Ti.UI.createButton({
	title: 'Končaj potni nalog',
	backgroundColor: '#faa732',
	height: 60,
	color: '#fff',
	backgroundImage: 'none',
	width: '80%',
	top: 20
});

var addLocationBtn = Ti.UI.createButton({
	title: 'Dodaj lokacijo',
	backgroundColor: '#006dcc',
	height: 60,
	color: '#fff',
	backgroundImage: 'none',
	width: '80%',
	top: 10
});

var addExpenseBtn = Ti.UI.createButton({
	title: 'Dodaj strošek',
	backgroundColor: '#006dcc',
	height: 60,
	color: '#fff',
	backgroundImage: 'none',
	width: '80%',
	top: 10
});

openExpenseReportView.add(endExpenseReportBtn);
openExpenseReportView.add(addLocationBtn);
openExpenseReportView.add(addExpenseBtn);


// CLICK Nov potni nalog
addNewExpenseReportBtn.addEventListener('click', function(e) {
	db.addNewExpenseReport(idUser);
	win.remove(addNewExpenseReportBtn);
	win.add(openExpenseReportView);
});

// CLICK Končaj potni nalog
endExpenseReportBtn.addEventListener('click', function(e) {
	db.endExpenseReport(idUser);
	win.remove(openExpenseReportView);
	win.add(addNewExpenseReportBtn);
});

// CLICK Dodaj lokacijo
addLocationBtn.addEventListener('click', function() {
	// LOCATION MODULE
	var locationModule = require('/UI/newExpenseReportView/addressListTabGroup');

	var locationAdd = locationModule.addressListTabGroup();
	locationAdd.open();
	Ti.App.addEventListener('addressViewClose', function(e) {
		locationAdd.close();
	});
});

// EXPENSE MODULE
var expenseModule = require('/UI/newExpenseReportView/expenseDataTabGroup');

// CLICK dodaj strosek
addExpenseBtn.addEventListener('click', function(e) {
	var expenseAdd = expenseModule.expenseAddTabGroup();
	expenseAdd.open();
	Ti.App.addEventListener('expenseViewClose', function(e){
		expenseAdd.close();
	});
});

if(db.existingOpenExpenseReport(idUser)) {
	win.add(openExpenseReportView);
}
else {
	win.add(addNewExpenseReportBtn);
}
