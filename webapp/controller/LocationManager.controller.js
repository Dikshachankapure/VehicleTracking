sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
], function (Controller, MessageBox, History, JSONModel, Filter) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.LocationManager", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf product.ZVehicleTracking.view.LocationManager
		 */
		onInit: function () {
			var oModelLocation = this.getOwnerComponent().getModel("LocationSet");
			this.getView().setModel(oModelLocation);
		},
		
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		_onNavBack: function () {
			this.getRouter().navTo("Dashboard", {}, true);
		},

		

		_onPressMenu: function (oEvent) {
			//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (oEvent.getSource().getText() === "Dashboard") {
				this.getRouter().navTo("Dashboard");
			} else if (oEvent.getSource().getText() === "Location Manager") {
				this.getRouter().navTo("LocationManager");
			} else if (oEvent.getSource().getText() === "Vehicle Manager") {
				this.getRouter().navTo("VehicleMaster");
			} else if (oEvent.getSource().getText() === "Driver Manager") {
				this.getRouter().navTo("DriverManager");
			} else if (oEvent.getSource().getText() === "Trip Manager") {
				this.getRouter().navTo("TripManager");
			} else if (oEvent.getSource().getText() === "Track Vehicle") {
				this.getRouter().navTo("TrackVehicle");
			}
		},

		onAddLocation: function (oEvent) {
			this.getRouter().navTo("AddLocation");
		},

		onEdit: function (oEvent) {
			
			var objLocation = oEvent.getSource().getBindingContext().getObject();
			//Get the Model. 
			this.getRouter().navTo("EditLocation", {
				LocationId: objLocation.LocationId
			});
		},

		onDelete: function (oEvent) {
			var oList = this.byId("tblLocations");

			var aItems = oList.getItems();
			var oModelItems = oList.getModel();
			var values = oModelItems.getData();

			var deleteRecord = oEvent.getSource().getBindingContext().getObject();
			if (aItems.length > 0) {
				for (var i = 0; i < values.Locations.length; i++) {
					if (values.Locations[i].LocationId === deleteRecord.LocationId) {
						//	pop this._data.Products[i] 
						values.Locations.splice(i, 1);
						oModelItems.refresh();
						break;
					}
				}

				oModelItems.setData(values);
				oList.setModel(oModelItems);
			}
			//that.RefreshLocations();
		},

		onSearch: function (oEvt) {
			var query = oEvt.getSource().getValue();
			if (query && query.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, query);
				var oFilter2 = new sap.ui.model.Filter("Lat", sap.ui.model.FilterOperator.Contains, query);
				var oFilter3 = new sap.ui.model.Filter("Lng", sap.ui.model.FilterOperator.Contains, query);
				var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3], false);
			}
			var obinding = this.getView().byId("tblLocations").getBinding("items");
			obinding.filter(allFilter);
		},

		_searchBySpeech: function (oEvent) {
			var btnSpeech = this.getView().byId("btnSpeech");
			var txtSearch = this.getView().byId("txtSearch");
			if (window.hasOwnProperty("webkitSpeechRecognition")) {
				var recognition = new webkitSpeechRecognition();
				recognition.continuous = false;
				recognition.interimResults = false;
				recognition.lang = "en-US";
				recognition.start();
				btnSpeech.setBusy(true);
				recognition.onresult = function (event) {
					var transcript = event.results[0][0].transcript;
					txtSearch.setValue(transcript);
					recognition.stop();
					btnSpeech.setBusy(false);
					txtSearch.fireLiveChange();
					
				};

				recognition.onerror = function (e) {
					recognition.stop();
					txtSearch.fireLiveChange();
				};
			}
			
		}
	});

});