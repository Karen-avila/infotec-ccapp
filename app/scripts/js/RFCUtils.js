function generarRFC(nombre, apPaterno, apMaterno, fechaNacimiento){
	var moment=require('moment');
    var RFC_NOMBRES_INVALIDOS = [
    "D", "DALL", "DELLA", "DES", "DU,", "VANDER", 
    "DA", "DAS", "DE", "DEL", "DER", "DI",
    "DIE", "DD", "EL", "LA", "LOS", "LAS", "LE", "LES", "MC",
    "MAC", "VAN", "VON", "Y", "MARIA", "MA", "MA.", "JOSE", "J",
    "J.", "M", "M."];
    var RFC_VOCALES = ["A", "E", "I", "O", "U"];

    var RFC_COMBINACIONES_INVALIDAS = ["BACA",
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

    var RFC_CARACTER_VALOR =
        {
    		' ': "00",
            '0': "00",
            '1': "01",
            '2': "02",
            '3': "03",
            '4': "04",
            '5': "05",
            '6': "06",
            '7': "07",
            '8': "08",
            '9': "09",
            '&': "10",
            'A': "11",
            'B': "12",
            'C': "13",
            'D': "14",
            'E': "15",
            'F': "16",
            'G': "17",
            'H': "18",
            'I': "19",
            'J': "21",
            'K': "22",
            'L': "23",
            'M': "24",
            'N': "25",
            'O': "26",
            'P': "27",
            'Q': "28",
            'R': "29",
            'S': "32",
            'T': "33",
            'U': "34",
            'V': "35",
            'W': "36",
            'X': "37",
            'Y': "38",
            'Z': "39",
            'Ñ': "40",
        };

    var RFC_VALOR_HOMOCLAVE =
        {
            0: "1",
            1: "2",
            2: "3",
            3: "4",
            4: "5",
            5: "6",
            6: "7",
            7: "8",
            8: "9",
            9: "A",
            10: "B",
            11: "C",
            12: "D",
            13: "E",
            14: "F",
            15: "G",
            16: "H",

            17: "I",
            18: "J",
            19: "K",
            20: "L",
            21: "M",
            22: "N",
            23: "P",
            24: "Q",
            25: "R",
            26: "S",
            27: "T",
            28: "U",
            29: "V",
            30: "W",
            31: "X",
            32: "Y",
            33: "Z",
        };
    
    var RFC_VALOR_DIGITOVERIFICADOR =
        {
            '0': 0,
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            'A': 10,
            
            'B': 11,
            'C': 12,
            'D': 13,
            'E': 14,
            'F': 15,
            'G': 16,
            'H': 17,
            'I': 18,
            'J': 19,
            'K': 20,
            
            'L': 21,
            'M': 22,
            'N': 23,
            '&': 24,
            'O': 25,
            'P': 26,
            'Q': 27,
            'R': 28,
            'S': 29,
            'T': 30,
            
            'U': 31,
            'V': 32,
            'W': 33,
            'X': 34,
            'Y': 35,
            'Z': 36,
            ' ': 37,
            'Ñ': 38,
        };

    function genRFC(nombre, apPaterno, apMaterno, fechaNacimiento) {
        
    	rfc = "";

        nombre = stripAccents(nombre.toUpperCase().trim());
        apPaterno = stripAccents(apPaterno.toUpperCase().trim());
        apMaterno = stripAccents(apMaterno.toUpperCase().trim());
        fechaNacimiento = fechaNacimiento.toUpperCase().trim();

        fechaCurp = null;
        formatter = moment(fechaNacimiento);
        try {
        	fechaCurp = ("0" + formatter.date()).slice(-2) + "-" + ("0"+(formatter.month()+1)).slice(-2) + "-" +formatter.year();
        } catch (err) {
            fechaCurp = null;
        }
        try {
            if (fechaCurp != null) {
                rfc = calculaRFC(apPaterno, apMaterno, nombre, fechaNacimiento);
            }
        
        } catch (err) {
            console.log(err);
        }
        return rfc;
    }
        
    function calculaRFC(apellidoPaterno, apellidoMaterno, nombre, fechaNacimiento){
        apellidoPaterno = apellidoPaterno.toUpperCase().trim();
        apellidoMaterno = apellidoMaterno.toUpperCase().trim();
        nombre = nombre.toUpperCase().trim();
        
        sustitucion = true;
        rfc = null;

//        try {
            sdf = moment(fechaNacimiento);
            anioFec = sdf.year();
            af = parseInt(anioFec);
            rfc = generaRaizRFC2(sustitucion, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento);
//        } catch (err) {
//        	throw("Error al generar la CURP: " + err.message);
//        }
        homoclaveRFC = generaHomoclaveRFC(nombre, apellidoPaterno, apellidoMaterno, rfc);
        rfc += homoclaveRFC;
        
        if(!rfc.match("[A-Z]{4}[0-9]{6}[A-Z0-9]{2}[0-9A]{1}"))
        	throw ("La CURP que se genero es invalida: " + rfc);
        
        return rfc;
    }
    
    function generaRaizRFC2(sustitucion, nombre, apPaterno, apMaterno, fecNacimiento) {
        rfc = generaRaizRFC(nombre, apPaterno, apMaterno, fecNacimiento);
        if (sustitucion) {
            if (contains(RFC_COMBINACIONES_INVALIDAS,rfc.substring(0, 4))) {
                rfc = rfc.charAt(0) + "X" + rfc.substring(2);
            }
        }

        return rfc;
    }

    function generaRaizRFC(nombre, apPaterno, apMaterno, fechaNacimiento) {
    	fecFormateada = moment(fechaNacimiento);
    	fecFormateada = fecFormateada.year().toString().substr(2)+("0"+(fecFormateada.month()+1)).slice(-2)+("0" + fecFormateada.date()).slice(-2);
        ap = nombreValidado(apPaterno);
        am = nombreValidado(apMaterno);
        n = nombreValidado(nombre);

        amExists = am == null || am.length != 0;

        raizRFC = "";
        raizRFC += ap.substring(0, 1);
        ap = ap.substring(1);
        
        for (var i = 0; i < ap.length; i++) {
            if (contains(RFC_VOCALES,ap[i] + "")) {
                raizRFC += ap[i];
                break;
            }
        }

        raizRFC += amExists ? am.charAt(0) : "X";
        raizRFC += n.charAt(0);

        if (amExists) {
            am = am.substring(1);
        }

        n = n.substring(1);

        raizRFC += fecFormateada;

        return raizRFC;
    }

    function generaHomoclaveRFC(nombre, apPaterno, apMaterno, RFC) {
        nom = convertirNombreValidado(nombre);
        ap = convertirNombreValidado(apPaterno);
        am = convertirNombreValidado(apMaterno);

        nombreCompleto = ap + " " + am + " " + nom;

        homoclave = obtenerHomoclave(nombreCompleto, RFC);

        return homoclave;
    }

    function obtenerHomoclave(nombreCompleto, RFC) {
        cadenaNumerica = convertirNombre_Numero(nombreCompleto);
        sumaNombre = sumaValoresCaracteres(cadenaNumerica);
        homoclave = calcularHomoclave(sumaNombre);
        digito = calcularDigitoVeridicador(RFC+homoclave);
        return homoclave+digito;
    }

    function convertirNombre_Numero(nomCompleto) {
        cadenaNumerica = "";
        for (var i = 0; i < nomCompleto.length; i++) {
            if (RFC_CARACTER_VALOR[nomCompleto[i]]!=null) {
                cadenaNumerica += RFC_CARACTER_VALOR[nomCompleto[i]];
            } else {
                cadenaNumerica += "00";
            }
        }
        cadenaNumerica = "0" + cadenaNumerica;
        return cadenaNumerica;
    }

    function sumaValoresCaracteres(cadenaNumerica) {
        suma = 0;
        for (var i = 0; i < cadenaNumerica.length && (i + 2) <= cadenaNumerica.length; i++) {
            num1 = parseInt(cadenaNumerica.substring(i, (i + 2)));
            num2 = parseInt(cadenaNumerica.substring((i + 1), (i + 2)));
            suma += (num1 * num2);
        }

        if (suma > 999) {
            suma = suma % 1000;
        }

        return suma;
    }

    function calcularHomoclave(suma) {
        homoclave = "";
        residuo = suma % 34;
        suma = suma - residuo;
        cociente = suma / 34;

        homoclave += RFC_VALOR_HOMOCLAVE[cociente];
        homoclave += RFC_VALOR_HOMOCLAVE[residuo];

        return homoclave;
    }

    function calcularDigitoVeridicador(RFC) {
        valores = [];
        digVer = "";
        
        for (var i = 0; i < RFC.length; i++) {
            if (RFC_VALOR_DIGITOVERIFICADOR[RFC[i]]) {
                valores[i] = RFC_VALOR_DIGITOVERIFICADOR[RFC[i]];
            } else {
                valores[i] = 0;
            }
        }
        
        pos = valores.length+1;
        suma = 0;
        for (var i = 0; i < valores.length; i++) {
            suma += (valores[i]*(pos));
            pos--;
        }
        
        residuo = suma % 11;
        
        if(residuo==0){
            digVer = "0";
        }else if(residuo>0){
//            if(residuo>=10){
//                digVer="A";
//            }else{
                residuo=11-residuo;
                digVer = residuo.toString()[0];
//            }
        }else{
            digVer="0";
        }
        
        return digVer;
    }

    function nombreValidado(nombre) {
        if (nombre == null) {
            return "XX";
        }
        /**
         * Se agrega modificación para la CURP con nombres JOSE MARIA y MARIA
         * JOSE *
         */
        nombre = nombre.toUpperCase().split('Ñ').join('X').split('  ').join(' ');
        if (nombre.toUpperCase()=="JOSE MARIA") {
            nombre = "MARIA";
        } else if (nombre.toUpperCase()=="MARIA JOSE") {
            nombre = "JOSE";
        }
        partes = nombre.split(" ");
        nv = "";
        if (partes.length == 1) {
            nv = partes[0];
        } else {
            for(var i = 0; i < partes.length; i++){
                nv += (contains(RFC_NOMBRES_INVALIDOS,partes[i]) ? "" : " " + partes[i]);
            }
            nv = nv.trim();
        }
        return nv + "XX";
    }

    function convertirNombreValidado(nombre) {
        if (nombre == null) {
            return "";
        }
        /**
         * Se agrega modificación para la CURP con nombres JOSE MARIA y MARIA
         * JOSE *
         */
        nombre = nombre.toUpperCase().split('Ñ').join('X').split('  ').join(' ');
        if (nombre.toUpperCase()=="JOSE MARIA") {
            nombre = "MARIA";
        } else if (nombre.toUpperCase()=="MARIA JOSE") {
            nombre = "JOSE";
        }
        partes = nombre.split(" ");
        nv = "";
        if (partes.length == 1) {
            nv = partes[0];
        } else {
        	for(var i = 0; i < partes.length; i++){
                nv += (contains(RFC_NOMBRES_INVALIDOS,partes[i]) ? "" : " " + partes[i]);
            }
            nv = nv.trim();
        }
        return nv;
    }

    function getConsonante(nombre, posicion) {
        p = posicion;
        res = null;
        for(var i = 0; i < nombre.length; i++){
            if (!RFC_VOCALES.contains(nombre[i] + "")) {
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
    
    return genRFC(nombre, apPaterno, apMaterno, fechaNacimiento);
}

