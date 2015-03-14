(function () {
    var registroCtrl = function ($rootScope, $location, $http, $cookieStore) {
        var urlBase = "http://localhost:3000/api/";
        var vm = this;
        vm.usuario={};
        vm.entrar = function(){
           $http.post(urlBase+'sesiones/',$scope.usuario).success(function (data) {
               $rootScope.nombre=vm.usuario.email;
               $rootScope.mensaje='recién entrado';
               $cookieStore.put("sessionId", data);
               $location.path("/");
            });
        }
        vm.registrar = function(){
            $http.post(urlBase+'usuarios/',$scope.usuario).success(function (data) {    
                $rootScope.nombre=vm.usuario.email;
                $rootScope.mensaje='recién creado';
                $cookieStore.put("sessionId", data);
                $location.path("/");
            });
        }
    }
    angular.module('controlCajaApp').controller('RegistroCtrl', registroCtrl);
}());