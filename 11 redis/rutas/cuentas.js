var cuentas = require('../cuentas.js');

exports.enrutar = function (router) {
	var rutaCuentas = router.route('/cuentas/');
	var rutaCuentasNueva = router.route('/cuentas/nueva');
	var rutaCuentasDni = router.route('/cuentas/dni');

	rutaCuentas.get(function (peticion, respuesta) {
		cuentas.selectPropietarios().then(function (propietarios) {
			cuentas.selectAll(propietarios).then(function (resultado) {
				respuesta.render('cuentas', {
					cuentas: resultado[0]
				});
			});
		});
	});
	rutaCuentasNueva.get(function (peticion, respuesta) {
		respuesta.render('cuentas_nueva');
	});

	rutaCuentasDni
		.get(function (peticion, respuesta) {
			respuesta.render('cuentas_dni');
		})
		.post(function (peticion, respuesta) {
			console.log(peticion.files);
			respuesta.redirect('/cuentas');
		});

}