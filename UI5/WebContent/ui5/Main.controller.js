var bd;
var user;
var Nsol;
var listaCheq;
var tiplist;
var sociedad;

var combo = new Array();
var camposCombo = new Array();
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

//Creacion del arreglo de secciones dela pagina
//in: secciones(arreglo de secciones ya creadas), seccion(nueva seccion a crear)
//out: arreglo de secciones nuevas
function VerificarSecciones(secciones, seccion) {
	var validar = false;
	for (var i = 0; i < secciones.length; i++) {
		if (seccion === secciones[i]) {
			validar = true;
		}
	}
	if (!validar) {
		secciones[secciones.length] = seccion;
	}
	return secciones;
}

//Creacion de los campos tipo texbox alfanumericos
//in:nombre(descripcion del campo), obligatorio(true o false), panel(panel o seccion al que se encuentra asociado), id, size(tamaño maximo del campo)
function CrearAlfanumerico(nombre, obligatorio, panel, id, size) {
	var oLabel = new sap.ui.commons.Label({
		text: nombre + "",
		required: obligatorio,
		width: '100%'
	});

	var oInput = new sap.ui.commons.TextField({
		labelFor: oLabel,
		width: '100%',
		required: true,
		name: id,
		change: function() {
			if (this.getValue().trim() === "" && obligatorio || this.getValue().length > size) {
				this.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.setValueState(sap.ui.core.ValueState.None);
			}
		}
	});

	var sHtml = "campo Alfanumerico!!";
	var oRttTextField = new sap.ui.commons.RichTooltip({
		text: sHtml
	});
	oInput.setTooltip(oRttTextField);
	oLabel.placeAt(panel.getId());
	oInput.placeAt(panel.getId());

}

//Verificacion de cadenas, para saber si es un numero
//in: numero
//out: true(es numero) o false(no es numero)
function verificarnumerico(numero) {
	if (!/^([0-9])*$/.test(numero)) {
		return true;
	}
	return false;
}

//Verificacion de todos los campos del formulario para que cada uno tenga el formato, el tamaño y la obligatoriedad correspondiente
//in: data(cada campo del formulario)
//out: true(si todos los campos estan correctos), false(si por lo menos alguno esta mal)
function VerficarCampos(data) {
	var i = 0;
	for (var Data in data) {
		//si el campos es un adescripcion no se toma en cuenta para la evaluacion
		if (data[i].U_tipoCampo !== "Descripcion") {
			var name = data[i].U_campoDB;
			var resp = document.getElementsByName(name)[0].value;
			if ((resp.trim() === "" && data[i].U_oblig === "N") || resp.trim() !== "") {
				if (data[i].U_tipoCampo === "Numerico") {
					if (verificarnumerico(resp)) {
						this.mensaje("Error", "Verifique que el campo " + data[i].U_descCampo + "sea del tipo correspondiente.");
						return false;
					}
					if (resp.length > data[i].SIZ) {
						this.mensaje("Error", "el campo " + data[i].U_descCampo + " tiene un maximo de " + data[i].SIZ + " caracteres.");
						return false;
					}
				} else {
					if (data[i].U_tipoCampo === "Texto") {
						if (resp.length > data[i].SIZ) {
							this.mensaje("Error", "el campo " + data[i].U_descCampo + " tiene un maximo de " + data[i].SIZ + " caracteres.");
							return false;
						}
					}
					if (data[i].U_tipoCampo === "Hora") {
						var patron = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
						if (!patron.test(resp.trim())) {
							this.mensaje("Error", "Verifique el formato del campo " + data[i].U_descCampo);
							return false;
						}
					}
				}
			} else {
				this.displayListener("Error", "Verifique que el campo " + data[i].U_descCampo + " este diligenciado.", "e");
				return false;
			}

		}
		i++;
	}
	return true;
}

//Creacion de campo tipo numerico
//in:nombre(descripcion del campo), obligatorio(true o false), panel(panel o seccion al que se encuentra asociado), id, size(tamaño maximo del campo)
function CrearNumerico(nombre, obligatorio, panel, id, size) {
	var sHtml = "Campo numerico";
	var oLabel = new sap.ui.commons.Label({
		text: nombre + "",
		required: obligatorio,
		width: '100%'
	});
	var oInput = new sap.ui.commons.TextField({
		labelFor: oLabel,
		width: '100%',
		required: true,
		type: "number",
		name: id,
		change: function() {
			if (this.getValue().trim() === "" && obligatorio || this.getValue().length > size) {
				this.setValueState(sap.ui.core.ValueState.Error);
			} else if (verificarnumerico(this.getValue().trim())) {
				this.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.setValueState(sap.ui.core.ValueState.None);
			}
		}
	});
	var oRttTextField = new sap.ui.commons.RichTooltip({
		text: sHtml
	});
	oInput.setTooltip(oRttTextField);
	oLabel.placeAt(panel.getId());
	oInput.placeAt(panel.getId());

}

//Creacion de campos tipo fechas (datepicker)
//in:nombre(descripcion del campo), obligatorio(true o false), panael(panel o seccion al que se encuentra asociado), id)
function CrearFechas(nombre, obligatorio, panel, id) {
	var oLabel = new sap.ui.commons.Label({
		text: nombre + "",
		required: obligatorio,
		width: '100%'
	});

	var oDatePicker1 = new sap.ui.commons.DatePicker({
		name: id,
		locale: "de",
		disabled: true,
		width: "50%",
		value: {
			type: new sap.ui.model.type.Date({
				source: {
					pattern: "yyyyMMdd"
				},
				pattern: "yyyy.MM.dd"
			})
		}
	});
	oDatePicker1.setYyyymmdd("20170101");
	oDatePicker1.attachChange(
		function(oEvent) {
			if (oEvent.getParameter("invalidValue")) {
				oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
			} else {
				oEvent.oSource.setValueState(sap.ui.core.ValueState.None);
			}
		}
	);

	oLabel.placeAt(panel.getId());
	oDatePicker1.placeAt(panel.getId());

}

//Creacion de campos tipo check
//in:nombre(descripcion del campo), obligatorio(true o false), panael(panel o seccion al que se encuentra asociado), id
function CreaCheck(nombre, obligatorio, panel, id) {
	var Check = new sap.ui.commons.CheckBox({
	    id: id,
		name: id,
		text: nombre,
		width: '100%',
		tooltip: nombre,
		checked: false
		
	});
	Check.placeAt(panel.getId());
}

//Creacion de campos tipo hora
//in:nombre(descripcion del campo), obligatorio(true o false), panael(panel o seccion al que se encuentra asociado), id
function CrearHora(nombre, obligatorio, panel, id) {
	//exprecion regular pra verificar el formato de la hora
	var patron = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

	var oLabel = new sap.ui.commons.Label({
		text: nombre + "",
		required: obligatorio,
		width: '100%'
	});
	jQuery.sap.require("sap.ui.core.format.DateFormat");
	var oDateFormat = sap.ui.core.format.DateFormat.getTimeInstance({
		pattern: "hh:mm"
	});
	var oDate = new Date();
	var oField = new sap.ui.commons.TextField({
		name: id,
		tooltip: "hh:mm (24h)",
		change: function() {
			if (this.getValue().trim() === "" && obligatorio || this.getValue().length > 8) {
				this.setValueState(sap.ui.core.ValueState.Error);
			} else if (!patron.test(this.getValue().trim())) {
				this.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.setValueState(sap.ui.core.ValueState.None);
			}
		}
	});
	oField.setValue(oDateFormat.format(oDate)); // Set the formatted value on the text field
	oField.attachChange(function() {
		oDate = oDateFormat.parse(oField.getValue());
	});

	oLabel.placeAt(panel.getId());
	oField.placeAt(panel.getId());

}

//Creacion de capos tipo combobox
//in:nombre(descripcion del campo), obligatorio(true o false), panael(panel o seccion al que se encuentra asociado), id, valores(valores para la lista de seleccion)
function crearSelect(nombre, obligatorio, panel, id, valores) {
	var items = new Array();
	var ids = new Array();
	var oLabel = new sap.ui.commons.Label({
		text: nombre + "",
		required: obligatorio,
		width: '50%'
	});
	var oListBox1 = new sap.ui.commons.ListBox();

	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(valores);
	for (var Data in oModel.oData) {
		var model = oModel.oData[parseInt(Data)];
		var item = new sap.ui.core.ListItem({
			text: model.Descr,
			additionalText: model.FldValue
		});

		oListBox1.addItem(item);
		items.push(model.Descr);
		ids.push(model.FldValue);
	}
	var camposCombo = {
		campo: id,
		datos: items,
		id: ids
	};
	combo.push(camposCombo); // Create a ComboBox
	var oComboBox2 = new sap.ui.commons.ComboBox(id, {
		name: id,
		tooltip: nombre,
		width: '50%',
		displaySecondaryValues: true,
		"association:listBox": oListBox1
	});

	oLabel.placeAt(panel.getId());
	oComboBox2.placeAt(panel.getId());
	document.getElementsByName(id).disabled = true;

}

//Creacion de una descripcion o texto en el formulario
//in:nombre(descripcion del campo), obligatorio(true o false), panael(panel o seccion al que se encuentra asociado)
function CrearDescripcion(nombre, obligatorio, panel) {
	var oLabel = new sap.ui.commons.TextView({
		text: nombre + "",
		width: '100%',
		height: '100%',
		design: sap.ui.commons.TextViewDesign.Bold
	});
	oLabel.placeAt(panel.getId());
}

//Busqueda de los valores validos para los campos tipo combo, que estan asociados a una tabla 
//in:nombre(descripcion del campo), obligatorio(true o false), panael(panel o seccion al que se encuentra asociado), id, tabla(tabla de la bd a la cual se encuebtra asociado el combo)
function obtenervaloresValidosTabla(nombre, obligatorio, panel, id, tabla) {
	$.ajax({
		method: "GET",
		url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=obtenerCamposSelectTabla" + "&AliasID=" + id + "&tabla=" + tabla +
			"&bd=" + bd,
		dateType: 'json',
		async: false,
		success: function(data) {
			crearSelect(nombre, obligatorio, panel, id, data);
		},
		error: function(xhr, status, error) {
			displayListener("Error!!, el campo " + nombre + " no encuentra su tabla Vinculada, virifique su parametrización en SAP.", "e");
		}
	});
}

//Busqueda de los valores validos para los combos, los cuales noe stan asociados a una tbal, pero contienen valores validos
//in:nombre(descripcion del campo), obligatorio(true o false), panael(panel o seccion al que se encuentra asociado), id
function obtenervaloresValidos(nombre, obligatorio, panel, id) {
	$.ajax({
		method: "GET",
		url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=obtenerCamposSelect" + "&AliasID=" + id + "&bd=" + bd,
		dateType: 'json',
		async: false,
		success: function(data) {
			crearSelect(nombre, obligatorio, panel, id, data);
		},
		error: function(xhr, status, error) {
			displayListener("Error!!, el campo " + nombre + " no encuentra sus valores validos, virifique su parametrización en SAP.", "e");
		}
	});
}

//carga y Actualiza los campos en sap 
//in: data(cada campo del formulario)
function CargarCampos(data) {
	var i = 0;
	var Json = "";

	for (var Data in data) {
		if (data[i].U_tipoCampo !== "Descripcion") {
			var name = data[i].U_campoDB;
			var resp = document.getElementsByName(name)[0].value;
			if (resp.trim() !== "") {
				if (data[i].U_tipoCampo === "Hora") {
					resp = resp.replace(":", "");
				} else if (data[i].U_tipoCampo === "Combo") {
					var datosSelect = Selectcontiene(name);
					if (datosSelect !== "") {
						for (var j = 0; j < datosSelect.datos.length; j++) {
							if (document.getElementsByName(name)[0].value === datosSelect.datos[j] + "") {
								resp = datosSelect.id[j];
								break;
							}
						}
					}

				}else if(data[i].U_tipoCampo === "Check"){
				    var Check = sap.ui.getCore().byId(name);
                    if(Check.getChecked()){
                        resp="SI";
                    }else{
                       resp="NO"; 
                    }
				}
				Json += "U_" + name + ":" + resp + ",";
			}
		}
		i++;
	}

	$.ajax({
		method: "GET",
		url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=update" + "&datos=" + Json + "&docE=" + listaCheq + "&bd=" + bd,
		dateType: 'json',
		success: function() {
			displayListener("Numero de solicitud: " + Nsol + " Actualizado exitosamente!!", "c");
		},
		error: function(xhr, status, error) {
			displayListener("Error actualizando los datos de la solicitud " + Nsol + "!!, Intente cargar de nuevo la pagina", "e");
		}
	});



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

//Ordena los campos de menor a mayor segun su orden parametrizado en SAP
//in: datos(campos del formulario)
//out: arreglo con los campos ordenados
function ordenarCampos(datos) {
	var m = 0;
	for (var Data in datos) {
		m++;
	}

	for (var i = 1; i < m; i++) {
		for (var j = 0; j < (m - i); j++) {
			var d1 = datos[j].U_orden;
			var d2 = datos[j + 1].U_orden;
			if (d1 > d2) {
				var k = datos[j + 1];
				datos[j + 1] = datos[j];
				datos[j] = k;
			}
		}
	}
	return datos;

}

//Verifica si un select contiene un dato dentro de su lista de seleccion
//in: dato
//out: dato del selct con sus respectivos valores asociados
function Selectcontiene(dato) {
	for (var i = 0; i < combo.length; i++) {
		if (combo[i].campo == dato) {
			return combo[i];
		}
	}
	return "";
}

//Busca el numero de solicitud que se encuentra asociado al formulario e incerta los valores de esta en sus repectivos campos
function buscarNSOL() {
	$.ajax({
		method: "GET",
		url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=buscar" + "&Nsol=" + Nsol + "&bd=" + bd + "&tipList=" + tiplist,
		dateType: 'json',
		success: function(data) {
		    alert(JSON.stringify(data));
			var valor = [];
			for (var item in data.datos[0]) {
				valor.push(data.datos[0][item]);
			}
			if (valor.length > 0) {
				for (var i in data.campo) {
					var value = valor[parseInt(i)];
					var datosSelect = Selectcontiene(data.campo[parseInt(i)].U_listcheq);
					if (datosSelect !== "") {
						for (var j = 0; j < datosSelect.datos.length; j++) {
							if (value === datosSelect.id[j] + "") {
								document.getElementsByName(data.campo[parseInt(i)].U_listcheq)[0].value = datosSelect.datos[j];
								break;
							}
						}
					} else {
						var id = document.getElementsByName(data.campo[parseInt(i)].U_listcheq)[0].id;

						if (id.indexOf("picker") !== -1) {
							value = value.substring(0, 10);
							id = id.replace("-input", "");
							document.getElementById(id).style.background = "#f7f7f7";
							document.getElementById(id).disabled = true;
						}
						document.getElementsByName(data.campo[parseInt(i)].U_listcheq)[0].value = value;
					}
					document.getElementsByName(data.campo[parseInt(i)].U_listcheq)[0].disabled = true;
					document.getElementsByName(data.campo[parseInt(i)].U_listcheq)[0].style.background = "#f7f7f7";
				}
				document.getElementsByName("OK1_SF_NSOL")[0].value = Nsol;
				document.getElementsByName("OK1_SF_NSOL")[0].disabled = true;
				document.getElementsByName("OK1_SF_NSOL")[0].style.background = "#f7f7f7";
				CamposDigilenciados();
			} else {
				mensaje("Error!! ", "Verifique que el numero de solicitud exista");
			}

		},
		error: function(xhr, status, error) {
			mensaje("Error!!, Intentando traer los datos!!");
		}
	});

}

//Dar formato hora a un numero dado 
//in: num(al cual se le va a dar el formato);
//out: numero con formto hh:mm (24 h)
function darFormatoHora(num){
    var hora="";
    if(num.length===3){
        hora="0"+num;
    }else{
        hora= num;
    }
    var hh=hora.substring(0,2);
    var mm=hora.substring(2,5);
        
    return hh+":"+ mm;
    
}
//Obtener los campos de la lista de chequeo asociada en SAP y asignarlos a los campos correspondientes
function CamposDigilenciados() {
	$.ajax({
		method: "GET",
		url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=buscarDatosLch" + "&numlist=" + listaCheq + "&bd=" + bd +
			"&tipList=" + tiplist,
		dateType: 'json',
		success: function(data) {
			var valor = [];
			for (var item in data.datos[0]) {
				valor.push(data.datos[0][item]);
			}
			if (valor.length > 0) {
				for (var i in data.campo) {
					var value = valor[parseInt(i)];
					if (valor !== null) {
						if (data.campo[parseInt(i)].U_tipoCampo == "Hora") {
                            value=darFormatoHora(value+"");
                            document.getElementsByName(data.campo[parseInt(i)].U_campoDB)[0].value = value;
						} else if (data.campo[parseInt(i)].U_tipoCampo == "Check") {
                            if(value=="SI"){
                                var Check = sap.ui.getCore().byId(data.campo[parseInt(i)].U_campoDB);
                                Check.setChecked(true);
                            }else{
                              var Check = sap.ui.getCore().byId(data.campo[parseInt(i)].U_campoDB);
                                Check.setChecked(false); 
                            }
                            
						} else {
							var datosSelect = Selectcontiene(data.campo[parseInt(i)].U_campoDB);
							if (datosSelect !== "") {
								for (var j = 0; j < datosSelect.datos.length; j++) {
									if (value === datosSelect.id[j] + "") {
										document.getElementsByName(data.campo[parseInt(i)].U_campoDB)[0].value = datosSelect.datos[j];
										break;
									}
								}
							} else {
								var id = document.getElementsByName(data.campo[parseInt(i)].U_campoDB)[0].id;
								if (id.indexOf("picker") !== -1) {
									value = value.substring(0, 10);
								}
								document.getElementsByName(data.campo[parseInt(i)].U_campoDB)[0].value = value;
							}
							
						}
						

					}
				}

			} else {
				mensaje("Error!! ", "Verifique que el numero de solicitud exista");
			}
		},
		error: function(xhr, status, error) {
			mensaje("Error!!, Intentando traer los datos!!");
		}
	});

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

sap.ui.controller("ui5.Main", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf ui5.Main
	 */
	onInit: function() {
		if (document.cookie === "") {
			window.location.href = "login.html";
		}
		bd = leerCookie("company");
		user = leerCookie("usuario");
		Nsol = leerCookie("Nsol");
		listaCheq = leerCookie("Numlist");
		tiplist = leerCookie("Tiplist");
		sociedad = leerCookie("sociedad");
		//Petición que me obtiene todos los campos parametrizados en SAP
		$.ajax({
			method: "GET",
			url: "http://192.168.1.5:8000/ListasOlivosWEB/Modelo/Campos.xsjs?cmd=campos" + "&bd=" + bd + "&lista=" + tiplist,
			/*data: {
				TipoLista: "1"
			},*/
			dateType: 'json',
			success: this.MostarCampos,
			error: function(xhr, status, error) {
				mensaje("Error!!", "Verifique su parametrizacion en SAP e Intente cargar de nuevo la pagina.");
			}
		});

	},

	//Despliega el shell principal, y todos los campos del formulario que se encuentran parametrizados en SAP
	MostarCampos: function(data) {

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(data);
		sap.ui.getCore().setModel(oModel);
		//panel principal de la aplicacion
		var oPanel = new sap.ui.ux3.Shell("myShell", {
			showSearchTool: false,
			showFeederTool: false,
			appTitle: "Usuario: " + user + "            Compañia: " + sociedad, // give a title
			worksetItems: [ // add some items to the top navigation
		new sap.ui.ux3.NavigationItem({
					key: "wi_home",
					text: "LISTA DE CHEQUEO - CONFORMIDAD DEL SERVICIO"
					/*	subItems: [ // the "Home" workcenter also gets three sub-items
			new sap.ui.ux3.NavigationItem({
							key: "wi_home_overview",
							text: "Overview"
						})
		]*/
				})

	],
			//Boton para regresar a buscar otra solicitud
			toolPopups: [new sap.ui.ux3.ToolPopup("BuscarNsol", {
				title: "Buscar otra solicitud",
				tooltip: "Regresar y buscar otra solicitud",
				icon: "../Imagenes/search.png",
				iconHover: "../Imagenes/search.png",
				content: [new sap.ui.commons.TextView({
					text: "Regresar y buscar otro numero de solicitud."
				})],
				buttons: [new sap.ui.commons.Button("BuscarNSOl", {
					text: "Ok",
					press: function(oEvent) {
						window.location.href = "index2.html";
					}
				})]
			})],
			//realizar logaut en la plicacion 
			logout: function() { // create a handler function and attach it to the "logout" event
				eliminarCookie("company");
				eliminarCookie("usuario");
				eliminarCookie("Nsol");
				eliminarCookie("Numlist");
				eliminarCookie("Tiplist");
				eliminarCookie("sociedad");
				bd = "";
				user = "";
				Nsol = "";
				listaCheq = "";
				tiplist = "";
				sociedad = "";
				window.location.href = "login.html";
			}

		});
		oPanel.placeAt("content");
		var button = new sap.ui.commons.Button({
			text: "Guardar",
			helpId: "Guardar Datos",
			style: sap.ui.commons.ButtonStyle.Emph,
			press: function() {
				if (VerficarCampos(oModel.oData)) {
					CargarCampos(oModel.oData);
				}
			}
		});
		button.placeAt(oPanel.getId());
		var secciones = [];
		var paneles = [];
		//Permite realizar el llenado del array de las secciones
		for (var Data in oModel.oData) {
			secciones = VerificarSecciones(secciones, oModel.oData[parseInt(Data)].U_nomSeccion);
		}
		//Recorrer las secciones y empezar el proceso de creación 
		for (var i = 0; i < secciones.length; i++) {
			var Title = new sap.ui.commons.Title({
				text: secciones[i]
			});
			//Seccione
			var oPanel1 = new sap.ui.commons.Panel({
				enabled: false,
				Width: '70%'

			});
			oPanel1.setTitle(Title);
			var modelo1 = ordenarCampos(oModel.oData);
			//Recorre todos los campos paramertizados en SAP y realiza la creacion de cada uno segun su tipo, y lo asocia a su respectiva sección 
			for (var Data in oModel.oData) {
				var oblig = false;
				var model = oModel.oData[parseInt(Data)];
				if (model.U_nomSeccion == secciones[i]) {
					if (model.U_oblig === "Y") {
						oblig = true;
					}
					//Se realiza el llamado a las diferentes craciones dependiendo el tipo del campo
					if (model.U_tipoCampo === "Texto") {
						CrearAlfanumerico(model.U_descCampo, oblig, oPanel1, model.U_campoDB, model.SIZ);
					} else if (model.U_tipoCampo === "Numerico") {
						CrearNumerico(model.U_descCampo, oblig, oPanel1, model.U_campoDB, model.SIZ);
					} else if (model.U_tipoCampo === "Fecha") {
						CrearFechas(model.U_descCampo, oblig, oPanel1, model.U_campoDB);
					} else if (model.U_tipoCampo === "Check") {
						CreaCheck(model.U_descCampo, oblig, oPanel1, model.U_campoDB);
					} else if (model.U_tipoCampo === "Hora") {
						CrearHora(model.U_descCampo, oblig, oPanel1, model.U_campoDB);
					} else if (model.U_tipoCampo === "Combo") {
						if (model.U_TablaVinculada !== null) {
							obtenervaloresValidosTabla(model.U_descCampo, oblig, oPanel1, model.U_campoDB, model.U_TablaVinculada);
						} else {
							obtenervaloresValidos(model.U_descCampo, oblig, oPanel1, model.U_campoDB);
						}

					} else if (model.U_tipoCampo === "Descripcion") {
						CrearDescripcion(model.U_descCampo, oblig, oPanel1);
					}
				}
			}
			//Se agrega al arreglo de paneles el panel auxiliar
			paneles[i] = oPanel1;
			//Se agrega el panel o seccion al panel global
			paneles[i].placeAt(oPanel.getId());
		}
		//Boton para guardar los datos
		
		buscarNSOL();
	}

	//	onInit: function() {
	//
	//	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf ui5.Main
	 */
	/*onBeforeRendering: function() {
		
	}*/

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf ui5.Main
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf ui5.Main
	 */
	//	onExit: function() {
	//
	//	}

});