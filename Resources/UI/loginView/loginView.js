/* Create window with input fields: username and password, button: signIn.
 On btn click send data to server which response. On success fire aplication event: grantEntrance
 and close window.*/

var win = Titanium.UI.currentWindow; 
var username = Titanium.UI.createTextField({  
    color:'#336699',  
    top:10,  
    left:10,  
    width:200,  
    height:40,  
    hintText:'Uporabniško ime',  
    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,  
    returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,  
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    font: {fontSize: '12px'}
});  
win.add(username);  
var password = Titanium.UI.createTextField({  
    color:'#336699',  
    top:60,  
    left:10,  
    width:200,  
    height:40,  
    hintText:'Geslo',  
    passwordMask:true,  
    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,  
    returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,  
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    font: {fontSize: '12px'}  
});  
win.add(password);  
var loginBtn = Titanium.UI.createButton({  
    title:'Prijava',  
    top:110,  
    width:90,  
    height:35,  
    borderRadius:1,  
    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}  
});  

var loginReq = Ti.Network.createHTTPClient();
loginReq.timeout = 7000;
loginReq.onerror = function() {
	alert('Strežnik ni dosegljiv, poskusite ponovno.');
}
loginReq.onload = function() {
	var json = this.responseText;
	var response = JSON.parse(json);
	Ti.API.info(response.IdUser);
	if(response.isLoggedin) {
		username.blur();
		password.blur();
		Ti.App.fireEvent('grantEntrance', {
			name: response.Name,
			email: response.Email,
			id: response.IdUser
		});
		win.close();
	}
	else {
		alert(response.Message);
	}
}

loginBtn.addEventListener('click', function(e) {
	if(Ti.Network.getOnline()){
		if(username.value !== '' && password.value !== '') {
			loginReq.open("POST", "http://192.168.1.3/PotniNalogi/Mobile/LogIn");
			var params = {
				username: username.value,
				password: Ti.Utils.md5HexDigest(password.value)
			};
			loginReq.send(params);
		}
		else {
			alert('Vnesite uporabniško ime/geslo.');
		}
	}
	else {
		alert('Za prijavo potrebujete podatkovno povezavo.');
	}
});

win.add(loginBtn);  