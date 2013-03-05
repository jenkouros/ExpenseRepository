//IdUser - properties

var platformName = Ti.Platform.osname;
var isIOS = (platformName === 'iphone' || platformName === 'ipad') ? true : false;	
var isOnline = Ti.Network.getOnline();

var openConn = function() {
	var conn = Ti.Database.open('potninalogi');
	if(isIOS){
		conn.file.setRemoteBackup(false);
	}
	return conn;
};
	
var closeConn = function(conn) {
	conn.close();
};

var lastInsertedRowId = function(conn) {
	var id = conn.execute('SELECT last_insert_rowid() AS \'id\';').fieldByName('id');
	return id;
};
		
var existingOpenExpenseReport = function(idUser) {
	var conn = openConn();
	var result = false;
	var openExpenseReport = conn.execute('SELECT * FROM ExpenseReport WHERE IsFinishedExpenseReport = 0 AND IdProfile = ?;', idUser);
	if(openExpenseReport.rowCount == 1) {
		result = true;
	}
	else if(openExpenseReport.rowCount > 1) {
		conn.execute('UPDATE ExpenseReport SET IsFinishedExpenseReport = 1 WHERE IsFinishedExpenseReport = 0');
	}
	openExpenseReport.close();
	closeConn(conn);
	return result;
};

var addNewExpenseReport = function(idUser) {
	var conn = openConn();
	conn.execute('INSERT INTO ExpenseReport (IsFinishedExpenseReport, IdProfile) VALUES (?,?);', 0, idUser);
	closeConn(conn);
};

var endExpenseReport = function(idUser) {
	var conn = openConn();
	conn.execute('UPDATE ExpenseReport SET IsFinishedExpenseReport = 1 WHERE IsFinishedExpenseReport = 0 AND IdProfile = ?;', idUser);
	closeConn(conn);
};

var idOpenExpenseReport = function(idUser) {
	var conn = openConn();
	var result = 0;
	var id = conn.execute('SELECT IdExpenseReport FROM ExpenseReport WHERE IdProfile = ? AND IsFinishedExpenseReport = 0;', idUser);
	if(id.rowCount > 0) {
		result = id.fieldByName('IdExpenseReport');
	}
	id.close();
	closeConn(conn);
	return result;
};

var saveAddress = function(IdExpenseReport, DateTime, Address) {
	var conn = openConn();
	conn.execute('INSERT INTO Address (IdExpenseReport, DateTimeAddress, AddressValue) VALUES (?,?,?);', IdExpenseReport, DateTime, Address);
	closeConn(conn);
};

var saveAddressType = function(IdProfile, Address) {
	var conn = openConn();
	conn.execute('INSERT INTO AddressType (IdProfile, ValueAddressType) VALUES (?,?);', IdProfile, Address);
	closeConn(conn);
};


var saveExpense = function(IdExpenseReport, NameExpense, ValueExpense) {
	var conn = openConn();
	conn.execute('INSERT INTO Expense (IdExpenseReport, NameExpense, ValueExpense) VALUES (?,?,?);', IdExpenseReport, NameExpense, ValueExpense);
	closeConn(conn);
};

var saveExpenseDraft = function(NameExpense, ValueExpense, IdProfile) {
	var conn = openConn();
	conn.execute('INSERT INTO ExpenseType (NameExpenseType, ValueExpenseType, IdProfile) VALUES (?,?,?);', NameExpense, ValueExpense, IdProfile);
	closeConn(conn);
};

var Expense = function(NameExpense, ValueExpense) {
	this.NameExpense = NameExpense;
	this.ValueExpense = ValueExpense;
};

var getExpenseListByIdExpenseReport = function(IdExpenseReport) {
	var conn = openConn();
	var expenses = conn.execute('SELECT * FROM Expense WHERE IdExpenseReport = ?;', IdExpenseReport);
	var result = new Array();
	while(expenses.isValidRow()) {
		var name = expenses.fieldByName('NameExpense');
		var price = expenses.fieldByName('ValueExpense');
		result.push(new Expense(name, price));
		expenses.next();
	}
	expenses.close();
	closeConn(conn);
	return result;
};

var getExpenseTypeListByIdProfile = function(IdProfile) {
	var conn = openConn();
	var expenses = conn.execute('SELECT * FROM ExpenseType WHERE IdProfile = ?;', IdProfile);
	var result = new Array();
	while(expenses.isValidRow()) {
		var name = expenses.fieldByName('NameExpenseType');
		var price = expenses.fieldByName('ValueExpenseType');
		result.push(new Expense(name, price));
		expenses.next();
	}
	expenses.close();
	closeConn(conn);
	return result;
};

var deleteExpense = function(IdExpenseReport, NameExpense, ValueExpense){
	var conn = openConn();
	var selectId = conn.execute('SELECT IdExpense FROM Expense WHERE IdExpenseReport = ? AND NameExpense = ? AND ValueExpense = ?;', IdExpenseReport, NameExpense, ValueExpense);
	if(selectId.isValidRow()) {
		var id = selectId.fieldByName('IdExpense');
		conn.execute('DELETE FROM Expense WHERE IdExpense = ?;', id);
	}
	selectId.close();
	closeConn(conn);
};

var Address = function(ValueAddress, DateTimeAddress) {
	this.ValueAddress = ValueAddress;
	this.DateTimeAddress = DateTimeAddress;
};

var getAddressListByIdExpenseReport = function(IdExpenseReport) {
	var conn = openConn();
	var addresses = conn.execute('SELECT * FROM Address WHERE IdExpenseReport = ? ORDER BY DateTimeAddress;', IdExpenseReport);
	var result = new Array();
	while(addresses.isValidRow()) {
		var valueAddress = addresses.fieldByName('AddressValue');
		var DateTimeAddress = addresses.fieldByName('DateTimeAddress');
		result.push(new Address(valueAddress, DateTimeAddress));
		addresses.next();
	}
	addresses.close();
	closeConn(conn);
	return result;
};


var getAddressTypeListByIdProfile = function(IdProfile) {
	var conn = openConn();
	var addresses = conn.execute('SELECT * FROM AddressType WHERE IdProfile = ?;', IdProfile);
	var result = new Array();
	while(addresses.isValidRow()) {
		var valueAddress = addresses.fieldByName('ValueAddressType');
		result.push(new Address(valueAddress, ''));
		addresses.next();
	}
	addresses.close();
	closeConn(conn);
	return result;
};

var deleteAddress = function(IdExpenseReport, ValueAddress, DateTimeAddress) {
	var conn = openConn();
	var selectId = conn.execute('SELECT IdAddress FROM Address WHERE IdExpenseReport = ? AND AddressValue = ? AND DateTimeAddress = ?;', IdExpenseReport, ValueAddress, DateTimeAddress);
	if(selectId.isValidRow()) {
		var id = selectId.fieldByName('IdAddress');
		conn.execute('DELETE FROM Address WHERE IdAddress = ?;', id);
	}
	selectId.close();
	closeConn(conn);
}

exports.existingOpenExpenseReport = existingOpenExpenseReport;
exports.addNewExpenseReport = addNewExpenseReport;
exports.endExpenseReport = endExpenseReport;
exports.idOpenExpenseReport = idOpenExpenseReport;
exports.saveAddress = saveAddress;
exports.saveAddressDraft = saveAddressType;
exports.saveExpense = saveExpense;
exports.saveExpenseDraft = saveExpenseDraft;
exports.getExpenseListByIdExpenseReport = getExpenseListByIdExpenseReport;
exports.getExpenseTypeListByIdProfile = getExpenseTypeListByIdProfile;
exports.deleteExpense = deleteExpense;
exports.getAddressListByIdExpenseReport = getAddressListByIdExpenseReport;
exports.getAddressTypeListByIdProfile = getAddressTypeListByIdProfile;
exports.deleteAddress = deleteAddress;
