sap.ui.jsview("ui5.Main", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf ui5.Main
	 */
	getControllerName: function() {
		return "ui5.Main";
	},

	/** Is initially
	 * called once after the Controller has been instantiated. It is the place where the UI is constructed.
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf ui5.Main
	 */
	createContent: function(oController) {

	}
});