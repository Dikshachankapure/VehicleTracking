sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"product/ZVehicleTracking/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("product.ZVehicleTracking.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src =
				"https://maps.googleapis.com/maps/api/js?key=AIzaSyBiwKdVauCbIujBMBIHTDp4BXjw1bRs5a4&libraries=geometry,places";
			
			document.head.appendChild(script);
		}
	});
});