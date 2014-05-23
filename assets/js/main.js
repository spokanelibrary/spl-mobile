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
 	splApp.init();
}

// emulate device in browser
window.onload = function () {
if( !window.device )
   onDeviceReady();
}

var splApp = {

	init: function() {
		$('body').on('submit', '#spl-login', function(e) {
			e.preventDefault();

			alert('ok');
		});
		
		var data = {my:'data'};

		$user = $('#spl-user');
    tmpl = Handlebars.compile( $("#spl-user-tmpl").html() );
    $user.html( tmpl({user:data}) );



	}

} // splApp()