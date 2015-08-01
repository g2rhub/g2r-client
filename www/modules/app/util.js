var randomString = function() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 16;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
}

var validateEmail = function(email) { 
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
} 

var prep_data = function(dict) {
  dict["sessionid"] = window.localStorage.getItem("sessionid");
  return dict;
}

var getPlatform = function() {
  try {
    return device.platform;
  } catch(e) {
    return "";
  }
}

var openUrl = function(url) {
  if( navigator.app ) {
    navigator.app.loadUrl(url, {openExternal:true});
  } else {
    window.open(url, "_system");
  }
}