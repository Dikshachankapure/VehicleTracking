sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
], function (Controller, MessageBox, History, JSONModel, Filter) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.VehicleMaster", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf product.ZVehicleTracking.view.VehcleMaster
		 */
		onInit: function () {
			var oModelVehicle = this.getOwnerComponent().getModel("VehicleSet");
			this.getView().setModel(oModelVehicle);
			
		},

		_onNavBack: function () {
			this.getRouter().navTo("Dashboard", {}, true);
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

		_onAddVehicle: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("AddVehicle");
		},

		_onEdit: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var objVehicle = oEvent.getSource().getBindingContext().getObject();
		
			oRouter.navTo("EditVehicle", {
				VehicleId: objVehicle.VehicleId
			});
		},

		_onDelete: function (oEvent) {
			var oList = this.byId("tblVehicles");

			var aItems = oList.getItems();
			var oModelItems = oList.getModel();
			var values = oModelItems.getData();

			var deleteRecord = oEvent.getSource().getBindingContext().getObject();
			if (aItems.length > 0) {
				for (var i = 0; i < values.Vehicles.length; i++) {
					if (values.Vehicles[i].VehicleId === deleteRecord.VehicleId) {
						//	pop this._data.Products[i] 
						values.Vehicles.splice(i, 1);
						oModelItems.refresh();
						break;
					}
				}
				oModelItems.setData(values);
				oList.setModel(oModelItems);
			}
		},

		_onSearch: function (oEvt) {
			
			var query = oEvt.getSource().getValue();
			if (query && query.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.Contains, query);
				var oFilter2 = new sap.ui.model.Filter("RegistrationNo", sap.ui.model.FilterOperator.Contains, query);
				var oFilter3 = new sap.ui.model.Filter("OwnerName", sap.ui.model.FilterOperator.Contains, query);
				var oFilter4 = new sap.ui.model.Filter("VehicleType", sap.ui.model.FilterOperator.Contains, query);
				var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4], false);

			}
			var obinding = this.getView().byId("tblVehicles").getBinding("items");
			obinding.filter(allFilter);

		},
	});

});