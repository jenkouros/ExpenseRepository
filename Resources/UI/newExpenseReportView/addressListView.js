var win = Ti.UI.currentWindow;
var osname = Ti.Platform.osname;
var userId = Ti.App.Properties.getInt('IdUser', 0);
var addressView = Ti.UI.createView({
	layout: 'vertical'
});

// table footer and header view
var createHeadings = function(title) {
	var view = Ti.UI.createTableViewRow({
		backgroundColor: '#222',
	});
	
	var text = Ti.UI.createLabel({
		text: title,
		left: 20,
		color: '#fff'
	});
	
	view.add(text);
	
	return view;
};

var createTableViewRow = function(valueAddress, DateTimeAddress, savedAddress) {
	var row = Ti.UI.createTableViewRow();
	//naslov
	var addressLabel = Ti.UI.createLabel({
		left: 10,
		text: valueAddress,
		width: !savedAddress ? '50%' : '70%',
		color: "#000"
	});
	row.add(addressLabel);
	
	if(!savedAddress) {
		var dateTime = DateTimeAddress.split(" ");
		var date = dateTime[0].split("-");
		var time = dateTime[1].split(":");
		
		var day = date[2];
		var month = date[1];
		var year = date[0];
		
		var minutes = time[1];
		if(String(minutes).length === 1) {
			minutes = '0'+minutes;
		}
		var hours = time[0];
		
		// datum
		var dateLabel = Ti.UI.createLabel({
			text: day+"."+month+"."+year+" "+hours+":"+minutes,
			right: 50,
			width: 90,
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			dbValue: DateTimeAddress,
			color: "#000"
		});
		row.add(dateLabel);
	}
	
	var btn = Ti.UI.createButton({
		title: savedAddress === true ? '+' : '-',
		//backgroundImage: '/UI/images/plus.png',
		right: 10
	});

	row.add(btn);
	if(!savedAddress) {
		row.DeleteButton = btn;
	}
	else {
		row.AddButton = btn;
	}
 	
	return row;
}

// create table rows
var createRows = function(dataArray, savedAddress) {
	var resultArray = new Array();
	if(dataArray !== null) {
		for(var i=0, j=dataArray.length; i<j; i++ ) {
			var row = createTableViewRow(dataArray[i].ValueAddress, dataArray[i].DateTimeAddress, savedAddress);
			resultArray.push(row);
		}
	}
	return resultArray;
};
var initPathTableView = function() {
	var rows = pathTable.getRows();
	if(rows) {
		for(var i=rows.length-1; i>=0; i--) {
			pathTable.remove(rows[i]);
		}
	}

	pathTable.add(createHeadings('Pot'));
	var dataTable = db.getAddressListByIdExpenseReport(idExpenseReport);
	var temp = createRows(dataTable, false);
	for(var i = 0, j = temp.length; i<j; i++) {
		pathTable.add(temp[i]);
	}
};

var initSavedPathTableView = function() {
	var rows = savedPathTable.getRows();
	if(rows) {
		for(var i=rows.length-1; i>=0; i--) {
			savedPathTable.remove(rows[i]);
		}
	}
	savedPathTable.add(createHeadings('Predlogi lokacij'));
	var savedExpenseData = db.getAddressTypeListByIdProfile(userId);
	var savedExpenseFormatData = createRows(savedExpenseData, true);
	for(var i = 0, j = savedExpenseFormatData.length; i<j; i++) {
		savedPathTable.add(savedExpenseFormatData[i]);
	}
};

var initTableView = function() {
	var data = [];
	data[0] = pathTable;
	data[1] = savedPathTable;

	tableView.data = data;	
}

var db = require('/db');

var idExpenseReport = db.idOpenExpenseReport(userId);
 
// tabela POT
var pathTable = Ti.UI.createTableViewSection();
initPathTableView();

// tabela predlogi lokacij
var savedPathTable = Ti.UI.createTableViewSection();
initSavedPathTableView();

// table view
var tableView = Ti.UI.createTableView();
initTableView();



tableView.addEventListener('click', function(e) {
	if(e.source === e.row.DeleteButton) {
		//delele from db (id, name, price)
		db.deleteAddress(idExpenseReport, e.row.children[0].text, e.row.children[1].dbValue);
		pathTable.remove(e.row);
		initPathTableView();
		initTableView();
	}
	else if(e.source === e.row.AddButton) {
		var addNewAddressModule = require('/UI/newExpenseReportView/addressDataTabGroup');
		var tabGroup = addNewAddressModule.addressAddTabGroup(e.row.children[0].text);
		tabGroup.open();
		Ti.App.addEventListener('addNewAddressClose', function() {
			tabGroup.close();
		});		
	}
});

var cancelBtn = Ti.UI.createButton({
	title: 'Nazaj',
	style: Ti.UI.iPhone.SystemButton.CANCEL
});

cancelBtn.addEventListener('click', function(e) {
	Ti.App.fireEvent('addressViewClose');
});

var addNewAddressBtn = Ti.UI.createButton({
	title: 'Dodaj'
});

if(osname === 'android') {
	var activity = Ti.Android.currentActivity;
	activity.onCreateOptionsMenu = function(e) {
		var menu = e.menu;
		var menuItem = menu.add({ title: 'Dodaj lokacijo' });
		menuItem.addEventListener('click', function(e) {
			var addNewAddressModule = require('/UI/newExpenseReportView/addressDataTabGroup');
			var tabGroup = addNewAddressModule.addressAddTabGroup();
			tabGroup.open();
			Ti.App.addEventListener('addNewAddressClose', function() {
				tabGroup.close();
			});	
		});
	};
}
else {
	win.leftNavButton = cancelBtn;
	addNewAddressBtn.style = Ti.UI.iPhone.SystemButton.ADD;
	win.rightNavButton = addNewAddressBtn;
}

addNewAddressBtn.addEventListener('click', function(){
	var addNewAddressModule = require('/UI/newExpenseReportView/addressDataTabGroup');
	var tabGroup = addNewAddressModule.addressAddTabGroup();
	tabGroup.open();
	Ti.App.addEventListener('addNewAddressClose', function() {
		tabGroup.close();
	});
});

Ti.App.addEventListener('updateAddressTable', function(evt) {
	initPathTableView();
	initSavedPathTableView();
	initTableView();
});

addressView.add(tableView);
win.add(addressView);

