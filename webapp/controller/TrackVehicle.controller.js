sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/MessageStrip"
], function (Controller, MessageBox, History, JSONModel, Filter, MessageStrip) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.TrackVehicle", {

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

		onCancel: function (oEvent) {
			var oList = this.byId("tblTrips");

			var aItems = oList.getItems();
			var oModelItems = oList.getModel();
			var values = oModelItems.getData();

			var UpdateRecord = oEvent.getSource().getBindingContext().getObject();
			if (aItems.length > 0) {
				for (var i = 0; i < values.Trips.length; i++) {
					if (UpdateRecord.TripId === values.Trips[i].TripId && (values.Trips[i].Status === "COMPLETED" || values.Trips[i].Status ===
							"ONGOING")) {
						MessageBox.information("You Can not Cancel this trip");

					} else if (UpdateRecord.TripId === values.Trips[i].TripId && values.Trips[i].Status === "CANCELLED") {
						MessageBox.information("This trip is already cancelled");
					} else {
						if (values.Trips[i].TripId === UpdateRecord.TripId) {
							//	pop this._data.Products[i] 
							values.Trips[i].Status = "CANCELLED";
							values.Trips[i].Type = "Error";
							oModelItems.refresh();
							break;
						}
						oModelItems.setData(values);
						oList.setModel(oModelItems);
					}

				}

			}
		},

		onSearch: function (oEvent) {
			var query1 = this.getView().byId("dpkDate").getValue();
			var query2 = this.getView().byId("cmbStatus").getSelectedKey();
			var oFilter1, oFilter2, oFilter3;
			var allFilter = "";
			if (query1.length > 0 && query2.length > 0) {
				oFilter1 = new sap.ui.model.Filter("AssignedDateFrom", sap.ui.model.FilterOperator.EQ, query1);
				oFilter2 = new sap.ui.model.Filter("AssignedDateTo", sap.ui.model.FilterOperator.EQ, query1);
				oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, query2);
				allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3], false);
			} else if (query1.length > 0) {
				oFilter1 = new sap.ui.model.Filter("AssignedDateFrom", sap.ui.model.FilterOperator.EQ, query1);
				oFilter2 = new sap.ui.model.Filter("AssignedDateTo", sap.ui.model.FilterOperator.EQ, query1);
				allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);
			} else if (query2.length > 0) {
				oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, query2);
				allFilter = new sap.ui.model.Filter([oFilter3], false);
			} else {
				oFilter1 = new sap.ui.model.Filter("AssignedDateFrom", sap.ui.model.FilterOperator.EQ, "");
				oFilter2 = new sap.ui.model.Filter("AssignedDateTo", sap.ui.model.FilterOperator.EQ, "");
				oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, "");
				allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3], false);
			}

			var obinding = this.getView().byId("tblTrips").getBinding("items");
			obinding.filter(allFilter);
		}
	});

});