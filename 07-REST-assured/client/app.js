var controlCajaApp = angular.module('controlCajaApp', ['ngRoute', 'ngCookies']);

function configuradorRutas($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'ControlCajaCtrl',
            controllerAs: 'controlCaja',
            templateUrl: 'total.html'
        })
        .when('/nuevo', {
            controller: 'ControlCajaCtrl',
            controllerAs: 'controlCaja',
            templateUrl: 'nuevo.html'
        })
        .when('/lista', {
            controller: 'ControlCajaCtrl',
            controllerAs: 'controlCaja',
            templateUrl: 'lista.html'
        }).when('/registro', {
            controller: 'RegistroCtrl',
            controllerAs: 'registro',
            templateUrl: 'registro.html'
        })
        .otherwise({
            redirectTo: '/'
        });
};
controlCajaApp.config(configuradorRutas);

// Los interceptores de http se configuran con funciones asignadas en el 'config'
function configuradorInterceptores($httpProvider) {
    function funionInterceptora ($q, $log, $location, $cookieStore, $rootScope) {
        // la función interceptora devuelve un objeto que configura el interceptor
        var interceptor = {}; // Este objeto almacena funiones a llamar en ciertos momentos
        // Función que se ejecutarán antes de cada petición
        interceptor.request = function (request) {
            $log.info('request:' + request.url);
            // Enviar en la cabecera el token de sesión previamente guardado en una cookie
            request.headers["sessionId"] = $cookieStore.get("sessionId");
            return request || $q.when(request);
        };
        // Función que se ejecutarán despues de cada respuesta con error
        interceptor.responseError = function (response) {
            $log.error("excepción: " + response.status + " de :" + response.config.url);
            if (response.status === 400) {
                $rootScope.mensaje = "Culpa mía :-(";
            } else if (response.status === 401) {
                // Si no tenemos cookie o es inválida, recibiremos un 401
                $rootScope.mensaje = "No hay derecho!!!";
                // Redirigimos al usuario a la página de registro
                $location.path('registro');
            } else if (response.status === 419) {
                $rootScope.mensaje = "Estoy caduco!!!";
                // Similar al 401, pero con sesión caducada, implica borrar el código actual
                $cookieStore.remove("sessionId")
                $location.path('registro');
            } else if (response.status === 404) {
                $rootScope.mensaje = "No se ha encontrado algo!!!";
            } else if (response.status === 500) {
                $rootScope.mensaje = "El servidor ha fallado :-)";
            }
            return $q.reject(response);
        };
        return interceptor;
    }
    // Cada interceptor es a su vez una función
    $httpProvider.interceptors.push(funionInterceptora);
}
controlCajaApp.config(configuradorInterceptores);