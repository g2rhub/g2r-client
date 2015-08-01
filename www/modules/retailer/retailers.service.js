angular.module("starter.services")
.factory("RetailersService", function() {
	var Retailers = [];
	var selectedRetailer = null;
	var setRetailers = function(retailers) {
		Retailers = retailers;
		if(Retailers[0]) {
			selectedRetailer = Retailers[0];
		}
	};

	var getRetailers = function() {
		return Retailers;
	};

	var setSelectedRetailer = function(retailer) {
		selectedRetailer = retailer;
	};

	var getSelectedRetailer = function() {
		return selectedRetailer;
	};

	return {
		setRetailers : setRetailers,
		getRetailers : getRetailers,
		setSelectedRetailer : setSelectedRetailer,
		getSelectedRetailer : getSelectedRetailer
	}
})