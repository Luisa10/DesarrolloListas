 var bd = $.request.parameters.get('bd');
 var Ucode= $.request.parameters.get('UCode');
 
 	var query ="select \"U_NAME\" from \""+bd+"\".\"OUSR\" where \"USER_CODE\"=\'"+Ucode+"\'";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);

	$.response.contentType = "application/json"; // Specify output
	$.response.setBody(JSON.stringify(rs));
	$.response.status = $.net.http.OK;

	conn.commit();