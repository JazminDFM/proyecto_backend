//Invocando el codigo que tiene express
const express = require("express");
//Hace automaticamente el PARSE
let colores = require("./datos/colores.json");
//Llamando a express
const servidor = express(); 

servidor.use(express.static("./lista_colores"));

servidor.get("/colores", (peticion, respuesta) => {
	//Los datos que quiero que convierta en json
	respuesta.json(colores);
});






servidor.use((peticion,respuesta) => {
	respuesta.status(404);
	respuesta.send("<h1> 404 not found </h1>")
});

//Quiero que escuches en el puerto que me ha asignado la plataforma o el 4000
servidor.listen(process.env.PORT || 4000);

