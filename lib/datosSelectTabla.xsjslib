    var id = $.request.parameters.get('AliasID');
	var tabla = $.request.parameters.get('tabla');
	var bd = $.request.parameters.get('bd');

	var query = "select \"Code\", \"Name\" from \""+bd+"\".\"@OK1_SF_LISCHEQ_VIN\" where \"U_tabla\"='" + tabla + "'";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);
	conn.commit();
	for (var i = 0; i < rs.length; i++) {
		var code = rs[i].Code;
		var descripcion = rs[i].Name;

	}

	var info = obtenerinformacion(tabla, id, descripcion, code);
	$.response.contentType = "application/json"; // Specify output
	$.response.setBody(JSON.stringify(info));
	$.response.status = $.net.http.OK;
	


function obtenerinformacion(tabla, id, descripcion, code) {
	var query = 'select \"' + descripcion + '\" as \"Descr\", \"' + code + '\" as \"FldValue\" from \"'+bd+'\".\"' + tabla+"\"";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);
	conn.commit();
	return rs;

}