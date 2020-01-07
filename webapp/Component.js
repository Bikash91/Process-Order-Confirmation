sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/upl/ProcessOrderConfirmation/model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("com.sap.upl.ProcessOrderConfirmation.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			var oModel = new JSONModel({
				busy: false,
				visiblerestdata: false,
				enablePost: false,
				confirmationtype: [{
					"key": "Y",
					"type": "Partial Confirmation"
				}, {
					"key": "X",
					"type": "Final Confirmation"
				}]
			});
			this.setModel(oModel, "settingsModel");
			this.getModel("settingsModel").refresh();
			this.getModel("settingsModel").updateBindings();

			var confirmationData = new JSONModel({
				/*POSTINGDATE: new Date(),*/
				PROCESSORDER: "",
				PHASE: "",
				CONFIRMATION: "",
				YIELD: "",
				YUNIT: "",
				CONFACTIVITY1: "",
				CON1UNIT: "",
				CONFACTIVITY2: "",
				CON2UNIT: "",
				POSTINGDATE: ""
			});
			this.setModel(confirmationData, "confirmationModel");
			this.getModel("confirmationModel").refresh();
			this.getModel("confirmationModel").updateBindings();
			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});