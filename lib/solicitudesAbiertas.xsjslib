 var bd = $.request.parameters.get('bd');
 
	var query ="SELECT \"DocEntry\" , \"U_NombreFa\" FROM \"F_OLIVOS_FACTU\".\"@OK1_SF_LLAMADA_HEAD\" where \"U_Estado\"= \'1\'";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);

	$.response.contentType = "application/json"; // Specify output
	$.response.setBody(JSON.stringify(rs));
	$.response.status = $.net.http.OK;

	conn.commit();