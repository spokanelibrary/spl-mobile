// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Global InAppBrowser reference
var iabRef = null;

function iabLoadStart(event) {
  //alert(event.type + ' - ' + event.url);
}

function iabLoadStop(event) {
  //alert(event.type + ' - ' + event.url);
}

function iabClose(event) {
 //alert(event.type);
 iabRef.removeEventListener('loadstart', iabLoadStart);
 iabRef.removeEventListener('loadstop', iabLoadStop);
 iabRef.removeEventListener('exit', iabClose);
}

// Cordova is ready
function onDeviceReady() {
	$.ajaxSetup({
     type: 'POST'
    ,dataType: 'json'
    ,dataType: 'jsonp'
    ,jsonp: 'callback'
  });

 	splApp.init();
}

// emulate device in browser
window.onload = function () {
if( !window.device )
   onDeviceReady();
}

var splApp = {

	init: function() {

		_self = this;

		//localStorage.removeItem('splAccount');
		//localStorage.removeItem('splAccounts');
		
		var splAccount = localStorage.getItem('splAccount');
		var splAccounts = localStorage.getItem('splAccounts');

		if ( null !== splAccounts ) {
			splAccounts = JSON.parse(splAccounts);
		}

		this.splAccount = splAccount;
		this.splAccounts = splAccounts;

		this.initEvents();
		this.showProfile();
			
	}, // init()

	initEvents: function() {
		$('body').on('submit', '#spl-login', function(e) {
			e.preventDefault();

			$form = $(this);
			//form = $form.serialize();
			var barcode = $('#spl-login-barcode').val();
			var pin = $('#spl-login-pin').val();
			var params = { barcode: barcode
										,pin: pin };
			
			_self.addAccount(params);
		
		});

		$('body').on('click', '.spl-choose-account', function(e) {
			e.preventDefault();

			var id = $(this).data('spl-account');
			_self.splAccount = id;

			_self.saveAccounts();
			_self.showProfile();
		
		});

		$('body').on('click', '.spl-remove-account', function(e) {
			e.preventDefault();

			var id = $(this).data('spl-account');
			_self.splAccount = null;
			delete _self.splAccounts[id];

			_self.saveAccounts();
			_self.showProfile();
		
		});

		$('body').on('click', '.prevent-default', function(e) {
			e.preventDefault();
		});

	}, // initEvents

	showProfile: function() {

		//console.log(this.splAccount);
		//console.log(this.splAccounts);

		var accounts = this.splAccounts;
		if ( null !== this.splAccount ) {
			var account = this.splAccounts[this.splAccount];
		}

		var indexed = [];
		for ( x in accounts ) {
			indexed.push(accounts[x]);	
		}

		$user = $('#spl-user');
    tmpl = Handlebars.compile( $("#spl-user-tmpl").html() );
    $user.html( tmpl({ account: account, accounts:indexed }) );

	}, // showProfile
	
	addAccount: function(params) {

		$.ajax({ 
      url: 'http://api.spokanelibrary.org/v2/hzws/borrower'
      ,dataType: 'jsonp'
      ,data: { params: params } 
    })
    .done(function(obj) {
    	if ( obj.userID ) {
    		
				if ( null === _self.splAccounts ) {
    			_self.splAccounts = {};
    		}
	      _self.splAccounts[obj.userID] = { barcode:params.barcode
	      																, pin:params.pin
	      																, id: obj.userID
	      																, name:obj.accountInfo.name
	      																, first:obj.horizonInfo.first_name };
	      _self.splAccount = obj.userID;

	      _self.saveAccounts();
	  		_self.showProfile();
    	}
    })
    .fail(function() { 
    })
    .always(function() {  
    });

	}, // addAccount

	saveAccounts: function() {

		localStorage.setItem('splAccounts',JSON.stringify(_self.splAccounts));
	  localStorage.setItem('splAccount',_self.splAccount);

	} // saveAccounts

} // splApp()