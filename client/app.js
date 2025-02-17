define([
  'app.includes',
  //'eon_componentes/publicaciones/listado/listado.controller'
  //'eon_componentes/publicaciones/publicaciones.module'
], 


function (angularAMD) {

  'use strict';

  var proveedorEstados = {};

  var App = angular.module('eonRouter', [
    'ui.router',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'ngAria',
    'oc.lazyLoad'
    //'publicacionesComponente'
  ]);

  App.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Now set up the states
    $stateProvider
      .state('inicio', {
        url: "/",
        templateUrl: "views/home/home.html"
      })
      .state('notfound',{
        url: "/404",
        template: "<h1>Error 404</h1>"
      });

    /*
    $urlRouterProvider.rule(function ($injector, $location) {
      console.log('Regla!!');

       //what this function returns will be set as the $location.url
        var path = $location.path(), normalized = path.toLowerCase();
        if (path != normalized) {
            //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
            $location.replace().path(normalized);
        }
        // because we've returned nothing, no state change occurs
    });
  */

    
    $urlRouterProvider.otherwise(function($injector, $location){
      var $http = $injector.get('$http');
      var $ocLazyLoad = $injector.get('$ocLazyLoad');
      var $state = $injector.get('$state');
      var $rootScope = $injector.get('$rootScope');

      var sState = $location.url();

          console.log('Si si');

        $http.post('/mapper/url',{url: $location.url()}).
          then(function success(respuesta){
            console.log('Respuesta: ',respuesta.data);
            if(respuesta.data.success){
              $ocLazyLoad.load(respuesta.data.map.componenteURL).then(function(){
                //alert('Windows');
                console.log('Estado actual: ', respuesta.data.map.stateTo);
                //$location.url('/publicaciones');
                $state.go(respuesta.data.map.stateTo, {}, {reload: true});
                //$state.reload();

              });
            } else {
              //$state.go('404', {}, {reload: true});
              $location.url('/404');
            }
              //$futureStateProvider.futureState(respuesta.data.map);
          });
              
    });

    $locationProvider.html5Mode(true);

  });

  App.controller('AppCtrl', function($mdSidenav, $state, $mdDialog, $ocLazyLoad){
    var vm = this;

    var $stateProvider = proveedorEstados;

    vm.toggleMenu = function () {
      $mdSidenav('menu_principal').toggle();
        
    };

    vm.viewState = function (ev){
      console.log($state);

      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Aviso')
          .textContent('Ver Estado: ' + $state.current.url)
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
      );
    }

    vm.cargaPublicaciones = function(){
      $ocLazyLoad.load('./eon_componentes/publicaciones/publicaciones.module.js')

      /*require(['./eon_componentes/publicaciones/publicaciones.module'], function(module){
        console.log('Modulo: ', module);
        App.$inject(module);
      });*/
    }

    vm.titulo = "durango.gob.mx";

  });

  return angularAMD.bootstrap(App);
});
