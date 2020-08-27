sap.ui.define([
	'jquery.sap.global',
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	'sap/ui/core/Fragment',
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast'
], function (jquery, Controller, MessageBox, History, Fragment, Filter, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("product.ZVehicleTracking.controller.AddVehicle", {
		
	
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("EditVehicle").attachPatternMatched(this._onEditMatched, this);
		},

		_onEditMatched: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oModelVehicle = this.getOwnerComponent().getModel("VehicleSet");
			this.getView().setModel(oModelVehicle);
			var oModel = this.getView().getModel();

			var txtVehicleId = this.getView().byId("txtVehicleId");
			var txtCompanyCode = this.getView().byId("txtCompanyCode");
			var txtVehicleRegno = this.getView().byId("txtVehicleRegno");
			var txtVehicleOwnerName = this.getView().byId("txtVehicleOwnerName");
			var drpVehicleType = this.getView().byId("drpVehicleType");
			var txtComments = this.getView().byId("txtComments");

			if (oParameters.arguments.VehicleId !== "" || oParameters.arguments.VehicleId !== null) {
				this.VehicleId = oParameters.arguments.VehicleId;
				for (var i = 0; i < oModel.getData().Vehicles.length; i++) {
					if (oModel.getData().Vehicles[i].VehicleId.toString() === this.VehicleId) {
						txtVehicleId.setValue(this.VehicleId);
						txtCompanyCode.setValue(oModel.getData().Vehicles[i].CompanyCode);
						txtVehicleRegno.setValue(oModel.getData().Vehicles[i].RegistrationNo);
						txtVehicleOwnerName.setValue(oModel.getData().Vehicles[i].OwnerName);
						drpVehicleType.setSelectedKey(oModel.getData().Vehicles[i].VehicleType);
						txtComments.setValue(oModel.getData().Vehicles[i].Comments);
						return false;
						
					}
				}

			} else {
				MessageBox.error("Error in Data");
			}
		},

		_onNavBack: function () {
			var that=this;
			that._clearData();
			this.getRouter().navTo("VehicleMaster", {}, true);
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

		_handleValueHelpCompanyCode: function (oEvent) {
			
			var oModelVehicle = this.getOwnerComponent().getModel("CompanyCodeSet");
			this.getView().setModel(oModelVehicle);
			
			var sInputValueCompanyCode = oEvent.getSource().getValue();

			this.inputCompanyCodeId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCompanyCode) {
				this._valueHelpDialogCompanyCode = sap.ui.xmlfragment(
					"product.ZVehicleTracking.fragments.CompanyCode",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCompanyCode);
			}

			// create a filter for the binding

			this._valueHelpDialogCompanyCode.getBinding("items").filter([new sap.ui.model.Filter(
				"CompanyCode",
				sap.ui.model.FilterOperator.Contains, sInputValueCompanyCode
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogCompanyCode.open(sInputValueCompanyCode);
		},

		_handleValueHelpSearchCompanyCode: function (evt) {
			var sValueCompanyCode = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter("CompanyCode",sap.ui.model.FilterOperator.Contains, sValueCompanyCode
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseCompanyCode: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var txtOwnerName = this.getView().byId("txtVehicleOwnerName");
			if (oSelectedItem) {
				var CompanyCodeInput = this.getView().byId(this.inputCompanyCodeId);
				CompanyCodeInput.setValue(oSelectedItem.getDescription());
				txtOwnerName.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		_onSaveUpdate: function () {
			var that = this;
			var txtVehicleId = this.getView().byId("txtVehicleId");
			if (txtVehicleId.getValue() === "0") {
				that._onSaveVehicle();
			} else {
				that._onUpdateVehicle();
			}
		},
		_onSaveVehicle: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var txtCompanyCode = this.getView().byId("txtCompanyCode");
			var txtVehicleRegno = this.getView().byId("txtVehicleRegno");
			var txtVehicleOwnerName = this.getView().byId("txtVehicleOwnerName");
			var drpVehicleType = this.getView().byId("drpVehicleType");
			var txtComments = this.getView().byId("txtComments");

			if (txtCompanyCode.getValue() === "" || txtVehicleRegno.getValue() === "" || txtVehicleOwnerName.getValue() === "" || txtComments.getValue() ===
				"" || drpVehicleType.getSelectedKey() === 0) {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelVehicle = this.getOwnerComponent().getModel("VehicleSet");
				this.getView().setModel(oModelVehicle);

				var oModel = this.getView().getModel();

				// Get the Number of records in the OData Vehicles 
				var VehiclesNumber = oModel.getProperty("/Vehicles").length;

				// Populate the new Vehicle ID 
				var NewVehicleID = VehiclesNumber + 1;
				var oNewEntry = {};

				oNewEntry = {
					"VehicleId": NewVehicleID,
					"CompanyCode": txtCompanyCode.getValue(),
					"RegistrationNo": txtVehicleRegno.getValue(),
					"OwnerName": txtVehicleOwnerName.getValue(),
					"VehicleType": drpVehicleType.getSelectedKey(),
					"Comments": txtComments.getValue()
				};
				var oModelVehicles = oModel.getProperty("/Vehicles");
				oModelVehicles.push(oNewEntry);
				oModel.setProperty("/Vehicles", oModelVehicles);
				MessageBox.confirm("Do you want to add Vehicle?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("VehicleMaster");
							that._clearData();
						}
					}
				});
				
			}
		},
		_onUpdateVehicle: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var txtVehicleId = this.getView().byId("txtVehicleId");
			var txtCompanyCode = this.getView().byId("txtCompanyCode");
			var txtVehicleRegno = this.getView().byId("txtVehicleRegno");
			var txtVehicleOwnerName = this.getView().byId("txtVehicleOwnerName");
			var drpVehicleType = this.getView().byId("drpVehicleType");
			var txtComments = this.getView().byId("txtComments");

			if (txtCompanyCode.getValue() === "" || txtCompanyCode.getValue() === "" || txtVehicleRegno.getValue() === "" ||
				txtVehicleOwnerName.getValue() ===
				"" || drpVehicleType.getSelectedKey() === 0 || txtComments.getValue() === "") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelVehicle = this.getOwnerComponent().getModel("VehicleSet");
				this.getView().setModel(oModelVehicle);

				var oModel = this.getView().getModel();
				var oModelVehicles = oModel.getProperty("/Vehicles");

				for (var i = 0; i < oModel.getData().Vehicles.length; i++) {
					if (oModel.getData().Vehicles[i].VehicleId.toString() === txtVehicleId.getValue()) {
						oModel.getData().Vehicles[i].VehicleId = txtVehicleId.getValue();
						oModel.getData().Vehicles[i].CompanyCode = txtCompanyCode.getValue();
						oModel.getData().Vehicles[i].RegistrationNo = txtVehicleRegno.getValue();
						oModel.getData().Vehicles[i].OwnerName = txtVehicleOwnerName.getValue();
						oModel.getData().Vehicles[i].VehicleType = drpVehicleType.getSelectedKey();
						oModel.getData().Vehicles[i].Comments = txtComments.getValue();
					} else {
						oModel.getData().Vehicles[i].VehicleId = oModel.getData().Vehicles[i].VehicleId;
						oModel.getData().Vehicles[i].CompanyCode = oModel.getData().Vehicles[i].CompanyCode;
						oModel.getData().Vehicles[i].RegistrationNo = oModel.getData().Vehicles[i].RegistrationNo;
						oModel.getData().Vehicles[i].OwnerName = oModel.getData().Vehicles[i].OwnerName;
						oModel.getData().Vehicles[i].VehicleType = oModel.getData().Vehicles[i].VehicleType;
						oModel.getData().Vehicles[i].Comments = oModel.getData().Vehicles[i].Comments;
					}

				}

				oModel.setProperty("/Vehicles", oModelVehicles);

				MessageBox.confirm("Do you want to Update Vehicle information?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("VehicleMaster");
							that._clearData();
						}
					}
				});
			}
		},

		_clearData: function () {
			var txtVehicleId = this.getView().byId("txtVehicleId");
			var txtCompanyCode = this.getView().byId("txtCompanyCode");
			var txtVehicleRegno = this.getView().byId("txtVehicleRegno");
			var txtVehicleOwnerName = this.getView().byId("txtVehicleOwnerName");
			var drpVehicleType = this.getView().byId("drpVehicleType");
			var txtComments = this.getView().byId("txtComments");

			txtVehicleId.setValue(0);
			txtCompanyCode.setValue("");
			txtVehicleRegno.setValue("");
			txtVehicleOwnerName.setValue("");
			drpVehicleType.setSelectedKey(0);
			txtComments.setValue("");
		}

	});

});