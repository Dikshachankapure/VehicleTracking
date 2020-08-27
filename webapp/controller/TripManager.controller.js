sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter"
], function (Controller, MessageBox, History, JSONModel, Filter) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.TripManager", {
		onInit: function () {
			var oModelTrip = this.getOwnerComponent().getModel("TripSet");
			this.getView().setModel(oModelTrip);
		},
		_getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		_onNavBack: function () {

			this._getRouter().navTo("Dashboard", {}, true);
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

		onAddTrip: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("AddTrip");
		},

		onEdit: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var objTrip = oEvent.getSource().getBindingContext().getObject();
			//Get the Model. 
			if (objTrip.Status === "ONGOING" || objTrip.Status === "COMPLETED" || objTrip.Status === "CANCELLED") {
				MessageBox.information("You Can not edit trip");
			} else {
				oRouter.navTo("EditTrip", {
					TripId: objTrip.TripId
				});
			}

		},

		onDelete: function (oEvent) {
			var oList = this.byId("tblTrips");

			var aItems = oList.getItems();
			var oModelItems = oList.getModel();
			var values = oModelItems.getData();

			var deleteRecord = oEvent.getSource().getBindingContext().getObject();
			if (aItems.length > 0) {
				for (var i = 0; i < values.Trips.length; i++) {
					if (values.Trips[i].Status === "COMPLETED" || values.Trips[i].Status === "ONGOING") {
						MessageBox.information("You Can not Delete this trip");
					} else {
						if (values.Trips[i].TripId === deleteRecord.TripId) {
							//	pop this._data.Products[i] 
							values.Trips.splice(i, 1);
							oModelItems.refresh();
							break;
						}
						oModelItems.setData(values);
						oList.setModel(oModelItems);
					}
				}
			}
		},

		onSearch: function (oEvt) {

			var query = oEvt.getSource().getValue();
			if (query && query.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("TripId", sap.ui.model.FilterOperator.Contains, query);
				var oFilter2 = new sap.ui.model.Filter("RegistrationNo", sap.ui.model.FilterOperator.Contains, query);
				var oFilter3 = new sap.ui.model.Filter("DriverName", sap.ui.model.FilterOperator.Contains, query);
				var oFilter4 = new sap.ui.model.Filter("VehicleRouteFrom", sap.ui.model.FilterOperator.Contains, query);
				var oFilter5 = new sap.ui.model.Filter("VehicleRouteTo", sap.ui.model.FilterOperator.Contains, query);
				var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4, oFilter5], false);

			}
			var obinding = this.getView().byId("tblTrips").getBinding("items");
			obinding.filter(allFilter);

		}

	});

});