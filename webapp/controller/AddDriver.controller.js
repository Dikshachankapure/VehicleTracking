sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast'
], function (Controller, MessageBox, History, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.AddDriver", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf product.ZVehicleTracking.view.AddDriver
		 */
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("EditDriver").attachPatternMatched(this._onEditMatched, this);
		},

		_onEditMatched: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oModelDriver = this.getOwnerComponent().getModel("DriverSet");
			this.getView().setModel(oModelDriver);
			var oModel = this.getView().getModel();

			var txtDriverId = this.getView().byId("txtDriverId");

			var txtFirstName = this.getView().byId("txtFirstName");
			var txtLastName = this.getView().byId("txtLastName");
			var txtMobileNo = this.getView().byId("txtMobileNo");
			var txtLicenseNo = this.getView().byId("txtLicenseNo");
			var txtAadharCardNo = this.getView().byId("txtAadharCardNo");
			var txtAddress = this.getView().byId("txtAddress");
			if (oParameters.arguments.DriverId !== "" || oParameters.arguments.DriverId !== null) {

				this.DriverId = oParameters.arguments.DriverId;

				for (var i = 0; i < oModel.getData().Drivers.length; i++) {
					if (oModel.getData().Drivers[i].DriverId.toString() === this.DriverId) {
						txtDriverId.setValue(this.DriverId);
						txtFirstName.setValue(oModel.getData().Drivers[i].FirstName);
						txtLastName.setValue(oModel.getData().Drivers[i].LastName);
						txtMobileNo.setValue(oModel.getData().Drivers[i].MobileNo);
						txtLicenseNo.setValue(oModel.getData().Drivers[i].LicenseNo);
						txtAadharCardNo.setValue(oModel.getData().Drivers[i].AadharNo);
						txtAddress.setValue(oModel.getData().Drivers[i].Address);
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
			this.getRouter().navTo("DriverManager", {}, true);

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
			var txtDriverId = this.getView().byId("txtDriverId");
			if (txtDriverId.getValue() === "0") {
				that._onSaveDriver();
			} else {
				that._onUpdateDriver();
			}
		},
		_onSaveDriver: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var txtFirstName = this.getView().byId("txtFirstName");
			var txtLastName = this.getView().byId("txtLastName");
			var txtMobileNo = this.getView().byId("txtMobileNo");
			var txtLicenseNo = this.getView().byId("txtLicenseNo");
			var txtAadharCardNo = this.getView().byId("txtAadharCardNo");
			var txtAddress = this.getView().byId("txtAddress");

			if (txtFirstName.getValue() === "" || txtLastName.getValue() === "" || txtMobileNo.getValue() === "" || txtLicenseNo.getValue() ===
				"" || txtAadharCardNo.getValue() === "" || txtAddress.getValue() === "") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelDriver = this.getOwnerComponent().getModel("DriverSet");
				this.getView().setModel(oModelDriver);

				var oModel = this.getView().getModel();

				// Get the Number of records in the OData Drivers 
				var DriversNumber = oModel.getProperty("/Drivers").length;

				// Populate the new Driver ID 
				var NewDriverID = DriversNumber + 1;
				var oNewEntry = {};

				oNewEntry = {
					"DriverId": NewDriverID,
					"FirstName": txtFirstName.getValue(),
					"LastName": txtLastName.getValue(),
					"MobileNo": txtMobileNo.getValue(),
					"LicenseNo": txtLicenseNo.getValue(),
					"AadharNo": txtAadharCardNo.getValue(),
					"Address": txtAddress.getValue()
				};
				var oModelDrviers = oModel.getProperty("/Drivers");
				oModelDrviers.push(oNewEntry);
				oModel.setProperty("/Drivers", oModelDrviers);
				MessageBox.confirm("Do you want to add Driver?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("DriverManager");
							that._clearData();
						}
					}
				});
			}
		},
		_onUpdateDriver: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var txtDriverId = this.getView().byId("txtDriverId");
			var txtFirstName = this.getView().byId("txtFirstName");
			var txtLastName = this.getView().byId("txtLastName");
			var txtMobileNo = this.getView().byId("txtMobileNo");
			var txtLicenseNo = this.getView().byId("txtLicenseNo");
			var txtAadharCardNo = this.getView().byId("txtAadharCardNo");
			var txtAddress = this.getView().byId("txtAddress");

			if (txtFirstName.getValue() === "" || txtLastName.getValue() === "" || txtMobileNo.getValue() === "" || txtLicenseNo.getValue() ===
				"" || txtAadharCardNo.getValue() === "" || txtAddress.getValue() === "") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelDriver = this.getOwnerComponent().getModel("DriverSet");
				this.getView().setModel(oModelDriver);

				var oModel = this.getView().getModel();
				var oModelDrviers = oModel.getProperty("/Drivers");

				for (var i = 0; i < oModel.getData().Drivers.length; i++) {
					if (oModel.getData().Drivers[i].DriverId.toString() === txtDriverId.getValue()) {
						oModel.getData().Drivers[i].DriverId = txtDriverId.getValue();
						oModel.getData().Drivers[i].FirstName = txtFirstName.getValue();
						oModel.getData().Drivers[i].LastName = txtLastName.getValue();
						oModel.getData().Drivers[i].MobileNo = txtMobileNo.getValue();
						oModel.getData().Drivers[i].LicenseNo = txtLicenseNo.getValue();
						oModel.getData().Drivers[i].AadharNo = txtAadharCardNo.getValue();
						oModel.getData().Drivers[i].Address = txtAddress.getValue();

					} else {
						oModel.getData().Drivers[i].DriverId = oModel.getData().Drivers[i].DriverId;
						oModel.getData().Drivers[i].FirstName = oModel.getData().Drivers[i].FirstName;
						oModel.getData().Drivers[i].LastName = oModel.getData().Drivers[i].LastName;
						oModel.getData().Drivers[i].MobileNo = oModel.getData().Drivers[i].MobileNo;
						oModel.getData().Drivers[i].LicenseNo = oModel.getData().Drivers[i].LicenseNo;
						oModel.getData().Drivers[i].AadharNo = oModel.getData().Drivers[i].AadharNo;
						oModel.getData().Drivers[i].Address = oModel.getData().Drivers[i].Address;

					}

				}

				oModel.setProperty("/Drivers", oModelDrviers);
				MessageBox.confirm("Do you want to Update Driver information?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("DriverManager");
							that._clearData();
						}
					}
				});

			}
		},

		_clearData: function () {
			var txtDriverId = this.getView().byId("txtDriverId");
			var txtFirstName = this.getView().byId("txtFirstName");
			var txtLastName = this.getView().byId("txtLastName");
			var txtMobileNo = this.getView().byId("txtMobileNo");
			var txtLicenseNo = this.getView().byId("txtLicenseNo");
			var txtAadharCardNo = this.getView().byId("txtAadharCardNo");
			var txtAddress = this.getView().byId("txtAddress");

			txtDriverId.setValue(0);
			txtFirstName.setValue("");
			txtLastName.setValue("");
			txtMobileNo.setValue("");
			txtLicenseNo.setValue("");
			txtAadharCardNo.setValue("");
			txtAddress.setValue("");
		}

	});

});