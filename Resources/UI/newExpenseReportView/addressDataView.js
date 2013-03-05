var win = Ti.UI.currentWindow;
//var win = Ti.UI.createWindow();

var winView = Ti.UI.createScrollView();
var osname = Ti.Platform.osname;

if(!win.locationAddress) {
	var address = Titanium.UI.createTextField({  
	    color:'#336699',  
	    top:10,  
	    left:10,  
	    width:200,  
	    height:40,  
	    hintText:'Naslov',  
	    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,  
	    returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,  
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	    font: {fontSize: '12px'}
	});  
}
else {
	var address = Ti.UI.createLabel({
		text: win.locationAddress,
		color:'#336699',  
	    top:10,  
	    left:10,  
	    width:200,  
	    height:40, 
	    font: {fontSize: '12px'}
	});
}


var dateField = Titanium.UI.createTextField({  
    color:'#336699',  
    top:60,  
    left:10,  
    width:200,  
    height:40,  
    hintText:'Datum',  
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    font: {fontSize: '12px'},
    dbValue: ''
});


var datePickerWindow = require('/UI/newExpenseReportView/addressDatePicker');
dateField.addEventListener('focus', function(e) {
	dateField.focus();
	// OPEN WINDOW date
	datePickerWindow.datePickerWindow();
	Ti.App.addEventListener('addressDatePickerSave', function(e){
		dateField.value = e.dateValue;
		dateField.dbValue = e.dateValueDB;
	});
});

var timeField = Titanium.UI.createTextField({  
    color:'#336699',  
    top:110,  
    left:10,  
    width:200,  
    height:40,  
    hintText:'Čas',  
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    font: {fontSize: '12px'},
});

var timePickerWindow = require('/UI/newExpenseReportView/addressTimePicker');
timeField.addEventListener('focus', function(e) {
	//open time picker window
	timePickerWindow.timePickerWindow();
	Ti.App.addEventListener('addressTimePickerSave', function(e){
		timeField.value = e.timeValue;
	});
});

if(osname === "android") {
	if(!win.locationAddress) {
		address.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
	}
	address.addEventListener('click', function(e) {
		address.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		address.focus();
	});
	address.addEventListener('blur', function(e) {
		address.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
	});
	
	dateField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
	timeField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
}

var saveDraftLabel = Ti.UI.createLabel({
	text: 'Shrani med predloge',
	font: {fontSize: '12px'},
	top: 160,
	left: 10,
	color: '#000'
});

var saveDraftSwitch = Ti.UI.createSwitch({
	left: 150,
	top: 155,
    color: '#222',
    value: false
});

if(osname === "android") {
	saveDraftSwitch.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
}

var saveBtn = Ti.UI.createButton({
	top: 190,
	left: 10,
	title: 'Shrani'
});

saveBtn.addEventListener('click', function(e) {
	if(address.value !== '' && dateField.dbValue !== '' && timeField.value) {
		var db = require('/db');
		var IdUser = Ti.App.Properties.getInt('IdUser', 0);
		var idExpenseReport = db.idOpenExpenseReport(IdUser);
		if(idExpenseReport !== 0) {
			var dateTime = dateField.dbValue+' '+timeField.value;
			var addressValue = !win.locationAddress ? address.value : win.locationAddress;
			db.saveAddress(idExpenseReport, dateTime, addressValue);
			if(saveDraftSwitch.value) {
				db.saveAddressDraft(IdUser, address.value);
			}
			Ti.App.fireEvent('updateAddressTable');
			Ti.App.fireEvent('addNewAddressClose');	
		}
		else {
			alert('Prišlo je do napake. Ponovno se vpišite.')
		}
	}	
	else {
		alert('Vpišite naslov/datum/uro.');
	}
});

var cancelBtn = Ti.UI.createButton({
	top: 160,
	left: 90,
	title: 'Prekliči'
});

cancelBtn.addEventListener('click', function(e) {
	Ti.App.fireEvent('addNewAddressClose');
});


winView.add(address);
winView.add(dateField);
winView.add(timeField);
if ( !win.locationAddress ) {
	winView.add(saveDraftLabel);
	winView.add(saveDraftSwitch);	
}

if(osname === 'android') {
	winView.add(saveBtn);
}
else {
	cancelBtn.style = Ti.UI.iPhone.SystemButton.CANCEL;
	win.leftNavButton = cancelBtn;
	
	saveBtn.style = Ti.UI.iPhone.SystemButton.SAVE;
	win.rightNavButton = saveBtn;
}

win.add(winView);
