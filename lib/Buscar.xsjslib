    var datos = $.request.parameters.get('Nsol');
    var bd = $.request.parameters.get('bd');
    var tipoList = $.request.parameters.get('tipList'); 
    var query= 'select t0.\"U_serFun\", \"U_listcheq\" from \"'+bd+'\".\"@OK1_SF_LISCHEQ_MAP\" t0	inner join "'+bd+'".\"@OK1_SF_LCH_MOD_LIN\" t1 on t0.\"U_listcheq\"=t1.\"U_campoDB\" where t1.\"U_act\"=\'Y\' and t1.\"DocEntry\"=\''+tipoList+'\'';
   
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);
	conn.commit();
	var info= obtenerinformacion(rs,datos);
	
   var resp = new Array();
   resp={campo:rs, datos: info};
	$.response.contentType = "application/json"; // Specify output
	$.response.setBody(JSON.stringify(resp));
	$.response.status = $.net.http.OK;

function obtenerinformacion(data, Nsol) {
   var query='select ';
	for(var i=0; i< data.length; i++) {
	    if(i!= data.length-1 ){
	        query +="\"U_"+data[i].U_serFun+"\",";
	    }else{
	        query +="\"U_"+data[i].U_serFun+"\" "; 
	    }
	    
	}
	query+=" from \""+bd+"\".\"@OK1_SF_LLAMADA_HEAD\" where \"DocEntry\"='"+Nsol+"\'";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);
	conn.commit();

	return rs;
}