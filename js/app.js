var $ = require("jquery");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');  
const fs = require('fs');

var gcol=["nombre","ncol"];

function capturarSentencia(el){
    //console.log(el.innerHTML);
    $("#sentencia").val(el.innerHTML)
}

function renderizar_tabla(columnas,datos){
    $("#resultado").empty();
    var tag_tr='<thead class="thead-dark"><tr>';
    if(columnas[0]!="#"){
        columnas.unshift("#");
    }
    
    for(var col in columnas){
        tag_tr=tag_tr+'<th scope="col">'+columnas[col]+'</th>';
    }
    tag_tr=tag_tr+'</tr></thead>';
    $("#resultado").append(tag_tr);
    tag_tr="<tbody>";
    for(var dat in datos){
        tag_tr+="<tr>";
        for(var col in columnas){
            if(columnas[col]=="#"){
                tag_tr+='<td scope="col">'+(parseInt(dat)+1).toString()+'</td>';  
            }
            else{
                tag_tr+='<td scope="col">'+datos[dat][columnas[col].toString()]+'</td>';
            }
            
        }   
        tag_tr+="</tr>";
    }
    tag_tr+="</tbody>";
    $("#resultado").append(tag_tr);
}

class Gestor {
    constructor() {
        this.cargarTablas();
        this._rexp=/\(([^)]+)\)/g;
    }

    cargarTablas(){
        var global_data = fs.readFileSync("data/tablas.txt").toString();
        global_data= JSON.parse(global_data);
        console.log("global_data",global_data);
        this._tablas = global_data;        
        /*fs.readFile('data/tablas.txt', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            var tabs = JSON.parse(data);
            console.log("tabs",tabs);
            tablas=tabs;
            console.log("Tablas",tablas);
            //obj.table.push({id: 2, square:3}); 
            //json = JSON.stringify(obj);
            //fs.writeFile('myjsonfile.json', json, 'utf8', callback); 
        }});*/    
    }

    checkOperador(a,b,op){
        //console.log("a",a,"b",b,"op",op);
        switch (op) {
            case '=':
                return a==b;
            case '<':
                return parseInt(a) < parseInt(b);
            case '>':
                return parseInt(a) > parseInt(b);
            default:
                return false;
        }
    }

    //[ [col,op,val], [col,op,val] ]
    checkCondicion(condiciones,data,oplogico){
        var ndata=[];
        var borrar=[];
        for(var tdat of data){
            var contCond=0;
            for(var cond of condiciones){
                //console.log("cond0",cond[0]);
                if (this.checkOperador( tdat[cond[0]],cond[2],cond[1])){
                   contCond+=1;
                }
            }
            if( oplogico==null || oplogico.toLowerCase()=="or"){
                if(contCond>0){
                    ndata.push(tdat);
                }
            }
            else if(oplogico.toLowerCase()=="and"){
                if(contCond==condiciones.length){
                    ndata.push(tdat);
                }
            }
            
        }
        return ndata;
    }

    borrarCondicion(condiciones,data,oplogico){
        var ndata=[];
        for(var idat=0;idat<data.length;idat++){
            var contCond=0;
            for(var cond of condiciones){
                if (this.checkOperador( data[idat][cond[0]],cond[2],cond[1])){
                   contCond+=1;
                }
            }
            if( oplogico==null || oplogico.toLowerCase()=="or"){
                if(contCond>0){  
                    data.splice(idat, 1);
                    idat-=1;   
                }
            }
            else if(oplogico.toLowerCase()=="and"){
                if(contCond==condiciones.length){
                    data.splice(idat, 1)
                    idat-=1;
                }
            }
            
        }
        return data;
    }

    updateCondicion(condiciones,data,oplogico,ncol,nval){
        for(var idat=0;idat<data.length;idat++){
            var contCond=0;
            for(var cond of condiciones){
                if (this.checkOperador( data[idat][cond[0]],cond[2],cond[1])){
                   contCond+=1;
                }
            }
            if( oplogico==null || oplogico.toLowerCase()=="or"){
                if(contCond>0){  
                    data[idat][ncol]=nval;
                    
                }
            }
            else if(oplogico.toLowerCase()=="and"){
                if(contCond==condiciones.length){
                    data[idat][ncol]=nval;
                }
            }
            
        }
        return data;
    }


    obtenerColumnas(tabla){
        var ncols=[];
        var tablaTemp=this.obtenerTabla(tabla);
        if(tablaTemp!=null){
            for(var ncol in tablaTemp.columnas){
                ncols.push(tablaTemp.columnas[ncol].nombre);
            }
        }
        return ncols;
    }

    obtenerTabla(tabla){
        for(let tobj in this._tablas.tablas){
            var tabtemp=this._tablas.tablas[tobj];
            if(tabtemp.nombre==tabla){
                return tabtemp;
            }
        }
        return null;
    }


    crear_tabla(datos){
        var matches = datos.match(this._rexp);
        var str = matches[0];
        str = str.substring(1, str.length - 1)
        var columnas=[];        
        var tcol=str.split(";");
        for(var i=0;i<tcol.length;i++){
            var trow=tcol[i].split(",");
            columnas.push({nombre:trow[0],tipo:trow[1]});
        }
        var nombreTabla=(datos.split(" "))[1];
        console.log("Nombre de tabla",nombreTabla);
        console.log("columnas",columnas);
        this._tablas.tablas.push({nombre:nombreTabla,columnas:columnas});
        fs.writeFileSync('data/tablas.txt', JSON.stringify(this._tablas));
        fs.writeFile('data/'+nombreTabla+'.txt', '[]', 'utf8',  function(err) {
            if (err) throw err;
        });
    }

    crearObj(col,data){
        var obj={};
        for(var i in col){
            var ncol=col[i].trim();
            var find = "'";
            var re = new RegExp(find, 'g');
            var ndata=data[i].replace(re, "");
            obj[ncol]=ndata;
        }
        return obj;
    }

    
    insertar(datos){
        var nombreTabla=(datos.split(" "))[1];
        var tempTab = fs.readFileSync('data/'+nombreTabla+'.txt').toString();
        tempTab = JSON.parse(tempTab);
        
        var matches = datos.match(this._rexp);
        var str = matches[0]
        str= str.substring(1, str.length - 1)
        var tcolumnas=str.split(",");        
        str = matches[1]
        str= str.substring(1, str.length - 1)
        var tdatos=str.split(",");
        
        tempTab.push(this.crearObj(tcolumnas,tdatos));
        fs.writeFile('data/'+nombreTabla+'.txt',JSON.stringify(tempTab), 'utf8',  function(err) {
            if (err) throw err;
        });
    }
    
    seleccionar(datos){
        var datSplit=datos.split(" ");
        var nombreTabla=datSplit[3];
        var operacion=datSplit[1];
        var tablaTemp=this.obtenerTabla(nombreTabla);
        if(tablaTemp!=null){
            $("#nombreTabla").html(nombreTabla);
            var tempTab = fs.readFileSync('data/'+nombreTabla+'.txt').toString();
            tempTab = JSON.parse(tempTab);
            var tcol=[];
            if("*"==operacion){
                tcol=this.obtenerColumnas(nombreTabla);
            }
            else{
                tcol=operacion.split(",");
            }

            var conds=[];
            var tconds=[];
            if(datSplit.length>5){
                tconds=datSplit.slice(5, datSplit.length);
                conds.push([tconds[0],tconds[1],tconds[2]]);
                var oplogico=null;
                if(tconds.length==7){
                    oplogico=tconds[3];
                    conds.push([tconds[4],tconds[5],tconds[6]]);
                }
                tempTab=this.checkCondicion(conds,tempTab,oplogico);
            }
            
            renderizar_tabla(tcol,tempTab);    

        }
        else{
            console.log("No existe tabla");
        }

    }
    
    borrar(datos){
        var datSplit=datos.split(" ");
        var nombreTabla=datSplit[1];
        var tablaTemp=this.obtenerTabla(nombreTabla);
        if(tablaTemp!=null){
            $("#nombreTabla").html(nombreTabla);
            var tempTab = fs.readFileSync('data/'+nombreTabla+'.txt').toString();
            tempTab = JSON.parse(tempTab);
            var tcol=[];
            tcol=this.obtenerColumnas(nombreTabla);
            
            var conds=[];
            var tconds=[];
            if(datSplit.length>2){
                tconds=datSplit.slice(3, datSplit.length);
                conds.push([tconds[0],tconds[1],tconds[2]]);
                var oplogico=null;
                if(tconds.length==7){
                    oplogico=tconds[3];
                    conds.push([tconds[4],tconds[5],tconds[6]]);
                }
                tempTab=this.borrarCondicion(conds,tempTab,oplogico);


            }
            else{
                tempTab=[];//Borro todo;
            }
            fs.writeFile('data/'+nombreTabla+'.txt',JSON.stringify(tempTab), 'utf8',  function(err) {
                if (err) throw err;
            });
            
            renderizar_tabla(tcol,tempTab);

        }
        else{
            console.log("No existe tabla");
        }
    }
    
    modificar(datos){
        var datSplit=datos.split(" ");
        var nombreTabla=datSplit[1];
        var mcol=datSplit[2];
        var operacion=datSplit[3];
        var mval=datSplit[4];
        var tablaTemp=this.obtenerTabla(nombreTabla);
        if(tablaTemp!=null){
            $("#nombreTabla").html(nombreTabla);
            var tempTab = fs.readFileSync('data/'+nombreTabla+'.txt').toString();
            tempTab = JSON.parse(tempTab);
            var tcol=[];
            tcol=this.obtenerColumnas(nombreTabla);
            
            var conds=[];
            var tconds=[];
            if(datSplit.length>5){
                tconds=datSplit.slice(6, datSplit.length);
                conds.push([tconds[0],tconds[1],tconds[2]]);
                var oplogico=null;
                if(tconds.length==7){
                    oplogico=tconds[3];
                    conds.push([tconds[4],tconds[5],tconds[6]]);
                }
                tempTab=this.updateCondicion(conds,tempTab,oplogico,mcol,mval);
            }
            fs.writeFile('data/'+nombreTabla+'.txt',JSON.stringify(tempTab), 'utf8',  function(err) {
                if (err) throw err;
            });
            renderizar_tabla(tcol,tempTab);    

        }
        else{
            console.log("No existe tabla");
        }

    }


    generarDatos(datos){
        var datSplit=datos.split(" ");
        var nombreTabla=datSplit[1];
        var cantidad = datSplit[2];
        var tablaTemp=this.obtenerTabla(nombreTabla);
        if(tablaTemp!=null){
            $("#nombreTabla").html(nombreTabla);
            var tempTab = fs.readFileSync('data/'+nombreTabla+'.txt').toString();
            tempTab = JSON.parse(tempTab);
            var tcol=this.obtenerColumnas(nombreTabla);
            var id=tempTab.length;

            for(var i=0;i<parseInt(cantidad);i++){
                var nobj={};
                var cont=true;
                for(var tempcol of tcol){
                    if(cont){
                        nobj[tempcol]=(id+i).toString();
                        cont=false;
                    }
                    else{
                        nobj[tempcol]=tempcol+(id+i).toString();
                    }
                    
                }
                tempTab.push(nobj);
            }
            fs.writeFile('data/'+nombreTabla+'.txt',JSON.stringify(tempTab), 'utf8',  function(err) {
                if (err) throw err;
            });
            
            renderizar_tabla(tcol,tempTab);
        }

    }

    ver(datos){
        var nombreTabla=(datos.split(" "))[1];
        $("#nombreTabla").html(nombreTabla);
        if(nombreTabla=='tablas'){
            let objCopy = Object.assign({}, this._tablas.tablas);
            for(let obcj in objCopy){
                console.log("obj",objCopy[obcj]);
                var ncols=[]
                for(var ncol in objCopy[obcj].columnas){
                    //console.log("objcol",objCopy[obcj].columnas[ncol]);
                    ncols.push(objCopy[obcj].columnas[ncol].nombre);
                }
                objCopy[obcj].ncol= JSON.stringify(ncols);
            }
            renderizar_tabla(gcol,objCopy);
        }
        else{
            var fnd=0;
            for(let tab in this._tablas.tablas){
                var tabtemp=this._tablas.tablas[tab];
                if(tabtemp.nombre==nombreTabla){
                    fnd=1;
                    var keyNames = Object.keys(tabtemp.columnas[0]);
                    renderizar_tabla(keyNames,tabtemp.columnas);
                    break;
                }
            }

            if(fnd){
                console.log("encontrado");
            }
            else{
                console.log("No encontrado");
            }
        }
    }
    checkSentencia(texto){
        $("#resultado").empty();
        $("#nombreTabla").html('');
        var res=texto.split(" ");
        var tipo=res[0].toLowerCase();
        var find = "'";
        var re = new RegExp(find, 'g');
        texto=texto.replace(re, "");
        switch (tipo) {
            case 'crea_tabla':
                this.crear_tabla(texto);
                break;
            case 'inserta':
                this.insertar(texto)
                break;
            case 'selecciona':
                this.seleccionar(texto);
                break;
            case 'borra':
                this.borrar(texto);
                break;
            case 'modifica':
                this.modificar(texto);
                break;
            case 'ver':
                this.ver(texto.toLowerCase());
                break;
            case 'genera':
                this.generarDatos(texto.toLowerCase());
                break;
        
            default:
                console.log('Error de sintaxis');
        
        }
    }
}




/*
class Person {
    constructor() {
      this.id = 'id_1';
    }
    set name(name) {
      this._name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    get name() {
      return this._name;
    }
    sayHello() {
      console.log('Hello, my name is ' + this.name + ', I have ID: ' + this.id);
    }
  }
  
  var justAGuy = new Person();
  justAGuy.name = 'martin'; // The setter will be used automatically here.
  justAGuy.sayHello();
*/

var gestor = new Gestor(); 

function leerSentencia(){
    var texto=$("#sentencia").val();   
    gestor.checkSentencia(texto);
    $("#sentencia").val("");
}

const csvWriter = createCsvWriter({
    path: 'file.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'lang', title: 'LANGUAGE'}
    ]
});

const records = [
    {name: 'Bob',  lang: 'French, English'},
    {name: 'Mary', lang: 'English'}
];

document.addEventListener('DOMContentLoaded', (event) => {
    
    
    //cargarTablas();
    /*
    for (var i = 0; i < matches.length; i++) {
        var str = matches[i];
        console.log(str.substring(1, str.length - 1));
    }*/
    /*
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('Creado');
    });
        
    fs.createReadStream('file.csv')  
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
        */
});
