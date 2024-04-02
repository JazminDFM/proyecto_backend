const contenedorColores = document.querySelector("ul");
const formulario = document.querySelector("form");
//Se especificos con los inputs
const inputTexto = document.querySelector('input[type="text"]');
const errorMensaje = document.querySelector(".error");

//Esta funcion representa un li
function color(id,r,g,b){
	let item = document.createElement("li");
	//Es lo mismo que `${},${},${}`
	item.innerText = [r,g,b].join(",");
	item.style.backgroundColor = `rgb(${[r,g,b].join(",")})`;
	//Al darle click a cualquier item los borra
	item.addEventListener("click", () => {
		fetch("/borrar/" + id, {
			method : "DELETE"
		})
		.then(respuesta => respuesta.json())
		.then(({resultado, error}) => {
			if(!error && resultado == "ok"){
				return item.remove();
			}
			console.log("..mostrar error al usuario");
		});
		//item.remove());
	});
	return item;
}

//carga inicial de los datos
// Fetch basicamente una promesa
fetch("/colores")
.then(respuesta => respuesta.json())
.then(colores => {
	colores.forEach(({id,r,g,b}) => {
		contenedorColores.appendChild(color(id,r,g,b));
	});
});

formulario.addEventListener("submit", evento => {
	evento.preventDefault();
	//Para que no nos muestre el error despues de escribir algo
	errorMensaje.classList.remove("visible");

	let textoError = "No puede estar en blanco";


	//Trim elimina los espacios en blanco de los extremos
	if(inputTexto.value.trim() != ""){
		
		//Pasa un array, map coge lo que sea n y lo convierte a numero
		let numeros = inputTexto.value.split(",").map(n => Number(n));
		//Creamos valido para que su valor sea la longitud de numero 
		//igual a 3
		let valido = numeros.length == 3;
		//Si tiene 3 cosas da ok
		if(valido){
			//Este bucle lo que hace es hacer las siguientes comprobaciones
			//Que sea valido sea true, que sea mayor que cero, que sea menor o igual que 255
			//Y si el numero es entero
			numeros.forEach( n => valido = valido && n >= 0 && n <= 255 && n - parseInt(n) == 0);
			
			//Otra comprobacion
			if(valido){

				//Numeros va a ser el valor de rgb
				let [r,g,b] = numeros;

				return fetch("/nuevo", {
					method : "POST",
					body : JSON.stringify({r,g,b}),
					headers : {
						"Content-type" : "application/json"
					}
				})
				.then(respuesta => respuesta.json())
				.then(({id, error}) => {
					if(!error){
						contenedorColores.appendChild(color(id,r,g,b));
						return inputTexto.Value = "";
					}
					console.log("..error al usuario");
				});

				//Le pasamos los valores que nos ha escrito el usuario
				//contenedorColores.appendChild(color(r,g,b));
				//Se corta la funcion y ya no nos lo lee los mensajes de errores
				//return inputTexto.Value = "";

			}
		}
		textoError = "Deben ser 3 numeros entre 0 y 255 separados por comas";
	}
	errorMensaje.innerText = textoError;
	errorMensaje.classList.add("visible");
});

