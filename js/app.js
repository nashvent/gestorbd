var $ = require("jquery");
/** Procesar texto **/

function leerSentencia(){
    var texto=$("#sentencia").val();   
    checkSentencia(texto);
    $("#sentencia").val("");
}


function checkSentencia(texto){
    var res=texto.split(" ");
    var tipo=res[0].toLowerCase();
    console.log("tipo",tipo);
    switch (tipo) {
        case 'crea_tabla':
          console.log('Vamos a crear tabla');
          break;
        case 'inserta':
          console.log('insertar');
          break;
        case 'selecciona':
          console.log('vans seleccionar');
          break;
        case 'borra':
          console.log('borraaaa');
          break;
        case 'modifica':
            console.log("Vas a modificar");
        default:
          console.log('Error de sintaxis');
    }
}






const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');  
const fs = require('fs');





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

function getData(){
    console.log("kolaaa");
}