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

		var barcode = localStorage.getItem('barcode');
		alert(barcode);

		$('body').on('submit', '#spl-login', function(e) {
			e.preventDefault();

			$form = $(this);
			//form = $form.serialize();
			var barcode = $('#spl-login-barcode').val();
			var pin = $('#spl-login-pin').val();
			var params = { barcode: barcode
										,pin: pin };
			

			console.log(params);

			$.ajax({ 
        url: 'http://api.spokanelibrary.org/v2/hzws/borrower'
        ,dataType: 'jsonp'
        ,data: { params: params } 
      })
      .done(function(obj) {
      	if ( obj.userID ) {
      		localStorage.setItem('barcode',barcode);
      		localStorage.setItem('pin',pin);
      	}
        console.log(obj);
      })
      .fail(function() { 
      })
      .always(function() {  
      });
		});
		
		var data = {my:'data'};

		$user = $('#spl-user');
    tmpl = Handlebars.compile( $("#spl-user-tmpl").html() );
    $user.html( tmpl({user:data}) );



	}

} // splApp()