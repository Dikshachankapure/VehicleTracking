sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, MessageBox, History, Fragment, Filter, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.AddTrip", {

		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("EditTrip").attachPatternMatched(this._onEditMatched, this);
			var that = this;
			that._loadLocationData();
		},

		_loadLocationData: function () {
			var oModelLocation = this.getOwnerComponent().getModel("LocationSet");
			//this.getView().setModel(oModelLocation);
			var drpRouteFrom = this.getView().byId("drpRouteFrom");
			var drpRouteTo = this.getView().byId("drpRouteTo");
			drpRouteFrom.setModel(oModelLocation);
			drpRouteTo.setModel(oModelLocation);

		},
		_onEditMatched: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oModelTrip = this.getOwnerComponent().getModel("TripSet");
			this.getView().setModel(oModelTrip);
			var oModel = this.getView().getModel();

			var txtTripId = this.getView().byId("txtTripId");
			var txtVechileRegNo = this.getView().byId("txtVechileRegNo");
			var txtDriverName = this.getView().byId("txtDriverName");
			var drpRouteFrom = this.getView().byId("drpRouteFrom");
			var drpRouteTo = this.getView().byId("drpRouteTo");

			var dpkAssignDateFrom = this.getView().byId("dpkAssignDateFrom");
			//var dpkAssignDateTo = this.getView().byId("dpkAssignDateTo");
			var tpkAssignTimeFrom = this.getView().byId("tpkAssignTimeFrom");
			var tpkAssignTimeTo = this.getView().byId("tpkAssignTimeTo");
			var txtComments = this.getView().byId("txtComments");

			var btnSave = this.getView().byId("btnSave");
			var btnClear = this.getView().byId("bnClear");

			var that = this;
			if (oParameters.arguments.TripId !== "" || oParameters.arguments.TripId !== null) {

				this.TripId = oParameters.arguments.TripId;

				for (var i = 0; i < oModel.getData().Trips.length; i++) {
					if (oModel.getData().Trips[i].TripId.toString() === this.TripId) {
						if (oModel.getData().Trips[i].Status === "COMPLETED" || oModel.getData().Trips[i].Status === "ONGOING" || oModel.getData().Trips[
								i].Status === "CANCELLED") {
							btnSave.setVisible(false);
							btnClear.setVisible(false);
						} else {
							btnSave.setVisible(true);
							btnClear.setVisible(true);
						}
						that._loadLocationData();
						txtTripId.setValue(this.TripId);
						txtVechileRegNo.setValue(oModel.getData().Trips[i].RegistrationNo);
						txtDriverName.setValue(oModel.getData().Trips[i].DriverName);
						drpRouteFrom.setValue(oModel.getData().Trips[i].VehicleRouteFrom);
						drpRouteTo.setValue(oModel.getData().Trips[i].VehicleRouteTo);
						dpkAssignDateFrom.setValue(oModel.getData().Trips[i].AssignedDateFrom);
						//dpkAssignDateTo.setValue(oModel.getData().Trips[i].AssignedDateTo);
						tpkAssignTimeFrom.setValue(oModel.getData().Trips[i].AssignedTimeFrom);
						tpkAssignTimeTo.setValue(oModel.getData().Trips[i].AssignedTimeTo);
						txtComments.setValue(oModel.getData().Trips[i].Comments);
						return false;
					}
				}

			} else {
				MessageBox.error("Incorrect Data");
			}
		},

		_onNavBack: function () {
			var that = this;
			that._clearData();
			this.getRouter().navTo("TripManager", {}, true);
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

		_handleValueHelpVehicle: function (oEvent) {

			var oModelVehicle = this.getOwnerComponent().getModel("VehicleSet");
			this.getView().setModel(oModelVehicle);

			var sInputValueVehicle = oEvent.getSource().getValue();

			this.inputVehicleId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogVehicle) {
				this._valueHelpDialogVehicle = sap.ui.xmlfragment(
					"product.ZVehicleTracking.fragments.Vehicle",
					this
				);
				this.getView().addDependent(this._valueHelpDialogVehicle);
			}

			// create a filter for the binding

			this._valueHelpDialogVehicle.getBinding("items").filter([new sap.ui.model.Filter(
				"RegistrationNo",
				sap.ui.model.FilterOperator.Contains, sInputValueVehicle
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogVehicle.open(sInputValueVehicle);
		},

		_handleValueHelpSearchVehicle: function (evt) {
			var sValueVehicle = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"RegistrationNo",
				sap.ui.model.FilterOperator.Contains, sValueVehicle
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseVehicle: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var VehicleInput = this.getView().byId(this.inputVehicleId);
				VehicleInput.setValue(oSelectedItem.getDescription());

			}
			evt.getSource().getBinding("items").filter([]);
		},

		_handleValueHelpDriver: function (oEvent) {

			var oModelDriver = this.getOwnerComponent().getModel("DriverSet");
			this.getView().setModel(oModelDriver);

			var sInputValueDriver = oEvent.getSource().getValue();

			this.inputDriverId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogDriver) {
				this._valueHelpDialogDriver = sap.ui.xmlfragment(
					"product.ZVehicleTracking.fragments.Driver",
					this
				);
				this.getView().addDependent(this._valueHelpDialogDriver);
			}

			// create a filter for the binding

			this._valueHelpDialogDriver.getBinding("items").filter([new sap.ui.model.Filter(
				"DriverId",
				sap.ui.model.FilterOperator.Contains, sInputValueDriver
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogDriver.open(sInputValueDriver);
		},

		_handleValueHelpSearchDriver: function (evt) {
			var sValueDriver = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"DriverId",
				sap.ui.model.FilterOperator.Contains, sValueDriver
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseDriver: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var DriverInput = this.getView().byId(this.inputDriverId);
				DriverInput.setValue(oSelectedItem.getTitle());

			}
			evt.getSource().getBinding("items").filter([]);
		},

		_onSaveUpdate: function () {
			var that = this;
			var txtTripId = this.getView().byId("txtTripId");
			if (txtTripId.getValue() === "0") {
				that._onSaveTrip();
			} else {
				that._onUpdateTrip();
			}
		},

		_onSaveTrip: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var txtVechileRegNo = this.getView().byId("txtVechileRegNo");
			var txtDriverName = this.getView().byId("txtDriverName");
			var drpRouteFrom = this.getView().byId("drpRouteFrom");
			var drpRouteTo = this.getView().byId("drpRouteTo");
			var dpkAssignDateFrom = this.getView().byId("dpkAssignDateFrom");
			//var dpkAssignDateTo = this.getView().byId("dpkAssignDateTo");
			var tpkAssignTimeFrom = this.getView().byId("tpkAssignTimeFrom");
			var tpkAssignTimeTo = this.getView().byId("tpkAssignTimeTo");
			var txtComments = this.getView().byId("txtComments");

			if (txtVechileRegNo.getValue() === "" || txtDriverName.getValue() === "" || drpRouteFrom.getValue() === "" || drpRouteTo.getValue() ===
				"" || dpkAssignDateFrom.getValue() === ""
				//|| dpkAssignDateTo.getValue() === "" 
				|| tpkAssignTimeFrom.getValue() === "" ||
				tpkAssignTimeTo.getValue() === "") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelTrip = this.getOwnerComponent().getModel("TripSet");
				this.getView().setModel(oModelTrip);

				var oModel = this.getView().getModel();

				// Get the Number of records in the OData Drivers 
				var TripNumber = oModel.getProperty("/Trips").length;

				// Populate the new Driver ID 
				var NewTripID = TripNumber + 1;
				var oNewEntry = {};

				oNewEntry = {
					"TripId": NewTripID,
					"RegistrationNo": txtVechileRegNo.getValue(),
					"DriverName": txtDriverName.getValue(),
					"VehicleRouteFrom": drpRouteFrom.getValue(),
					"VehicleRouteTo": drpRouteTo.getValue(),
					"AssignedDateFrom": dpkAssignDateFrom.getValue(),
					//"AssignedDateTo": dpkAssignDateTo.getValue(),
					"AssignedTimeFrom": tpkAssignTimeFrom.getValue(),
					"AssignedTimeTo": tpkAssignTimeTo.getValue(),
					"Comments": txtComments.getValue(),
					"Status":"UPCOMING",
					"Type":"Warning"
				};
				var oModelTrips = oModel.getProperty("/Trips");
				oModelTrips.push(oNewEntry);

				oModel.setProperty("/Trips", oModelTrips);
				MessageBox.confirm("Do you want to Create Trip?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("TripManager");
							that._clearData();
						}
					}
				});
			
			}
		},

		_onUpdateTrip: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var txtTripId = this.getView().byId("txtTripId");
			var txtVechileRegNo = this.getView().byId("txtVechileRegNo");
			var txtDriverName = this.getView().byId("txtDriverName");
			var drpRouteFrom = this.getView().byId("drpRouteFrom");
			var drpRouteTo = this.getView().byId("drpRouteTo");
			var dpkAssignDateFrom = this.getView().byId("dpkAssignDateFrom");
			//var dpkAssignDateTo = this.getView().byId("dpkAssignDateTo");
			var tpkAssignTimeFrom = this.getView().byId("tpkAssignTimeFrom");
			var tpkAssignTimeTo = this.getView().byId("tpkAssignTimeTo");
			var txtComments = this.getView().byId("txtComments");

			if (txtVechileRegNo.getValue() === "" || txtDriverName.getValue() === "" || drpRouteFrom.getValue() === "" || drpRouteTo.getValue() ===
				"" || dpkAssignDateFrom.getValue() === "" 
				//|| dpkAssignDateTo.getValue() === "" 
				|| tpkAssignTimeFrom.getValue() === "" ||
				tpkAssignTimeTo.getValue() === "") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelTrip = this.getOwnerComponent().getModel("TripSet");
				this.getView().setModel(oModelTrip);

				var oModel = this.getView().getModel();
				var oModelTrips = oModel.getProperty("/Trips");

				for (var i = 0; i < oModel.getData().Trips.length; i++) {
					if (oModel.getData().Trips[i].TripId.toString() === txtTripId.getValue()) {
						oModel.getData().Trips[i].TripId = txtTripId.getValue();
						oModel.getData().Trips[i].RegistrationNo = txtVechileRegNo.getValue();
						oModel.getData().Trips[i].DriverName = txtDriverName.getValue();
						oModel.getData().Trips[i].VehicleRouteFrom = drpRouteFrom.getValue();
						oModel.getData().Trips[i].VehicleRouteTo = drpRouteTo.getValue();
						oModel.getData().Trips[i].AssignedDateFrom = dpkAssignDateFrom.getValue();
						//oModel.getData().Trips[i].AssignedDateTo = dpkAssignDateTo.getValue();
						oModel.getData().Trips[i].AssignedTimeFrom = tpkAssignTimeFrom.getValue();
						oModel.getData().Trips[i].AssignedTimeTo = tpkAssignTimeTo.getValue();
						oModel.getData().Trips[i].Comments = txtComments.getValue();
					} else {
						oModel.getData().Trips[i].TripId = oModel.getData().Trips[i].TripId;
						oModel.getData().Trips[i].RegistrationNo = oModel.getData().Trips[i].RegistrationNo;
						oModel.getData().Trips[i].DriverName = oModel.getData().Trips[i].DriverName;
						oModel.getData().Trips[i].VehicleRouteFrom = oModel.getData().Trips[i].VehicleRouteFrom;
						oModel.getData().Trips[i].VehicleRouteTo = oModel.getData().Trips[i].VehicleRouteTo;
						oModel.getData().Trips[i].AssignedDateFrom = oModel.getData().Trips[i].AssignedDateFrom;
						//oModel.getData().Trips[i].AssignedDateTo = oModel.getData().Trips[i].AssignedDateTo;
						oModel.getData().Trips[i].AssignedTimeFrom = oModel.getData().Trips[i].AssignedTimeFrom;
						oModel.getData().Trips[i].AssignedTimeTo = oModel.getData().Trips[i].AssignedTimeTo;
						oModel.getData().Trips[i].Comments = oModel.getData().Trips[i].Comments;
					}

				}

				oModel.setProperty("/Trips", oModelTrips);

				MessageBox.confirm("Do you want to Update Trip information?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("TripManager");
							that._clearData();
						}
					}
				});
			}
		},

		_clearData: function () {
			var txtTripId = this.getView().byId("txtTripId");
			var txtVechileRegNo = this.getView().byId("txtVechileRegNo");
			var txtDriverName = this.getView().byId("txtDriverName");
			var drpRouteFrom = this.getView().byId("drpRouteFrom");
			var drpRouteTo = this.getView().byId("drpRouteTo");
			var dpkAssignDateFrom = this.getView().byId("dpkAssignDateFrom");
			//var dpkAssignDateTo = this.getView().byId("dpkAssignDateTo");
			var tpkAssignTimeFrom = this.getView().byId("tpkAssignTimeFrom");
			var tpkAssignTimeTo = this.getView().byId("tpkAssignTimeTo");
			var txtComments = this.getView().byId("txtComments");
			var btnSave = this.getView().byId("btnSave");
			var btnClear = this.getView().byId("bnClear");

			txtTripId.setValue(0);
			txtVechileRegNo.setValue("");
			txtDriverName.setValue("");
			drpRouteFrom.setSelectedItem("");
			drpRouteTo.setSelectedItem("");
			btnSave.setVisible(true);
			btnClear.setVisible(true);

			dpkAssignDateFrom.setValue("");
			//dpkAssignDateTo.setValue("");
			tpkAssignTimeFrom.setValue("");
			tpkAssignTimeTo.setValue("");
			txtComments.setValue("");
		}

	});

});