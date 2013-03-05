var win = Ti.UI.currentWindow;
var osname = Ti.Platform.osname;
var expenseView = Ti.UI.createView({
	layout: 'vertical'
});

// table footer and header view
var createHeadings = function(title, sum) {
	var view = Ti.UI.createTableViewRow({
		backgroundColor: '#222',
	});
	
	var text = Ti.UI.createLabel({
		text: title,
		left: 20,
		color: '#fff'
	});
	
	view.add(text);
	
	if(sum) {
		var sumText = Ti.UI.createLabel({
			text: '',
			right: 40,
			color: '#fff'
		});
		view.add(sumText);
	}
	
	
	return view;
};

var createTableViewRow = function(nameExpense, valueExpense, savedExpense) {
	var row = Ti.UI.createTableViewRow();
	var nameLabel = Ti.UI.createLabel({
		left: 10,
		text: nameExpense,
		width: '50%',
		color: '#000'
	});
	var priceLabel = Ti.UI.createLabel({
		text: valueExpense+ ' €',
		value: valueExpense,
		right: 90,
		color: '#000'
	});
	
	var btn = Ti.UI.createButton({
		title: savedExpense === true ? '+' : '-',
		right: 10
	});
	
	row.add(nameLabel);
	row.add(priceLabel);
	row.add(btn);
	if(!savedExpense) {
		row.DeleteButton = btn;
	}
	else {
		row.AddButton = btn;
	}
 	
	return row;
}

// create table rows
var createRows = function(dataArray, savedExpense) {
	var resultArray = new Array();
	if(dataArray !== null) {
		for(var i=0, j=dataArray.length; i<j; i++ ) {
			var row = createTableViewRow(dataArray[i].NameExpense, dataArray[i].ValueExpense, savedExpense);
			resultArray.push(row);
		}
	}
	return resultArray;
};


var db = require('/db');
var userId = Ti.App.Properties.getInt('IdUser', 0);
var idExpenseReport = db.idOpenExpenseReport(userId);
var dataTable = db.getExpenseListByIdExpenseReport(idExpenseReport);
 
// tabela s stroski
var expenseTable = Ti.UI.createTableViewSection();
expenseTable.add(createHeadings('Stroški', true));

var temp = createRows(dataTable, false);
for(var i = 0, j = temp.length; i<j; i++) {
	expenseTable.add(temp[i]);
}

// calculate price sum
var setExpenseTableSum = function() {
	var result = 0;
	for(var i = 1, j = expenseTable.rowCount; i<j; i++) {
		result += Number(expenseTable.rows[i].children[1].value);
	}
	expenseTable.rows[0].children[1].text = result+' €';
};

var savedExpenseHeading = createHeadings('Predloge stroškev');

// tabela s predlogami stroskev
var savedExpenseTable = Ti.UI.createTableViewSection();
savedExpenseTable.add(createHeadings('Predloge stroškev', false));


var savedExpenseData = db.getExpenseTypeListByIdProfile(userId);
var savedExpenseFormatData = createRows(savedExpenseData, true);
for(var i = 0, j = savedExpenseFormatData.length; i<j; i++) {
	savedExpenseTable.add(savedExpenseFormatData[i]);
}

// setup price sum view
setExpenseTableSum();

// table view
var tableView = Ti.UI.createTableView();
var data = [];
data[0] = expenseTable;
data[1] = savedExpenseTable;

tableView.data = data;

tableView.addEventListener('click', function(e) {
	if(e.source === e.row.DeleteButton) {
		//delele from db (id, name, price)
		db.deleteExpense(idExpenseReport, e.row.children[0].text, e.row.children[1].value);
		expenseTable.remove(e.row);
		setExpenseTableSum();
		tableView.data = data;	
	}
	else if(e.source === e.row.AddButton) {
		db.saveExpense(idExpenseReport, e.row.children[0].text, e.row.children[1].value);
		var row = createTableViewRow(e.row.children[0].text, e.row.children[1].value, false);
		expenseTable.add(row);
		setExpenseTableSum();
		tableView.data = data;		
	}
});

var cancelBtn = Ti.UI.createButton({
	title: 'Nazaj',
	style: Ti.UI.iPhone.SystemButton.CANCEL
});

cancelBtn.addEventListener('click', function(e) {
	Ti.App.fireEvent('expenseViewClose');
});

var addNewExpenseBtn = Ti.UI.createButton({
	title: 'Dodaj'
});

if(osname === 'android') {
	var activity = Ti.Android.currentActivity;
	activity.onCreateOptionsMenu = function(e) {
		var menu = e.menu;
		var menuItem = menu.add({ title: 'Dodaj strošek' });
		menuItem.addEventListener('click', function(e) {
			var addNewExpenseModule = require('/UI/newExpenseReportView/addNewExpenseTabGroup');
			var tabGroup = addNewExpenseModule.addNewExpenseTabGroup();
			tabGroup.open();
			Ti.App.addEventListener('addNewExpenseClose', function() {
				tabGroup.close();
			});
	
		});
	};
}
else {
	win.leftNavButton = cancelBtn;
	addNewExpenseBtn.style = Ti.UI.iPhone.SystemButton.ADD;
	win.rightNavButton = addNewExpenseBtn;
}

addNewExpenseBtn.addEventListener('click', function(){
	var addNewExpenseModule = require('/UI/newExpenseReportView/addNewExpenseTabGroup');
	var tabGroup = addNewExpenseModule.addNewExpenseTabGroup();
	tabGroup.open();
	Ti.App.addEventListener('addNewExpenseClose', function() {
		tabGroup.close();
	});
});

Ti.App.addEventListener('updateExpenseTable', function(evt) {
	var row = createTableViewRow(evt.NameExpense, evt.ValueExpense, false);
	expenseTable.add(row);
	if(evt.SaveExpenseDraft) {
		var row2 = createTableViewRow(evt.NameExpense, evt.ValueExpense, true);
		savedExpenseTable.add(row2);
	}
	setExpenseTableSum();
	tableView.data = data;
});

expenseView.add(tableView);
win.add(expenseView);

