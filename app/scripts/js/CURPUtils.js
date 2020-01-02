function generarCURP(nombre, apPaterno, apMaterno, fechaNacimiento, sexo, lugarNacimiento,moment) {
    var moment=require('moment');
	var CURP_NOMBRES_INVALIDOS = [
	        "D", "DALL", "DELLA", "DES", "DU,", "VANDER", 
            "DA", "DAS", "DE", "DEL", "DER", "DI",
            "DIE", "DD", "EL", "LA", "LOS", "LAS", "LE", "LES", "MC",
            "MAC", "VAN", "VON", "Y", "MARIA", "MA", "MA.", "JOSE", "J",
            "J.", "M", "M."];
    
    var CURP_VOCALES=["A", "E", "I", "O", "U"];
    
    var CURP_COMBINACIONES_INVALIDAS = ["BACA",
            "BAKA", "BUEI", "BUEY", "CACA", "CACO", "CAGA", "CAGO",
            "CAKA", "CAKO", "COGE", "COGI", "COJA", "COJE", "COJI",
            "COJO", "COLA", "CULO", "FALO", "FETO", "GETA", "GUEI",
            "GUEY", "JETA", "JOTO", "KACA", "KACO", "KAGA", "KAGO",
            "KAKA", "KAKO", "KOGE", "KOGI", "KOJA", "KOJE", "KOJI",
            "KOJO", "KOLA", "KULO", "LILO", "LOCA", "LOCO", "LOKA",
            "LOKO", "MAME", "MAMO", "MEAR", "MEAS", "MEON", "MIAR",
            "MION", "MOCO", "MOKO", "MULA", "MULO", "NACA", "NACO",
            "PEDA", "PEDO", "PENE", "PIPI", "PITO", "POPO", "PUTA",
            "PUTO", "QULO", "RATA", "ROBA", "ROBE", "ROBO", "RUIN",
            "SENO", "TETA", "VACA", "VAGA", "VAGO", "VAKA", "VUEI",
            "VUEY", "WUEI", "WUEY"];
    
    var ACCENTS ={     		
        	'À':'A',
        	'Á':'A',
        	'Â':'A',
        	'Ã':'A',
        	'Ä':'A',
        	'Å':'A',
        	'à':'a',
        	'á':'a',
        	'â':'a',
        	'ã':'a',
        	'ä':'a',
        	'å':'a',
        	'Ò':'O',
        	'Ó':'O',
        	'Ô':'O',
        	'Õ':'O',
        	'Õ':'O',
        	'Ö':'O',
        	'Ø':'O',
        	'ò':'o',
        	'ó':'o',
        	'ô':'o',
        	'õ':'o',
        	'ö':'o',
        	'ø':'o',
        	'È':'E',
        	'É':'E',
        	'Ê':'E',
        	'Ë':'E',
        	'è':'e',
        	'é':'e',
        	'ê':'e',
        	'ë':'e',
        	'ð':'e',
        	'Ç':'C',
        	'ç':'c',
        	'Ð':'D',
        	'Ì':'I',
        	'Í':'I',
        	'Î':'I',
        	'Ï':'I',
        	'ì':'i',
        	'í':'i',
        	'î':'i',
        	'ï':'i',
        	'Ù':'U',
        	'Ú':'U',
        	'Û':'U',
        	'Ü':'U',
        	'ù':'u',
        	'ú':'u',
        	'û':'u',
        	'ü':'u',
        	'Ñ':'N',
        	'ñ':'n',
        	'Š':'S',
        	'š':'s',
        	'Ÿ':'Y',
        	'ÿ':'y',
        	'ý':'y',
        	'Ž':'Z',
        	'ž':'z'
        };
    var SEX_MASCULINO = ["MASCULINO", "M", "HOMBRE", "H", "MALE"];
    var SEX_FEMENINO = ["FEMENINO", "F", "MUJER", "FEMALE"];
    
    function transformarSexo(sexo) {
    	if (contains(SEX_MASCULINO,sexo)) {
    		return "H";
    	}
    	if (contains(SEX_FEMENINO,sexo)) {
    		return "M";
    	}
    	return null;
    }
    
    /*****************/
    
    var EDO_AGUASCALIENTES = ["AGUASCALIENTES", "AS", "AGS"];
    var EDO_CALIFORNIA_NORTE = ["BAJA CALIFORNIA", "BAJA CALIFORNIA NORTE", "BC"];
    var EDO_CALIFORNIA_SUR = ["BAJA CALIFORNIA SUR", "BCS", "BS"];
    var EDO_CAMPECHE = ["CAMPECHE"];
    var EDO_COAHUILA = ["COAHUILA", "COAHUILA DE ZARAGOZA", "COAHUILA ZARAGOZA", "COAH", "CL"];
    var EDO_COLIMA = ["COLIMA", "COL", "CM"];
    var EDO_CHIAPAS = ["CHIAPAS", "CHIS", "CS"];
    var EDO_CHIHUAHUA = ["CHIHUAHUA", "CHIH", "CH"];
    var EDO_DISTRITO_FEDERAL = ["DISTRITO FEDERAL", "DF"];
    var EDO_DURANGO = ["DURANGO", "DGO", "DG"];
    var EDO_GUANAJUATO = ["GUANAJUATO", "GTO", "GT"];
    var EDO_GUERRERO = ["GUERRERO", "GRO", "GR"];
    var EDO_HIDALGO = ["HIDALGO", "HGO", "HG"];
    var EDO_JALISCO = ["JALISCO", "JAL", "JC"];
    var EDO_MEXICO = ["MEXICO", "ESTADO DE MEXICO", "ESTADO MEXICO", "MÉXICO", "ESTADO DE MÉXICO", "ESTADO MÉXICO", "MEX", "MÉX", "MC"];
    var EDO_MICHOACAN = ["MICHOACAN", "MICHOACAN DE OCAMPO", "MICHOACAN OCAMPO", "MICHOACÁN", "MICHOACÁN DE OCAMPO", "MICHOACÁN OCAMPO", "MICH", "MN"];
    var EDO_MORELOS = ["MORELOS", "MOR", "MS"];
    var EDO_NAYARIT = ["NAYARIT", "NAY", "NT"];
    var EDO_NUEVO_LEON = ["NUEVO LEON", "NUEVO LEÓN", "NL"];
    var EDO_OAXACA = ["OAXACA", "OAX", "OC"];
    var EDO_PUEBLA = ["PUEBLA", "PUE", "PL"];
    var EDO_QUERETARO = ["QUERETARO", "QUERETARO DE ARTEAGA", "QUERETARO ARTEAGA", "QUERÉTARO", "QUERÉTARO DE ARTEAGA", "QUERÉTARO ARTEAGA", "QRO", "QT"];
    var EDO_QUINTANA_ROO = ["QUINTANA ROO", "QR"];
    var EDO_SAN_LUIS_POTOSI = ["SAN LUIS POTOSI", "SLP", "SP"];
    var EDO_SINALOA = ["SINALOA", "SIN", "SL"];
    var EDO_SONORA = ["SONORA", "SON", "SR"];
    var EDO_TABASCO = ["TABASCO", "TAB", "TC"];
    var EDO_TAMAULIPAS = ["TAMAULIPAS", "TAMS", "TS"];
    var EDO_TLAXCALA = ["TLAXCALA", "TLAX", "TL"];
    var EDO_VERACRUZ = ["VERACRUZ", "VERACRUZ DE IGNACIO DE LA LLAVE", "VERACRUZ IGNACIO LA LLAVE", "VERACRUZ LA LLAVE", "VERACRUZ LLAVE", "VERACRUZ IGNACIO LLAVE", "VER.", "VER", "VZ"];
    var EDO_YUCATAN = ["YUCATAN", "YUCATÁN", "YUC", "YN"];
    var EDO_ZACATECAS = ["ZACATECAS", "ZAC", "ZS"];
    
    function transformarEstadoNacimientoBad(lugarNacimiento) {
    	if (contains(EDO_AGUASCALIENTES,lugarNacimiento)) {
    		return "AS";
    	}
    	if (contains(EDO_CALIFORNIA_NORTE,lugarNacimiento)) {
    		return "BC";
    	}
    	if (contains(EDO_CALIFORNIA_SUR,lugarNacimiento)) {
    		return "BS";
    	}
    	if (contains(EDO_CAMPECHE,lugarNacimiento)) {
    		return "CC";
    	}
    	if (contains(EDO_COAHUILA,lugarNacimiento)) {
    		return "CL";
    	}
    	if (contains(EDO_COLIMA,lugarNacimiento)) {
    		return "CM";
    	}
    	if (contains(EDO_CHIAPAS,lugarNacimiento)) {
    		return "CS";
    	}
    	if (contains(EDO_CHIHUAHUA,lugarNacimiento)) {
    		return "CH";
    	}
    	if (contains(EDO_DISTRITO_FEDERAL,lugarNacimiento)) {
    		return "DF";
    	}
    	if (contains(EDO_DURANGO,lugarNacimiento)) {
    		return "DG";
    	}
    	if (contains(EDO_GUANAJUATO,lugarNacimiento)) {
    		return "GT";
    	}
    	if (contains(EDO_GUERRERO,lugarNacimiento)) {
    		return "GR";
    	}
    	if (contains(EDO_HIDALGO,lugarNacimiento)) {
    		return "HG";
    	}
    	if (contains(EDO_JALISCO,lugarNacimiento)) {
    		return "JC";
    	}
    	if (contains(EDO_MEXICO,lugarNacimiento)) {
    		return "MC";
    	}
    	if (contains(EDO_MICHOACAN,lugarNacimiento)) {
    		return "MN";
    	}
    	if (contains(EDO_MORELOS,lugarNacimiento)) {
    		return "MS";
    	}
    	if (contains(EDO_NAYARIT,lugarNacimiento)) {
    		return "NT";
    	}
    	if (contains(EDO_NUEVO_LEON,lugarNacimiento)) {
    		return "NL";
    	}
    	if (contains(EDO_OAXACA,lugarNacimiento)) {
    		return "OC";
    	}
    	if (contains(EDO_PUEBLA,lugarNacimiento)) {
    		return "PL";
    	}
    	if (contains(EDO_QUERETARO,lugarNacimiento)) {
    		return "QT";
    	}
    	if (contains(EDO_QUINTANA_ROO,lugarNacimiento)) {
    		return "QR";
    	}
    	if (contains(EDO_SAN_LUIS_POTOSI,lugarNacimiento)) {
    		return "SP";
    	}
    	if (contains(EDO_SINALOA,lugarNacimiento)) {
    		return "SL";
    	}
    	if (contains(EDO_SONORA,lugarNacimiento)) {
    		return "SR";
    	}
    	if (contains(EDO_TABASCO,lugarNacimiento)) {
    		return "TC";
    	}
    	if (contains(EDO_TAMAULIPAS,lugarNacimiento)) {
    		return "TS";
    	}
    	if (contains(EDO_TLAXCALA,lugarNacimiento)) {
    		return "TL";
    	}
    	if (contains(EDO_VERACRUZ,lugarNacimiento)) {
    		return "VZ";
    	}
    	if (contains(EDO_YUCATAN,lugarNacimiento)) {
    		return "YN";
    	}
    	if (contains(EDO_ZACATECAS,lugarNacimiento)) {
    		return "ZS";
    	}
    	return null;
    }

    function geneCurp(nombre, apPaterno, apMaterno, fechaNacimiento, sexo, lugarNacimiento) {

        curp = "";
        lugarCurp = "";
        sexoCurp = "";

        nombre = stripAccents(nombre.toUpperCase().trim());
        apPaterno = stripAccents(apPaterno.toUpperCase().trim());
        apMaterno = stripAccents(apMaterno.toUpperCase().trim());
        fechaNacimiento = fechaNacimiento.toUpperCase().trim();
        sexo = sexo.toUpperCase().trim();
        lugarNacimiento = stripAccents(lugarNacimiento.toUpperCase().trim());

        fechaCurp = null;
        formatter =  moment(fechaNacimiento);
        try {
        	fechaCurp = ("0" + formatter.date()).slice(-2) + "-" + ("0"+(formatter.month()+1)).slice(-2) + "-" +formatter.year();
        } catch (err) {
            fechaCurp = null;
        }        
        
        try {
            lugarCurp = transformarEstadoNacimientoBad(lugarNacimiento);
            sexoCurp = transformarSexo(sexo);

            if (fechaCurp != null & lugarCurp != null & sexoCurp != null) {
                curp = calculaCURP(true, apPaterno, apMaterno, nombre, fechaNacimiento, sexoCurp, lugarCurp);
            }
        } catch (err) {
            console.log(err);
        }
        return curp;
    }
    
    function calculaCURP(sustitucion, apellidoPaterno, apellidoMaterno, nombre, fechaNacimiento, sexo, entidadNacimiento){
        curp = null;
        
        try {
            sdf = moment(fechaNacimiento);
            anioFec = sdf.year();

            af = parseInt(anioFec);

            curp = generaRaizCURP(sustitucion, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo, entidadNacimiento);
            curp += (af < 2000) ? "0" : "A";

            acumulado = 0;
            contador = 18;
            s = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ-";

            for (var i=0;i<curp.length;i++) {
                c = (curp[i] == 'Ñ') ? '&' : (curp[i] == ' ') ? '-' : curp[i];
                v = s.indexOf(c);
                acumulado += (v * contador);
                contador--;
            }
            acumulado = 10 - (acumulado % 10);
            curp += acumulado == 10 ? "0" : acumulado;
        
        } catch (err) {
            throw ("Error al generar la CURP: " + err.message);
        }
        
        if(!curp.match("[A-Z]{4}[0-9]{6}[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[A-Z]{3}[A0][0-9]{1}"))
            throw ("La CURP que se genero es invalida: " + curp);
        
        return curp;
    }
    
    function generaRaizCURP(sustitucion, nombre, apPaterno, apMaterno, fecNacimiento, sexo, entidad) {
        curp = generaRaizCURP2(nombre, apPaterno, apMaterno, fecNacimiento, sexo, entidad);

        if (sustitucion) {
            if (contains(CURP_COMBINACIONES_INVALIDAS,curp.substring(0, 4))) {
                curp = curp.charAt(0) + "X" + curp.substring(2);
            }
        }

        return curp;
    }

    function generaRaizCURP2(nombre, apPaterno, apMaterno, fechaNacimiento, sexo, entidad) {
        fecFormateada = moment(fechaNacimiento);
    	fecFormateada = fecFormateada.year().toString().substr(2)+("0"+(fecFormateada.month()+1)).slice(-2)+("0" + fecFormateada.date()).slice(-2);
        ap = nombreValidado(apPaterno);
        am = nombreValidado(apMaterno);
        n = nombreValidado(nombre);

        amExists = am == null || am.length != 0;

        raizCURP = "";
        raizCURP += ap.substring(0, 1);
        ap = ap.substring(1);

        for (var i=0;i<ap.length;i++) {
            if (contains(CURP_VOCALES,ap[i])) {
                raizCURP += ap[i];
                break;
            }
        }

        raizCURP += amExists ? am.charAt(0) : "X";
        raizCURP += n.charAt(0);

        if (amExists) {
            am = am.substring(1);
        }

        n = n.substring(1);

        raizCURP += fecFormateada;
        raizCURP += sexo;
        raizCURP += entidad;

        raizCURP += getConsonante(ap, 1);
        consonante = getConsonante(am, 1);
        raizCURP += amExists && (consonante != null) ? consonante : "X";
        raizCURP += getConsonante(n, 1);

        return raizCURP;
    }
	
	function nombreValidado(nombre) {
        if (nombre == null) {
            return "XX";
        }
        
        nombre = nombre.toUpperCase().split('Ñ').join('X').split('  ').join(' ');
        
        if(nombre.toUpperCase()=="JOSE MARIA")
            nombre = "MARIA";
        else if(nombre.toUpperCase()=="MARIA JOSE")
            nombre = "JOSE";
        
        
        partes = nombre.split(" ");
        nv = "";
        if (partes.length == 1) {
            nv = partes[0];
        } else {
            for (var i=0;i<partes.length;i++) {
                nv += (contains(CURP_NOMBRES_INVALIDOS,partes[i]) ? "" : " " + partes[i]);
            }
            nv = nv.trim();
        }
        return nv + "XX";
    }
	
	function getConsonante(nombre, posicion) {
        p = posicion;
        res = null;
        for (var i=0;i<nombre.length;i++) {
            if (!contains(CURP_VOCALES,nombre[i] + "")) {
                p--;
                if (p == 0) {
                    res = nombre[i];
                    break;
                }
            }
        }
        return res;
    }   
	
    function contains(arreglo,valor){
    	respuesta=false;
    	for (var i = 0; i < arreglo.length; i++) {
    	    if(arreglo[i]==valor){
    	    	respuesta=true;
    	    	break;
    	    }
    	    //Do something
    	}
    	return respuesta;
    }
    
    function stripAccents(s){
        var r=s.toLowerCase();
        r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
        r = r.replace(new RegExp("æ", 'g'),"ae");
        r = r.replace(new RegExp("ç", 'g'),"c");
        r = r.replace(new RegExp("[èéêë]", 'g'),"e");
        r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
//        r = r.replace(new RegExp("ñ", 'g'),"n");                            
        r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
        r = r.replace(new RegExp("œ", 'g'),"oe");
        r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
        r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
        return r.toUpperCase();
    }
    

    
	return geneCurp(nombre, apPaterno, apMaterno, fechaNacimiento, sexo, lugarNacimiento);
}

function calculaDigito(curp){
	var segRaiz      = curp.substring(0,17);
	var chrCaracter  = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
	var intFactor    = new Array(17);
	var lngSuma      = 0.0;
	var lngDigito    = 0.0;
	
	for(var i=0; i<17; i++)
	{
		for(var j=0;j<37; j++)
		{
			if(segRaiz.substring(i,i+1)==chrCaracter.substring(j,j+1))
			{  				
				intFactor[i]=j;
			}
		}
	}
	
	for(var k = 0; k < 17; k++)
	{
		lngSuma= lngSuma + ((intFactor[k]) * (18 - k));
	}
	
	lngDigito= (10 - (lngSuma % 10));
	
	if(lngDigito==10)
	{
		lngDigito=0;
	}

	return lngDigito;
}
