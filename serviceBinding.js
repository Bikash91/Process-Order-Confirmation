function initModel() {
	var sUrl = "/NLDEV/odata/SAP/ZWMS_UPL_PO_CONFIRMATION_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}