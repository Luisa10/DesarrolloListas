//Obtiene los campos y sus respectivos datos los cuales se encuentran parametrizados en sap
function showData() {
	$.import("ListasOlivosWEB.lib", "campos");
}
//Realiza update 
function Update() {
	$.import("ListasOlivosWEB.lib", "update");
}

function buscar() {
	$.import("ListasOlivosWEB.lib", "Buscar");
}

function obtenerCamposSelect() {
	$.import("ListasOlivosWEB.lib", "datosSelect");
}

function obtenerCamposSelectTabla() {
	$.import("ListasOlivosWEB.lib", "datosSelectTabla");
}
function solicitudesAbiertas() {
	$.import("ListasOlivosWEB.lib", "solicitudesAbiertas");
}
function DatosSolicitud(){
	$.import("ListasOlivosWEB.lib", "datosSolicitud");
}
function DatosSociedades(){
	$.import("ListasOlivosWEB.lib", "datosSociedades");
}
function DatosUsuario(){
    $.import("ListasOlivosWEB.lib", "datosUsuario");
}
function buscarDatosLch(){
    $.import("ListasOlivosWEB.lib", "buscarDatosLch");
}
//aCmd clasifica la petición para redirigirlo al metodo correspondiente
var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "campos":
		showData();
		break;
	case "update":
		Update();
		break;
	case "buscar":
		buscar();
		break;
	case "obtenerCamposSelect":
		obtenerCamposSelect();
		break;
	case "obtenerCamposSelectTabla":
		obtenerCamposSelectTabla();
		break;
	case "solAbiertas":
		solicitudesAbiertas();
		break;
	case "datosSolicitud":
		DatosSolicitud();
		break;
	case "datosSociedades":
		DatosSociedades();
		break;
	case "datosUsuario":
		DatosUsuario();
		break;
	case "buscarDatosLch":
		buscarDatosLch();
		break;
	default:
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody('Comando invalido' + aCmd);

}