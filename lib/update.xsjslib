	var datos = $.request.parameters.get('datos');
	var DocEntry = $.request.parameters.get('docE');
	var bd = $.request.parameters.get('bd');
	var data = datos.split(",");
	var query = 'UPDATE \"'+bd+'\".\"@OK1_SF_LISCHEQ_HEAD\" SET ';
	for (var i = 0; i < data.length - 1; i++) {
		var parametros = data[i].split(":");
		if (i === data.length - 2) {
			query += "\"" + parametros[0] + "\"" + "=" + "\'" + parametros[1] + "\'";
		} else {
			query += "\"" + parametros[0] + "\"" + "=" + "\'" + parametros[1] + "\'" + ",";
		}
	}
	query += ' WHERE \"DocEntry\"=' + DocEntry + ';';
	var conn = $.hdb.getConnection();
	conn.executeUpdate(query);
	conn.commit();
	$.response.status = $.net.http.OK;