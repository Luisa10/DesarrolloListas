var bd;
var oPanel;
var user;
var numlist;
var tiplist;
var sociedad;
var bolnumlist = true;
var boltiplist = true;

var oLabel1 = new sap.ui.commons.Label({
	width: '100%'
});
var oLabel2 = new sap.ui.commons.Label({
	width: '100%'
});
var oLabel3 = new sap.ui.commons.Label({
	width: '100%'
});
var oLabel4 = new sap.ui.commons.Label({
	width: '100%'
});
var oLabel5 = new sap.ui.commons.Label({
	width: '100%'
});
// Creación de la barra de notificación de la pagina
var oNotiBar1 = new sap.ui.ux3.NotificationBar({
	display: "default",
	visibleStatus: "None",
	resizeEnabled: true

});
var oNotifierErr = new sap.ui.ux3.Notifier({
	title: "Notificaciones",
	icon: "../Imagenes/error.png"
});
var oNotifierSucc = new sap.ui.ux3.Notifier({
	title: "Notificaciones",
	icon: "../Imagenes/success.png"
});

// Creacion de los mensajes en la barra de notificacines
//in: mensaje, tipo(e: error, c: correcto)
function displayListener(mensaje, tipo) {
	var now = (new Date()).toUTCString();
	var oMessage = new sap.ui.core.Message({
		text: mensaje,
		timestamp: now
	});
	if (tipo === "e") {
		oMessage.setLevel(sap.ui.core.MessageType.Error);
		var oMessageNotifier = new sap.ui.ux3.Notifier({
			title: "Error"
		});
		oMessageNotifier.addMessage(oMessage);
		oNotifierErr.addMessage(oMessage);
		oNotiBar1.addNotifier(oNotifierErr);
		oNotiBar1.setMessageNotifier(oMessageNotifier);
	} else if (tipo === "c") {
		oMessage.setLevel(sap.ui.core.MessageType.Success);
		var oMessageNotifier = new sap.ui.ux3.Notifier({
			title: "Correcto"
		});
		oMessageNotifier.addMessage(oMessage);
		oNotifierSucc.addMessage(oMessage);
		oNotiBar1.addNotifier(oNotifierSucc);
		oNotiBar1.setMessageNotifier(oMessageNotifier);
		
	}
	var sStatus = sap.ui.ux3.NotificationBarStatus.Default;
	oNotiBar1.setVisibleStatus(sStatus);
	oNotiBar1.placeAt("content2");
}

//Busqueda de los datos asociados a la solicitud
//in: sol(numero de solicitud)
function datosSolicitud(sol) {
	$.ajax({
		method: "GET",
		url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=datosSolicitud" + "&bd=" + bd + "&sol=" + sol,
		/*data: {
				TipoLista: "1"
			},*/
		dateType: 'json',
		success: function(data) {
			Datos(data);
		},
		error: function(xhr, status, error) {
			displayListener("Error!!, Verifique que el numero de solicitud exista.", "e");
		}
	});
}

//Despliega los datos del fallecido asociados a la solicitud, ademas verifica si esta solicitud tiene tipo y lista de chequeo asociada
//in: data(datos de la solicitud obtenidos en un json)
function Datos(data) {
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(data);
	bolnumlist = true;
	boltiplist = true;
	oLabel1.setText("Nombre del fallecido: " + oModel.oData[0].U_NombreFa);
	oLabel2.setText("Identificación: " + oModel.oData[0].U_IdFallec);
	oLabel3.setText("Fecha de nacimiento: " + oModel.oData[0].U_FechaNac.substring(0, 10));
	oLabel4.setText("Fecha de fallecimiento:" + oModel.oData[0].U_FechaFal.substring(0, 10));
	oLabel5.setText("Hora de fallecimiento:" + oModel.oData[0].U_HoraFall);
	numlist = oModel.oData[0].U_numListCh;
	tiplist = oModel.oData[0].U_tipListCh;
	if (numlist === null) {
		displayListener("El servicio funerario de "+oModel.oData[0].U_NombreFa+" no tiene asociada ninguna lista de chequeo, verifique en SAP su parametrización", "e");
		bolnumlist = false;

	}
	if (tiplist === null) {
		displayListener("El servicio funerario de "+oModel.oData[0].U_NombreFa+" no tiene asociado ningun tipo de lista de chequeo, verifique en SAP su parametrización", "e");
		boltiplist = false;
	} else if (tiplist !== null && numlist !== null) {
		displayListener("El servicio funerario de "+oModel.oData[0].U_NombreFa+" es optimo!!", "c");

	}

}

//busca una coopkie dentro del formulario
//in: nombre(nombre de la cookie a buscar)
//out: valor(valor asociado a la cookie)
function leerCookie(nombre) {
	var lista = document.cookie.split(";");
	var micookie;
	for (var i in lista) {
		var busca = lista[i].search(nombre);
		if (busca > -1) {
			micookie = lista[i];
		}
	}
	var igual = micookie.indexOf("=");
	var valor = micookie.substring(igual + 1);
	return valor;
}

//Elimina una cookie dentro de formulario
// in: key(nombre asociado a la cookie)
function eliminarCookie(key) {
	return document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

}
//Creacion de mensajes emergentes para la pagina
//in: msj(mensaje), titulo(titulo del mensaje)
function mensaje(titulo, msj) {
	var oFirstDialog = new sap.ui.commons.Dialog({
		modal: true,
		text: titulo
	});
	oFirstDialog.setTitle(msj);
	oFirstDialog.addButton(new sap.ui.commons.Button({
		text: "OK",
		press: function() {
			oFirstDialog.close();
		}
	}));
	oFirstDialog.open();
}

sap.ui.controller("ui5.index2", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf ui5.index2
	 */
	onInit: function() {
		if (document.cookie == "") {
			window.location.href = "login.html";
		}
		bd = leerCookie("company");
		user = leerCookie("usuario");
		sociedad = leerCookie("sociedad");
		$.ajax({
			method: "GET",
			url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=solAbiertas" + "&bd=" + bd,

			dateType: 'json',
			success: this.mostrarSolicitudes,
			error: function(xhr, status, error) {
				mensaje("Error!!, No se encontraron solicitudes abiertas, verifique su parametrización e intente ingresar de nuevo la pagina.");
				eliminarCookie("company");
				eliminarCookie("usuario");
				eliminarCookie("sociedad");
				bd = "";
				user = "";
				sociedad = "";
				window.location.href = "login.html";
			}
		});
	},

	//
	mostrarSolicitudes: function(data) {
		oPanel = new sap.ui.ux3.Shell("myShell", {
			showFeederTool: false,
			showSearchTool: false,
			appTitle: "Usuario: " + user + "            Compañia: " + sociedad, // give a title
			worksetItems: [ // add some items to the top navigation
		new sap.ui.ux3.NavigationItem({
					key: "wi_home",
					text: "Seleccion de solicitud"
				})

	],
			logout: function() {
				eliminarCookie("company");
				eliminarCookie("usuario");
				eliminarCookie("sociedad");
				bd = "";
				user = "";
				sociedad = "";
				window.location.href = "login.html";
			}

		});

		var oLabel = new sap.ui.commons.Label({
			text: "Solicitudes de servicio",
			required: true,
			width: '50%'
		});
		var oListBox1 = new sap.ui.commons.ListBox();

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(data);
		for (var Data in oModel.oData) {
			var model = oModel.oData[parseInt(Data)];
			var item = new sap.ui.core.ListItem({
				text: model.DocEntry + " - " + model.U_NombreFa,
				key: model.DocEntry
			});
			oListBox1.addItem(item);

		}

		var oComboBox2 = new sap.ui.commons.ComboBox("solicitudes", {
			name: "solS",
			tooltip: "Solicitudes Abiertas",
			width: '50%',
			displaySecondaryValues: true,
			"association:listBox": oListBox1,
			change: function(oEvent) {
				datosSolicitud(oEvent.oSource.getSelectedKey());
			}
		});

		var button = new sap.ui.commons.Button({
			text: "Seleccionar",
			helpId: "Seleccionar solicitud",
			width: '100%',
			style: sap.ui.commons.ButtonStyle.Emph,
			press: function() {
			    var resp = document.getElementsByName("solS")[0].value;
				if (boltiplist && bolnumlist && resp!=="") {
					document.cookie = escape("Nsol") + "=" + escape(oComboBox2.getSelectedKey());
					document.cookie = escape("Tiplist") + "=" + escape(tiplist);
					document.cookie = escape("Numlist") + "=" + escape(numlist);
					window.location.href = "index.html";
				} else {
					mensaje("Error!", "Verifique que la solicitud de servicio tengas numero y tipo de lista asociado");
				}
			}
		});

		oLabel.placeAt(oPanel.getId());
		oComboBox2.placeAt(oPanel.getId());
		oLabel1.placeAt(oPanel.getId());
		oLabel2.placeAt(oPanel.getId());
		oLabel3.placeAt(oPanel.getId());
		oLabel4.placeAt(oPanel.getId());
		oLabel5.placeAt(oPanel.getId());
		button.placeAt(oPanel.getId());
		oPanel.placeAt("content");

	}

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf ui5.index2
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf ui5.index2
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf ui5.index2
	 */
	//	onExit: function() {
	//
	//	}

});