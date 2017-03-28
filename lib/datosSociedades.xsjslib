	var query ="SELECT \"dbName\",\"cmpName\" FROM \"SBOCOMMON\".\"SRGC\"";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);

	$.response.contentType = "application/json"; // Specify output
	$.response.setBody(JSON.stringify(rs));
	$.response.status = $.net.http.OK;

	conn.commit();