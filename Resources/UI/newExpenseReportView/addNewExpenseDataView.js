var win = Ti.UI.currentWindow;
var osname = Ti.Platform.osname;
var expenseName = Titanium.UI.createTextField({  
    color:'#336699',  
    top:10,  
    left:10,  
    width:200,  
    height:40,  
    hintText:'Ime stroška',  
    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,  
    returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,  
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    font: {fontSize: '12px'}
}); 

var expensePrice = Titanium.UI.createTextField({  
    color:'#336699',  
    top:60,  
    left:10,  
    width:200,  
    height:40,  
    hintText:'Cena stroška',  
    keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,  
    returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,  
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    font: {fontSize: '12px'}
}); 

var euroLabel = Titanium.UI.createLabel({
	top: 70,
	left: 212,
	text: '€',
	color: '#000'
});

var saveDraftLabel = Ti.UI.createLabel({
	text: 'Shrani med predloge',
	font: {fontSize: '12px'},
	top: 110,
	left: 10,
	color: '#000'
});

var saveDraftSwitch = Ti.UI.createSwitch({
	left: 150,
	top: 105,
    color: '#222',
    value: false
});

if(Ti.Platform.osname === "android") {
	saveDraftSwitch.style = Ti.UI.Android.SWITCH_STYLE_CHECKBOX;
}


var saveBtn = Ti.UI.createButton({
	title: 'Shrani',
	top: 160,
	left: 10
});

saveBtn.addEventListener('click', function(e) {
	if(expenseName.value !== '' && expensePrice.value !== '') {
		if(!isNaN(expensePrice.value)) {
			var db = require('/db');
			var userId = Ti.App.Properties.getInt('IdUser', 0);
			var idExpenseReport = db.idOpenExpenseReport(userId);
			if(idExpenseReport !== 0) {
				db.saveExpense(idExpenseReport, expenseName.value, expensePrice.value);	
				if(saveDraftSwitch.value) {
					db.saveExpenseDraft(expenseName.value, expensePrice.value, userId);
				}
				Ti.App.fireEvent('updateExpenseTable', { NameExpense: expenseName.value, ValueExpense: expensePrice.value, SaveExpenseDraft: saveDraftSwitch.value });
				Ti.App.fireEvent('addNewExpenseClose');
			
			}
			else {
				alert('Prišlo je do napake. Ponovno se vpišite.')
			}
		}
		else {
			alert('Vnesite veljavno ceno.');
		}
	}
	else {
		alert('Izpolnite ime/ceno stroška');
	}
});

var cancelBtn = Ti.UI.createButton({
	title: 'Prekliči',
	top: 160,
	left: 90
});

cancelBtn.addEventListener('click', function(e) {
	Ti.App.fireEvent('addNewExpenseClose');
});

win.add(saveDraftLabel);
win.add(saveDraftSwitch);
win.add(expenseName);
win.add(expensePrice);
win.add(euroLabel);
if(osname === 'android') {
	win.add(saveBtn);
	//win.add(cancelBtn);
}
else {
	cancelBtn.style = Ti.UI.iPhone.SystemButton.CANCEL;
	win.leftNavButton = cancelBtn;
	
	saveBtn.style = Ti.UI.iPhone.SystemButton.SAVE;
	win.rightNavButton = saveBtn;
	
}
