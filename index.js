const { writeFile } = require("fs");
//Invocando el codigo que tiene express
const express = require("express");
const { json } = require("body-parser"); 
//Hace automaticamente el PARSE
let colores = require("./datos/colores.json");
//Llamando a express
let proximoId = colores.length > 0 ? colores[colores.length - 1].id + 1 : 1;

function guardarColores(){
	return new Promise((ok,ko) => {
		writeFile("./datos/colores.json", JSON.stringify(colores), error => {
			!error ? ok() : ko();
		});
	});
}

const servidor = express();

servidor.use(json());

servidor.use(express.static("./lista_colores"));

servidor.get("/colores", (peticion, respuesta) => {
	//Los datos que quiero que convierta en json
	respuesta.json(colores);
});

servidor.post("/nuevo", (peticion, respuesta) => {
	//Previa validacion 
	peticion.body.id = proximoId;
	proximoId++;
	colores.push(peticion.body);

	guardarColores()
	//se activa con el ok
	.then(() => {
		respuesta.json({ id : peticion.body.id })
	})
	//se activa con el ko
	.catch(() => {
		proximoId--;
		colores.pop();
		respuesta.status(500);
		respuesta.json({  error : "error en el servidor" });
	});
});

servidor.delete("/borrar/:id", (peticion, respuesta) => {

	colores = colores.filter(color => color.id != peticion.params.id);

	guardarColores()
	.then(() => respuesta.json({ resultado : "ok" }))
	.catch(() => respuesta.json({ resultado : "ko" }));

});

servidor.use((error, peticion, respuesta, siguiente) => {
	//En caso de que algun middleware anterior genere una EXCEPCion (error)
	respuesta.status(400);
	respuesta.send("<h1> 400 bad request </h1>");
});


servidor.use((peticion,respuesta) => {
	respuesta.status(404);
	respuesta.send("<h1> 404 not found </h1>");
});

//Quiero que escuches en el puerto que me ha asignado la plataforma o el 4000
servidor.listen(process.env.PORT || 4000);

