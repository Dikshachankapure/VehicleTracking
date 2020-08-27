sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.Dashboard", {
		onInit: function () {
			var that = this;
			that._loadDashboard();
		},

		_loadDashboard: function (oEvent) {
			var oModelLocation = this.getOwnerComponent().getModel("LocationSet");
			var oModelVehicle = this.getOwnerComponent().getModel("VehicleSet");
			var oModelDriver = this.getOwnerComponent().getModel("DriverSet");
			var oModelTrip = this.getOwnerComponent().getModel("TripSet");

			var countLocations = this.getView().byId("countLocations");
			countLocations.setValue(oModelLocation.getData().Locations.length);

			var countVehicles = this.getView().byId("countVehicles");
			countVehicles.setValue(oModelVehicle.getData().Vehicles.length);

			var countDrivers = this.getView().byId("countDrivers");
			countDrivers.setValue(oModelDriver.getData().Drivers.length);
		
			/*var countTrips = this.getView().byId("countTrips");
			countTrips.setValue(oModelTrip.getData().Trips.length);*/

			this.getView().setModel(oModelTrip);

			var Status1 = "ONGOING";
			var Status2 = "UPCOMING";
			var Status3 = "CANCELLED";
			var Status4 = "COMPLETED";
			if (Status1 && Status1.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Status1);
				var obinding1 = this.getView().byId("tblOngoingTrips").getBinding("items");
				obinding1.filter(oFilter1);
			}
			if (Status2 && Status2.length > 0) {
				var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Status2);
				var obinding2 = this.getView().byId("tblUpcomingTrips").getBinding("items");
				obinding2.filter(oFilter2);
			}
			if (Status3 && Status3.length > 0) {
				var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Status3);
				var obinding3 = this.getView().byId("tblCancelledTrips").getBinding("items");
				obinding3.filter(oFilter3);
			}
			if (Status4 && Status4.length > 0) {
				var oFilter4 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Status4);
				var obinding4 = this.getView().byId("tblCompletedTrips").getBinding("items");
				obinding4.filter(oFilter4);
			}

		},

		_onPressMenu: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (oEvent.getSource().getText() === "Dashboard") {
				oRouter.navTo("Dashboard");
			} else if (oEvent.getSource().getText() === "Location Manager") {
				oRouter.navTo("LocationManager");
			} else if (oEvent.getSource().getText() === "Vehicle Manager") {
				oRouter.navTo("VehicleMaster");
			} else if (oEvent.getSource().getText() === "Driver Manager") {
				oRouter.navTo("DriverManager");
			} else if (oEvent.getSource().getText() === "Trip Manager") {
				oRouter.navTo("TripManager");
			} else if (oEvent.getSource().getText() === "Track Vehicle") {
				oRouter.navTo("TrackVehicle");
			}
		},

		_onPressTiles: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (oEvent.getSource().getHeader() === "Locations") {
				oRouter.navTo("LocationManager");
			} else if (oEvent.getSource().getHeader() === "Vehicles") {
				oRouter.navTo("VehicleMaster");
			} else if (oEvent.getSource().getHeader() === "Drivers") {
				oRouter.navTo("DriverManager");
			} else if (oEvent.getSource().getHeader() === "Trips") {
				oRouter.navTo("TripManager");
			}
		},

		_onEditTrip: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var objTrip = oEvent.getSource().getBindingContext().getObject();
			
			oRouter.navTo("EditTrip", {
				TripId: objTrip.TripId
			});

		}

	});
});