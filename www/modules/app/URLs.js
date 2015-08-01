var API_BASE  = "https://g2r-server-master.herokuapp.com/api/v1";//"http://127.0.0.1:8000/api/v1";//https://g2r-server-master.herokuapp.com/api/v1";//"http://127.0.0.1:8001/api/v1";////"http://127.0.0.1:8000/api/v1";//;//"http://127.0.0.1:8000/api/v1" //https://g2r-server-master.herokuapp.com/api/v1";//"http://quiet-ocean-3853.herokuapp.com/api/v1"////"https://fierce-everglades-3021.herokuapp.com/api/v1"; //"http://0.0.0.0:5000/api/v1"
angular.module("starter.services")
.value('URLs', {
		login : API_BASE + "/login/",
		register : API_BASE + "/user/new/",
		generateOTP : API_BASE + "/otp/otp_request",
		userData : API_BASE + "/user",
		resetPassword : API_BASE + "resetpassword",
		addcard : API_BASE + '/card/add_cards/',
		updateUser : API_BASE + '/user',
		verifyEmail : API_BASE + '/user/verifyemail',
		verifyMobile : API_BASE + '/user/verifymobile',
		offers : function(lat, lng, username, apikey) {
			return API_BASE + '/offers/?lat='+lat+'&lng='+lng+'&username='+username+'&api_key='+apikey;
		},
		GPLogin : function(accessToken) {
			return "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+accessToken;
		}
});