sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast'
], function (Controller, MessageBox, History, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.AddLocation", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf product.ZVehicleTracking.view.AddLocation
		 */
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("EditLocation").attachPatternMatched(this._onEditMatched, this);
		},

		_onEditMatched: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oModelLocation = this.getOwnerComponent().getModel("LocationSet");
			this.getView().setModel(oModelLocation);
			var oModel = this.getView().getModel();

			var txtLocationId = this.getView().byId("txtLocationId");
			var txtLocationName = this.getView().byId("txtLocationName");
			var txtLatitude = this.getView().byId("txtLatitude");
			var txtLongitude = this.getView().byId("txtLongitude");
			if (oParameters.arguments.LocationId !== "" || oParameters.arguments.LocationId !== null) {
				this.LocationId = oParameters.arguments.LocationId;
				if (oModel.getData().Locations.length > 0) {
					for (var i = 0; i < oModel.getData().Locations.length; i++) {
						if (oModel.getData().Locations[i].LocationId.toString() === this.LocationId) {
							txtLocationId.setValue(this.LocationId);
							txtLocationName.setValue(oModel.getData().Locations[i].Name);
							txtLatitude.setValue(oModel.getData().Locations[i].Lat);
							txtLongitude.setValue(oModel.getData().Locations[i].Lng);
							return false;
						}
					}
				}

			} else {
				MessageBox.error("Incorrect Data");
			}
		},

		_onNavBack: function () {
			this.getRouter().navTo("LocationManager", {}, true);
			var that = this;
			that._clearData();

		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
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

		_onSaveUpdate: function () {
			var that = this;
			var txtLocationId = this.getView().byId("txtLocationId");
			if (txtLocationId.getValue() === "0") {
				that._onSaveLocation();
			} else {
				that._onUpdateLocation();
			}
		},

		_onSaveLocation: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var txtLocationName = this.getView().byId("txtLocationName");
			var txtLatitude = this.getView().byId("txtLatitude");
			var txtLongitude = this.getView().byId("txtLongitude");

			if (txtLocationName.getValue() === "" || txtLatitude.getValue() === "" || txtLongitude.getValue() === "") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelLocation = this.getOwnerComponent().getModel("LocationSet");
				this.getView().setModel(oModelLocation);

				var oModel = this.getView().getModel();

				// Get the Number of records in the OData Locations 
				var LocationsNumber = oModel.getProperty("/Locations").length;

				// Populate the new Location ID 
				var NewLocationID = LocationsNumber + 1;
				var oNewEntry = {};

				oNewEntry = {
					"LocationId": NewLocationID,
					"Name": txtLocationName.getValue(),
					"Lat": txtLatitude.getValue(),
					"Lng": txtLongitude.getValue()

				};
				var oModelLocations = oModel.getProperty("/Locations");
				oModelLocations.push(oNewEntry);
				oModel.setProperty("/Locations", oModelLocations);
				MessageBox.confirm("Do you want to add Location?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("LocationManager");
							that._clearData();
						}
					}
				});
			}
		},

		_onUpdateLocation: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var txtLocationId = this.getView().byId("txtLocationId");
			var txtLocationName = this.getView().byId("txtLocationName");
			var txtLatitude = this.getView().byId("txtLatitude");
			var txtLongitude = this.getView().byId("txtLongitude");

			if (txtLocationName.getValue() === "" || txtLatitude.getValue() === "" || txtLongitude.getValue() === "") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelLocation = this.getOwnerComponent().getModel("LocationSet");
				this.getView().setModel(oModelLocation);

				var oModel = this.getView().getModel();
				var oModelLocations = oModel.getProperty("/Locations");
				for (var i = 0; i < oModel.getData().Locations.length; i++) {
					if (oModel.getData().Locations[i].LocationId.toString() === txtLocationId.getValue()) {
						oModel.getData().Locations[i].LocationId = txtLocationId.getValue();
						oModel.getData().Locations[i].Name = txtLocationName.getValue();
						oModel.getData().Locations[i].Lat = txtLatitude.getValue();
						oModel.getData().Locations[i].Lng = txtLongitude.getValue();
					} else {
						oModel.getData().Locations[i].LocationId = oModel.getData().Locations[i].LocationId;
						oModel.getData().Locations[i].Name = oModel.getData().Locations[i].Name;
						oModel.getData().Locations[i].Lat = oModel.getData().Locations[i].Lat;
						oModel.getData().Locations[i].Lng = oModel.getData().Locations[i].Lng;
					}
				}

				oModel.setProperty("/Locations", oModelLocations);
				MessageBox.confirm("Do you want to Update Location information?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("LocationManager");
							that._clearData();
						}
					}
				});

			}
		},

		_clearData: function () {
			var txtLocationId = this.getView().byId("txtLocationId");
			var txtLocationName = this.getView().byId("txtLocationName");
			var txtLatitude = this.getView().byId("txtLatitude");
			var txtLongitude = this.getView().byId("txtLongitude");

			txtLocationId.setValue(0);
			txtLocationName.setValue("");
			txtLatitude.setValue("");
			txtLongitude.setValue("");

		},

		_onSeachRoute: function (oEvent) {

			var txtLocationName = this.getView().byId("txtLocationName").getValue();
			var txtLatitude = this.getView().byId("txtLatitude");
			var txtLongitude = this.getView().byId("txtLongitude");

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				"address": txtLocationName
			}, function (results, status) {
				if (status === "OK") {
					txtLatitude.setValue(results[0].geometry.location.toJSON().lat);
					txtLongitude.setValue(results[0].geometry.location.toJSON().lng);
				} else {
					MessageBox.show("Location was not successful for the following reason: " + status);
				}
			});
		},

		
	});

});