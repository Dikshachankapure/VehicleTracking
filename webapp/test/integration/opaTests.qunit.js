/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"product/ZVehicleTracking/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});