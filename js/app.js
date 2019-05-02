var $ = require("jquery");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');  
const fs = require('fs');

var gcol=["nombre","ncol"];

function renderizar_tabla(columnas,datos){
    $("#resultado").empty();
    var tag_tr='<thead class="thead-dark"><tr>';
    columnas.unshift("#");
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

    crear_tabla(datos){
        var regExp = /\(([^)]+)\)/g;
        var matches = datos.match(regExp);
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
        /*
        CREA_TABLA NOMTABLA (NOM_COL1, INT; NOM_COL2, VARCHAR 15)

        
        var obj = {
            tables: []
         };
        obj.tables.push({
            nombre: "tabla1", 
            columnas:[
                {nombre:"col1",tipo:"VARCHAR",size:4},
                {nombre:"col2",tipo:"INT"}
            ] 
        });*/
    
        /*
        var json = JSON.stringify(tablas);
        fs.writeFile('myjsonfile.json', json, 'utf8',  function(err) {
            if (err) throw err;
            console.log('complete');
            });*/
    }



    
    insertar(datos){
        console.log("Crea tabla");
    }
    
    seleccionar(datos){
        console.log("Crea tabla");
    }
    
    borrar(datos){
        console.log("Crea tabla");
    }
    
    modificar(datos){
        console.log("Crea tabla");
    }

    ver(datos){
        var nombreTabla=(datos.split(" "))[1];
        
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
                    console.log("Key names",keyNames);
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

            //var keyNames = Object.keys(this._tablas.tablas[nombreTabla]);
            //console.log("keynames",keyNames);
        }
    }
    checkSentencia(texto){
        var res=texto.split(" ");
        var tipo=res[0].toLowerCase();
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
