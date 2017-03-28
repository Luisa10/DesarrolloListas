var sociedad = "";
// Creación de la barra de notificación de la pagina
var oNotiBar1 = new sap.ui.ux3.NotificationBar({
	display: "default",
	visibleStatus: "None",
	resizeEnabled: true

});
// Creacion de los mensajes en la barra de notificacines
//in: mensaje
function displayListener(mensaje) {

	var sStatus = sap.ui.ux3.NotificationBarStatus.Default;
	oNotiBar1.setVisibleStatus(sStatus);
	/*
	 * Creating a notifier
	 */
	var oNotifier = new sap.ui.ux3.Notifier({
		title: "Notificaciones",
		icon: "../Imagenes/error.png"
	});
	var oMessageNotifier = new sap.ui.ux3.Notifier({
		title: "Error"
	});
	var now = (new Date()).toUTCString();
	var oMessage = new sap.ui.core.Message({
		text: mensaje,
		timestamp: now
	});
	oMessageNotifier.addMessage(oMessage);
	oNotifier.addMessage(oMessage);

	oMessage.setLevel(sap.ui.core.MessageType.Error);
	oNotiBar1.addNotifier(oNotifier);

	oNotiBar1.setMessageNotifier(oMessageNotifier);
	oNotiBar1.placeAt("content2");
}

//Funcion de login
function login() {
	$.ajax({
		type: "POST",
		url: "/../sap/sbo/platform/login",
		data: {
			"company": document.getElementsByName("company")[0].value,
			"username": $("#b1user").val(),
			"password": $("#b1pwd").val(),
			"language": "es-ES"
		},
		error: function(xhr, status, error) {
			//window.alert("login failed: " + xhr.responseText);
			displayListener("Error iniciando sesión, verifique que haya diligenciado todos los campos correctamente!!!");

		},
		//si las credenciales son correctas pasa a buscar los datos del usuario y si estos existen, se dirige a la siguiente pagina
		success: function() {
			$.ajax({
				method: "GET",
				url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=datosUsuario" + "&UCode=" + $("#b1user").val() + "&bd=" +
					document.getElementsByName("company")[0].value,
				dateType: 'json',
				success: function(data) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(data);
					document.cookie = escape("company") + "=" + escape(document.getElementsByName("company")[0].value);
					document.cookie = escape("usuario") + "=" + (oModel.oData[0].U_NAME);
					document.cookie = escape("sociedad") + "=" + (sociedad);

					window.location.href = "index2.html";
				},
				error: function(xhr, status, error) {
					//window.alert("login failed: " + xhr.responseText);
					displayListener("Error iniciando sesión!!!");
				}
			});

		}
	});
}

sap.ui.controller("ui5.Login", {

	//A iniciar el controlador se realiza la busqueda de las sociedades 
	onInit: function() {
		$.ajax({
			method: "GET",
			url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=datosSociedades",
			dateType: 'json',
			success: this.mostrarSociedades,
			error: function(xhr, status, error) {
				alert("Error!!, Verifique su parametrizacion en SAP e Intente cargar de nuevo la pagina.");
			}
		});

	},
//Despliega el shell principal, y todos los campos del formulario
	mostrarSociedades: function(data) {
		var oShell = new sap.ui.ux3.Shell("myShell", {
			showLogoutButton: false,
			showSearchTool: false,
			showFeederTool: false,
			appTitle: "Olivos", // give a title
			worksetItems: [ // add some items to the top navigation
		new sap.ui.ux3.NavigationItem({
					key: "wi_home",
					text: "LISTA DE CHEQUEO - CONFORMIDAD DEL SERVICIO"

				})
				]
		});
		var oPanel = new sap.ui.commons.Panel({

			align: "center",
			showCollapseIcon: false
		});
		oPanel.setTitle(new sap.ui.core.Title({
			text: "Login Listas chequeo Olivos",
			icon: "../Imagenes/SAPLogo.gif"
		}));

		oPanel.addStyleClass("myPanel");
		oPanel.setWidth('50%');

		var oLabel = new sap.ui.commons.Label({
			text: "Usuario",
			required: true,
			width: '100%'
		});

		var oInput = new sap.ui.commons.TextField({
			labelFor: oLabel,
			id: "b1user",
			width: '100%',
			required: true,
			name: "usuario",
			change: function() {
				if (this.getValue().trim() === "") {
					this.setValueState(sap.ui.core.ValueState.Error);
				} else {
					this.setValueState(sap.ui.core.ValueState.None);
				}
			}
		});

		var oLabel1 = new sap.ui.commons.Label({
			text: "Contraseña",
			required: true,
			width: '100%'
		});
    //Creacion de campo tipo password
		var oInput1 = new sap.ui.commons.PasswordField({
			id: "b1pwd",
			labelFor: oLabel,
			width: '100%',
			required: true,
			name: "Contraseña",
			change: function() {
				if (this.getValue().trim() === "") {
					this.setValueState(sap.ui.core.ValueState.Error);
				} else {
					this.setValueState(sap.ui.core.ValueState.None);
				}
			}
		});
		var oLabel2 = new sap.ui.commons.Label({
			text: "Compañia",
			required: true,
			width: '100%'
		});
		//se modela el json que trae las sociedades  y se recorre realizando la creacion de la lista de valores que se asociaran al campo
		var oListBox1 = new sap.ui.commons.ListBox();
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(data);
		for (var Data in oModel.oData) {
			var model = oModel.oData[parseInt(Data)];
			var item = new sap.ui.core.ListItem({
				text: model.dbName,
				key: model.cmpName
			});
			item.setAdditionalText(model.cmpName);
			oListBox1.addItem(item);

		}

		var oComboBox2 = new sap.ui.commons.ComboBox("solicitudes", {
			id: "company",
			width: '100%',
			required: true,
			name: "company",
			change: function() {
				sociedad = this.getSelectedKey();
				if (this.getValue().trim() === "") {
					this.setValueState(sap.ui.core.ValueState.Error);

				} else {
					this.setValueState(sap.ui.core.ValueState.None);
				}
			},
			displaySecondaryValues: true,
			"association:listBox": oListBox1

		});
    //Boton de login
		var button = new sap.ui.commons.Button({
			name: "login",
			text: "LOGIN",
			helpId: "login",
			width: '100%',
			style: sap.ui.commons.ButtonStyle.Emph,
			press: function() {
				login();
			}
		});
		//Se agregan todos los campos al panel principal
		oLabel2.placeAt(oPanel.getId());
		oComboBox2.placeAt(oPanel.getId());
		oLabel.placeAt(oPanel.getId());
		oInput.placeAt(oPanel.getId());
		oLabel1.placeAt(oPanel.getId());
		oInput1.placeAt(oPanel.getId());
		button.placeAt(oPanel.getId());
		oPanel.placeAt(oShell.getId());
		oShell.placeAt("content1");
	}

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf ui5.Login
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf ui5.Login
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf ui5.Login
	 */
	//	onExit: function() {
	//
	//	}

});