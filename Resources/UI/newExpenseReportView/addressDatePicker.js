var datePickerWindow = function() {
	var win = Ti.UI.createWindow({
		backgroundColor: 'transparent'
	});
	
	var dateView = Ti.UI.createView({
		backgroundColor: '#000',
		bottom: 0,
		left: 0,
		height: Ti.UI.SIZE,
		layout: 'vertical',
	});
	
	var dateValue = new Date();
	var datePicker = Titanium.UI.createPicker({
		top: 0,
		width: Ti.UI.FILL,
		type: Ti.UI.PICKER_TYPE_DATE,
		value: dateValue,
		changedValue: dateValue
	});
	
	
	datePicker.addEventListener('change', function(e) {
		datePicker.changedValue = e.value;
	});
	
	var toolbarView = Ti.UI.createView({
		top: 10,
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		backgroundColor: 'transparent'
	});
	
	var saveDateBtn = Ti.UI.createButton({
		title: 'Shrani',
		right: 10
	});
	
	saveDateBtn.addEventListener('click', function(e) {
		var rawDate = datePicker.changedValue;
		var day = rawDate.getDate();
		if(String(day).length === 1) {
			day = '0'+day;
		}
		var month = rawDate.getMonth() + 1;
		if(String(month).length === 1) {
			month = '0'+month;
		}
		var year = rawDate.getFullYear();
		var dateValue = day+'.'+month+'.'+year;
		var dateValueDB = year+"-"+month+"-"+day;
		Ti.App.fireEvent('addressDatePickerSave', { dateValue: dateValue, dateValueDB: dateValueDB });
		win.close();
	});
	
	var cancel = Ti.UI.createButton({
		title: 'Prekliči',
		right: 100
	});
	
	cancel.addEventListener('click', function() {
		win.close();
	});
	
	dateView.add(datePicker);
	toolbarView.add(saveDateBtn);
	toolbarView.add(cancel);
	dateView.add(toolbarView);
	win.add(dateView);
	
	win.open();
};

exports.datePickerWindow = datePickerWindow;