var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());
console.log('ready');

// Arrays para guardar los datos de seguridad y sesiones
var usuarios = [];
var sesiones = [];

var movimientos = [];
var total = {
    ingresos: 0,
    gastos: 0
}


// Middleware para acceso a recursos estáticos
app.use(express.static(__dirname + '/client'));

// Middleware de validación de sesiones
// Esta función se ejecuta para todas las rutas que empiecen por '/api/priv'
app.use('/api/priv/', function (req, res, next) {
    // Obtener el token de sesión desde una de las cabeceras
    var sessionId = req.get('sessionId');
    var sesionEncontrada = sesiones.filter(function (sesion) {
        return sesion.sessionId == sessionId;
    })[0];
    if (sesionEncontrada) {
        // Controlar si está caducada
        if ((new Date() - sesionEncontrada.timeStamp) > 20 * 1000) {
            console.log('Sesión caducada:' + JSON.stringify(sesionEncontrada));
            res.send(419, 'Sesión caducada');
        } else {
            // Ampliar margen de caducidad
            sesionEncontrada.timeStamp = new Date();
        }
    } else {
        res.send(401, 'Credencial inválida');
    }
    // Si llegó hasta aquí entonces es una sesión válida
    // Se ejcuta la siguente funión de la pila
    // En este caso es ya la función de negocio que corresponda a la ruta
    next();
});


// Gestión de usuarios: Lista y registro
app.route('/api/usuarios')
    .get(function (req, res, next) {
        // Esto devuelve la lista completa de usuarios y contraseñas
        // Usar sólo a modo de debug
        res.json(usuarios);
    }).post(function (req, res, next) {
        // registro de un nuevo usuario
        var usuario = req.body;
        // Comprpbar si ya existe
        if (usuarios.some(function (u) {
            return u.email == usuario.email;
        })) {
            console.log('email ya registrado:' + email);
            res.send(409, 'email ' + email + ' ya registrado');
        } else {
            console.log('registrado:' + email);
            usuarios.push(usuario);
            res.json(newSession(email));
        }
    });

// Gestión de sesiones: listado y login
app.route('/api/sesiones')
    .get(function (req, res, next) {
        res.json(sesiones);
    }).post(function (req, res, next) {
        // login    
        var usuario = req.body;
        var usuarioValidado = usuarios.filter(function (u) {
            return u.email == usuario.email && u.password == usuario.password;
        })[0];
        if (usuarioValidado) {
            console.log('aceptado:' + email);
            res.json(newSession(email));
        } else {
            console.log('Credencial inválida:' + email);
            res.send(401, 'Credencial inválida');
        }
    });

// función auxiliar para crear una nueva sesión
function newSession(email) {
    var sessionId = Math.random() * (88888) + 11111;
    var timeStamp = new Date();
    sesiones.push({
        sessionId: sessionId,
        email: email,
        timeStamp: timeStamp
    });
    return sessionId;
}


app.get('/api/pub/maestros', function (req, res, next) {
    var maestros = {
        categoriasIngresos: ['Nómina', 'Ventas', 'Intereses Depósitos'],
        categoriasGastos: ['Hipotéca', 'Compras', 'Impuestos']
    };
    res.json(maestros);
});



app.route('/api/priv/movimientos')
    .get(function (req, res, next) {
        res.json(movimientos);
    }).post(function (req, res, next) {
        var movimiento = req.body;
        movimientos.push(movimiento);
        if (movimiento.tipo == 'Ingreso')
            total.ingresos += movimiento.importe;
        else
            total.gastos += movimiento.importe;
        res.status(200);
    });
app.get('/api/priv/total', function (req, res, next) {
    res.json(total);
});

// Página de prueba
app.get('/test', function (req, res, next) {
    res.send('<h1>Flujo de caja</h1><p>NodeJS y Express funcionan</p>');
});

console.log('steady');
app.listen(3000);
console.log('go');