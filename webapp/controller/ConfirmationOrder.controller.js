sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (Controller, MessageBox, JSONModel, Device) {
	"use strict";

	return Controller.extend("com.sap.upl.ProcessOrderConfirmation.controller.ConfirmationOrder", {

		onlyNumber: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},
		onlyQuantity: function (element) {
			element.attachBrowserEvent("keydown", (function (e) {
				var isModifierkeyPressed = (e.metaKey || e.ctrlKey || e.shiftKey);
				var isCursorMoveOrDeleteAction = ([46, 8, 37, 38, 39, 40, 9, 190].indexOf(e.keyCode) !== -1);
				var isNumKeyPressed = (e.keyCode >= 48 && e.keyCode <= 58) || (e.keyCode >= 96 && e.keyCode <= 105);
				var vKey = 86,
					cKey = 67,
					aKey = 65;
				switch (true) {
				case isCursorMoveOrDeleteAction:
				case isModifierkeyPressed === false && isNumKeyPressed:
				case (e.metaKey || e.ctrlKey) && ([vKey, cKey, aKey].indexOf(e.keyCode) !== -1):
					break;
				default:
					e.preventDefault();
				}
			}));
		},
		onAfterRendering: function () {
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("prcessOrder").focus();
			});
			/*this.onlyNumber(this.byId("idPo"));
			this.onlyQuantity(this.byId("quant"));*/

			this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", false);
			this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblerestdata", false);

			/*this.byId("postingDate").addEventDelegate({
				onAfterRendering: function () {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, this.byId("postingDate"));*/

			this.byId("postingDate").setMaxDate(new Date());
		},
		onInit: function () {
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("prcessOrder").focus();
			});

			/*this.byId("postingDate").addEventDelegate({
				onAfterRendering: function () {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, this.byId("postingDate"));*/
			this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", false);
			this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblerestdata", false);
		},

		onChange: function (oEvent) {
			var PROCESSORDER = this.getOwnerComponent().getModel("confirmationModel").getProperty("/PROCESSORDER");
			var PHASE = this.getOwnerComponent().getModel("confirmationModel").getProperty("/PHASE");
			if (oEvent.getSource().getName() === "prcessOrder") {
				if (oEvent.getSource().getValue() != "") {

					if (!(/^\d+$/.test(oEvent.getSource().getValue()))) {
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"numericOnly"), {
								onClose: function (oAction) {
									if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("prcessOrder").focus();
											this.getOwnerComponent().getModel("confirmationModel").setProperty("/PROCESSORDER", "");
										});
									}
								}.bind(this)
							});
						return;
					}
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("phase").focus();
					});
				}
			} else if (oEvent.getSource().getName() === "phase") {
				if (oEvent.getSource().getValue() != "") {
					if (!(/^\d+$/.test(oEvent.getSource().getValue()))) {
						MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"numericOnly"), {
								onClose: function (oAction) {
									if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
										jQuery.sap.delayedCall(400, this, function () {
											this.byId("phase").focus();
											this.getOwnerComponent().getModel("confirmationModel").setProperty("/PHASE", "");
										});
									}
								}.bind(this)
							});
						return;
					}
					jQuery.sap.delayedCall(400, this, function () {
						document.activeElement.blur();
					});
				}
			}

			if (PROCESSORDER != "" && PHASE != "") {
				this.getConfirmationData(PROCESSORDER, PHASE);
			}
		},

		onChangeField: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				debugger;
				var id, property;
				if (oEvt.getSource().getName() == "yieldtobeconfirmed") {
					id = "yieldtobeconfirmed";
					property = "/YIELD";
				} else if (oEvt.getSource().getName() == "duratioTime") {
					id = "duratioTime";
					property = "/CONFACTIVITY1";
				} else if (oEvt.getSource().getName() == "overhead") {
					id = "overhead";
					property = "/CONFACTIVITY2";
				}

				if (!(/^[0-9]+(\.[0-9]{1,2})?$/.test(oEvt.getSource().getValue()))) {
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle()
						.getText(
							"numericOnly"), {
							onClose: function (oAction) {
								if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
									jQuery.sap.delayedCall(400, this, function () {
										this.byId(id).focus();
										this.getOwnerComponent().getModel("confirmationModel").setProperty(property, "");
									});
								}
							}.bind(this)
						});
					return;
				}

				oEvt.getSource().setValueState("None");
				oEvt.getSource().setValueStateText("");
			}
		},

		onChangeConfirmation: function (oEvt) {
			debugger;
			if (oEvt.getSource().getSelectedKey() != "") {
				if (oEvt.getSource().getSelectedKey() == "Y") {
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFIRMATION", "Y");
				} else {
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFIRMATION", "X");
				}
				this.getOwnerComponent().getModel("confirmationModel").refresh();
				oEvt.getSource().setValueState("None");
				oEvt.getSource().setValueStateText("");
			}
		},

		onChangePostingDate: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
				oEvt.getSource().setValueStateText("");
			}
		},

		getConfirmationData: function (PROCESSORDER, PHASE) {
			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);

			var fieldFilter, filter = [];
			fieldFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("PROCESSORDER", sap.ui.model.FilterOperator.EQ, PROCESSORDER),
					new sap.ui.model.Filter("PHASE", sap.ui.model.FilterOperator.EQ, PHASE),
				],
				and: true
			});
			filter.push(fieldFilter);

			this.getOwnerComponent().getModel().read("/PROCESSORDERCONFIRMSet", {
				filters: filter,
				success: function (oData, oResponse) {
					debugger;
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					jQuery.sap.delayedCall(400, this, function () {
						document.activeElement.blur();
					});
					if (oData.results.length > 0) {
						if (oData.results[0].CONFIRMATION == "") {
							this.byId("confirmationType").setSelectedKey("Y");
							this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFIRMATION", "Y");
						} else {
							this.byId("confirmationType").setSelectedKey("X");
							this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFIRMATION", "X");
						}
						this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", true);
						this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblerestdata", true);
						this.getOwnerComponent().getModel("confirmationModel").setProperty("/PHASE", oData.results[0].PHASE);
						this.getOwnerComponent().getModel("confirmationModel").setProperty("/YIELD", oData.results[0].YIELD.trim());
						this.getOwnerComponent().getModel("confirmationModel").setProperty("/YUNIT", oData.results[0].YUNIT);
						this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFACTIVITY1", oData.results[0].CONFACTIVITY1.trim());
						this.getOwnerComponent().getModel("confirmationModel").setProperty("/CON1UNIT", oData.results[0].CON1UNIT);
						this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFACTIVITY2", oData.results[0].CONFACTIVITY2.trim());
						this.getOwnerComponent().getModel("confirmationModel").setProperty("/CON2UNIT", oData.results[0].CON2UNIT);
						this.getOwnerComponent().getModel("confirmationModel").setProperty("/POSTINGDATE", this.dateFormatter(oData.results[
							0].POSTINGDATE));
					}
					this.getOwnerComponent().getModel("confirmationModel").refresh();

					/*PROCESSORDER: "000108600081"
					PHASE: "0020"
					CONFIRMATION: ""
					YIELD: "      10.000"
					YUNIT: "L"
					CONFACTIVITY1: "      10.000"
					CON1UNIT: "H"
					CONFACTIVITY2: "      20.000"
					CON2UNIT: "H"
					POSTINGDATE: "20200105"
					MESSAGE: ""*/

				}.bind(this),
				error: function (error) {
					debugger;
					this.byId("confirmationType").setSelectedKey("Y");
					this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", false);
					this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblerestdata", false);
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFIRMATION", "Y");
					/*this.getOwnerComponent().getModel("confirmationModel").setProperty("/PHASE", "");
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/YIELD", "");
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/YUNIT", "");
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFACTIVITY1", "");
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/CON1UNIT", "");
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFACTIVITY2", "");
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/CON2UNIT", "");
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/POSTINGDATE", "");*/
					this.getOwnerComponent().getModel("confirmationModel").refresh();

					this.getErrorDetails(error, this.getOwnerComponent().getModel("i18n").getResourceBundle()
						.getText(
							"error"));
				}.bind(this)
			});
		},

		dateFormatterForPost: function (oValue) {

			if (oValue !== null) {
				var date = oValue;
				var m = String(date).slice(4, 15).replace(/ /g, "/").slice(0, 3);
				var d = String(date).slice(4, 15).replace(/ /g, "/").slice(4, 6);
				var y = String(date).slice(4, 15).replace(/ /g, "/").slice(7, 15);
				switch (m) {
				case 'Jan':
					m = "01";
					break;
				case "Feb":
					m = "02";
					break;
				case "Mar":
					m = "03";
					break;
				case "Apr":
					m = "04";
					break;
				case "May":
					m = "05";
					break;
				case "Jun":
					m = "06";
					break;
				case 'Jul':
					m = "07";
					break;
				case "Aug":
					m = "08";
					break;
				case "Sep":
					m = "09";
					break;
				case "Oct":
					m = "10";
					break;
				case "Nov":
					m = "11";
					break;
				case "Dec":
					m = "12";
					break;
				default:
					break;
				}
				return y + m + d;
			}

		},

		getErrorDetails: function (error, data) {
			var audio = new Audio(this.path);
			audio.play();
			jQuery.sap.delayedCall(5000, this, function () {
				this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
			});
			if (JSON.parse(error.responseText).error.innererror.errordetails.length > 1) {
				var x = JSON.parse(error.responseText).error.innererror.errordetails;
				var details = '<ul>';
				var y = '';
				if (x.length > 1) {
					for (var i = 0; i < x.length - 1; i++) {
						y = '<li>' + x[i].message + '</li>' + y;
					}
				}
				details = details + y + "</ul>";

				MessageBox.error(data, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					details: details,
					contentWidth: "100px",
					onClose: function (oAction) {
						if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
							document.activeElement.blur();
						}
					}.bind(this)
				});
			} else {
				MessageBox.error(JSON.parse(error.responseText).error.message.value, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					details: details,
					contentWidth: "100px",
					onClose: function (oAction) {
						if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
							document.activeElement.blur();
						}
					}.bind(this)
				});
			}
		},

		dateFormatter: function (oValue) {
			debugger;
			if (oValue !== "") {
				var y = oValue.slice(0, 4);
				var m = oValue.slice(4, 6);
				var d = oValue.slice(6, 8);
				return d + "." + m + "." + y;
			} else {
				return "";
			}
		},

		dateFormatterForPostString: function (oValue) {
			debugger;
			if (oValue !== "") {
				var y = oValue.split(".")[2];
				var m = oValue.split(".")[1];
				var d = oValue.split(".")[0];
				return y + "" + m + "" + d;
			} else {
				return "";
			}
		},

		onPressPost: function () {
			var count = this.getFormField(this.byId("idConfirmation").getContent());
			if (count > 0) {
				MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("fillallmandatory"));
				return;
			}
			var sData = this.getOwnerComponent().getModel("confirmationModel").getData();
			if (sData.CONFIRMATION == "Y") {
				sData.CONFIRMATION = "";
			}
			if (sData.POSTINGDATE.indexOf(".") > 0) {
				sData.POSTINGDATE = this.dateFormatterForPostString(sData.POSTINGDATE);
			}

			this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
			this.getOwnerComponent().getModel().create("/PROCESSORDERCONFIRMSet", sData, {
				success: function (oData, oResponse) {
					debugger;
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.success(oData.MESSAGE, {
						icon: MessageBox.Icon.Success,
						title: "Success",
						contentWidth: "100px",
						onClose: function (oAction) {
							if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
								this.byId("confirmationType").setSelectedKey("Y");
								jQuery.sap.delayedCall(400, this, function () {
									this.byId("prcessOrder").focus();
								});

								this.getOwnerComponent().getModel("settingsModel").setProperty("/enablePost", false);
								this.getOwnerComponent().getModel("settingsModel").setProperty("/visiblerestdata", false);
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFIRMATION", "Y");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/PROCESSORDER", "");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/PHASE", "");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/YIELD", "");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/YUNIT", "");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFACTIVITY1", "");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/CON1UNIT", "");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/CONFACTIVITY2", "");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/CON2UNIT", "");
								this.getOwnerComponent().getModel("confirmationModel").setProperty("/POSTINGDATE", "");
								this.getOwnerComponent().getModel("confirmationModel").refresh();
								this.getOwnerComponent().getModel("confirmationModel").updateBindings();
							}
						}.bind(this)
					});
				}.bind(this),
				error: function (error) {
					debugger;
					this.getOwnerComponent().getModel("confirmationModel").setProperty("/POSTINGDATE", this.dateFormatter(this.getOwnerComponent()
						.getModel("confirmationModel").getProperty("/POSTINGDATE")));
					this.getErrorDetails(error, this.getOwnerComponent().getModel("i18n").getResourceBundle()
						.getText(
							"error"));
				}.bind(this)
			});
		},

		getFormField: function (oFormContent) {
			var c = 0;
			for (var i = 0; i < oFormContent.length; i++) {
				if ((oFormContent[i].getMetadata()._sClassName === "sap.m.Input" || oFormContent[i].getMetadata()._sClassName ===
						"sap.m.DatePicker") && oFormContent[i].getVisible() === true && oFormContent[i].getRequired() === true) {
					if (oFormContent[i].getValue() == "") {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"isX"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				} else if (oFormContent[i].getMetadata()._sClassName === "sap.m.ComboBox" && oFormContent[i].getVisible() === true &&
					oFormContent[
						i].getRequired() === true) {
					if (oFormContent[5].getValue() == "") {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText(
								"isX"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				}
			}
		},

	});

});