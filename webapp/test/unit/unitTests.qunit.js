/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"product/ZVehicleTracking/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});