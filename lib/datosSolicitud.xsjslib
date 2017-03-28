 var bd = $.request.parameters.get('bd');
 var sol= $.request.parameters.get('sol');
 
	var query ="SELECT \"U_NombreFa\", \"U_IdFallec\",\"U_FechaNac\",\"U_FechaFal\",\"U_HoraFall\" ,\"U_numListCh\",\"U_tipListCh\" FROM \"F_OLIVOS_FACTU\".\"@OK1_SF_LLAMADA_HEAD\" where \"DocEntry\"= \'"+sol+"\'";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);

	$.response.contentType = "application/json"; // Specify output
	$.response.setBody(JSON.stringify(rs));
	$.response.status = $.net.http.OK;

	conn.commit();