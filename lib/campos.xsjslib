    var bd = $.request.parameters.get('bd');
    var lista = $.request.parameters.get('lista');
	var query =
			'SELECT  t1.*, t2.\"TypeID\" as tipo , t2.\"SizeID\" as siz FROM \"'+bd+'\".\"@OK1_SF_LCH_MOD_HEAD\" t0 inner join \"'+bd+'\".\"@OK1_SF_LCH_MOD_LIN\" t1 on t0.\"DocEntry\"= t1.\"DocEntry\" left join \"'+bd+'\".CUFD t2 on t1.\"U_campoDB\"= t2.\"AliasID\" where t1.\"U_act\"=\'Y\' and t0.\"DocEntry\"=\''+lista+'\' and t2.\"TableID\"= \'@OK1_SF_LISCHEQ_HEAD\' ORDER BY (T1.\"LineId\")';
		var conn = $.hdb.getConnection();
		var rs = conn.executeQuery(query);

		$.response.contentType = "application/json"; // Specify output
		$.response.setBody(JSON.stringify(rs));
		$.response.status = $.net.http.OK;

		conn.commit();
