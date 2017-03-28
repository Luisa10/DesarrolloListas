    var datos = $.request.parameters.get('numlist');
    var bd = $.request.parameters.get('bd');
    var tipoList = $.request.parameters.get('tipList'); 
    var query= 'select \"U_campoDB\",\"U_tipoCampo\" from \"'+bd+'\".\"@OK1_SF_LCH_MOD_LIN\" t0 left join \"'+bd+'\".\"@OK1_SF_LISCHEQ_MAP\" t1 on t1.\"U_listcheq\" = t0.\"U_campoDB\" where \"U_act\"=\'Y\' and \"DocEntry\"='+tipoList+' and \"U_tipoCampo\"!=\'Descripcion\' and t1.\"U_listcheq\" is null';
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
	        query +="\"U_"+data[i].U_campoDB+"\",";
	    }else{
	        query +="\"U_"+data[i].U_campoDB+"\" "; 
	    }
	    
	}
	query+=" from \""+bd+"\".\"@OK1_SF_LISCHEQ_HEAD\" where \"DocEntry\"='"+Nsol+"\'";
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(query);
	conn.commit();

	return rs;
}