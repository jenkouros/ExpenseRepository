var timePickerWindow = function() {
	var win = Ti.UI.createWindow({
		backgroundColor: 'transparent'
	});
	
	var timeView = Ti.UI.createView({
		backgroundColor: '#000',
		bottom: 0,
		left: 0,
		height: Ti.UI.SIZE,
		layout: 'vertical',
	});
	
	var timeValue = new Date();
	var timePicker = Titanium.UI.createPicker({
		top: 0,
		width: Ti.UI.FILL,
		//left: 10,
		type: Ti.UI.PICKER_TYPE_TIME,
		changedValue: timeValue,
		value: timeValue
		
	});
	
	if(Ti.Platform.osname === 'android') {
		timePicker.format24 = true;
	}
	
	timePicker.addEventListener('change', function(e) {
		timePicker.changedValue = e.value;
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
		var rawDate = timePicker.changedValue;
		var hour = rawDate.getHours();
		if(String(hour).length === 1) {
			hour = '0'+hour;
		}
		var minute = rawDate.getMinutes();
		if(String(minute).length === 1) {
			minute = '0'+minute;
		}
		var timeValue = hour+':'+minute;
		Ti.App.fireEvent('addressTimePickerSave', { timeValue: timeValue });
		win.close();
	});
	
	var cancel = Ti.UI.createButton({
		title: 'Prekliči',
		right: 100
	});
	
	cancel.addEventListener('click', function(){
		win.close();
	});
	

	timeView.add(timePicker);
	toolbarView.add(saveDateBtn);
	toolbarView.add(cancel);
	timeView.add(toolbarView);
	win.add(timeView);
	
	win.open();
};

exports.timePickerWindow = timePickerWindow;
