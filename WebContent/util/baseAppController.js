jQuery.sap.declare("util.baseAppController");

jQuery.sap.require("util.AppConfig");
jQuery.sap.require("util.NavigationHandler");

(function($) {
	var instance = null;
	
	util.baseAppController = function(sName, oControllerConfig) {
		if (instance) {
			if (sName || oControllerConfig) {
				jQuery.sap.log
						.error("base appController should only be configured once!");
			}
			return instance;
		}

		// ???????? Navigation Handler?? ?????Ñ´?.
		jQuery.extend(true, oControllerConfig, {
			configureApplication : function(oApp, oAppConfig) {
				// initialize global Navigation Handling
				 
				this.navHandler = new util.NavigationHandler(oApp,
						new util.AppConfig(oAppConfig)).subscribe();
			}
		});
		instance = sap.ui.controller(sName, oControllerConfig);
	};
}(jQuery));