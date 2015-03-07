(function () {
	"use strict";
	var Mates = require('./mates.js');
	var express = require('express');

	var app = express();

	app.use(function (peticion, respuesta, siguiente) {
		console.log("recibida petición: " + peticion.url);
		siguiente();
	});

	app.get('/', function (peticion, respuesta) {
		respuesta.send('Hola Express!');
	});

	app.get('/about', function (peticion, respuesta) {
		respuesta.send('Página creada por gente que sabe Express!');
	});

	app.get('/saludame/:tunombre', function (peticion, respuesta) {
		respuesta.send('Hola ' + peticion.params.tunombre);
	});

	app.get('/mates/:operacion/:numero1/:numero2([0-9])', function (peticion, respuesta) {
		var operacion = peticion.params.operacion;
		var numero1 = peticion.params.numero1;
		var numero2 = peticion.params.numero2;
		var resultado = "Desconocido";
		if ("sumar" === operacion) {
			resultado = Mates.sumar(numero1, numero2);
		} else if ("restar" === operacion) {
			resultado = Mates.restar(numero1, numero2);
		}
		respuesta.send("El resultado de " + operacion + " " + numero1 + " y " + numero2 + " es " + resultado);
	});

	app.param('numero1', function (peticion, respuesta, siguiente, valor) {
		console.log('numero1 vale ' + valor);
		if (isNaN(valor)) {
			console.log('numero1 no es un número ');
			peticion.params.numero1 = 0;
			//siguiente(new Error('numero1 no es un número'));
		}
		siguiente();
	});

	app.listen(3000);
}());