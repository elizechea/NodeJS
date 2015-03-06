// Clase instanciable
var Cuenta = (function(){
	var Mates = require('./mates.js');
	
	var Cuenta = function (propietario) {
		this.propietario = propietario;
		this.saldo = 0;
		console.log("creada cuenta para "  + this.propietario + " con " + this.saldo + "€")
    };
	
	Cuenta.prototype = {
		propietario: this.propietario,
		saldo: this.saldo,
		ingresar: function(dinero){
			this.saldo = Mates.sumar(this.saldo,dinero);
			console.log("ingresar: " + dinero + " a " + this.propietario + " tiene " + this.saldo + "€");
		},
		retirar: function(dinero){
			this.saldo = Mates.restar(this.saldo,dinero);
			console.log("retirar: " + dinero + " a " + this.propietario + " tiene " + this.saldo + "€");
		}
	}
	
	return Cuenta;
	
	
	
})();

module.exports = Cuenta;