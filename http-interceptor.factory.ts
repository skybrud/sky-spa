(function() {
	'use strict';
	
	angular.module('skySpa').factory('httpInterceptor', httpInterceptor);
	

	httpInterceptor.$inject = ['$q'];
	function httpInterceptor($q) {
		return {
			responseError: function(response) {	
				/** If there is any error on the NavigationApis, force a hard reload */
				if(response.config.url.indexOf('NavigationApi') > -1) {
					location.reload();
				}
				
				/** If there is any non 404-error on the ContentApi, force a hard reload */
				if(response.config.url.indexOf('ContentApi') > -1) {
					if(response.status != 404) {
						location.reload();
					}
				}
						
				return $q.reject(response);
			}
		}
	}

	angular.module('skySpa').config(config);
	
	config.$inject = ['$httpProvider'];
	function config($httpProvider){
		$httpProvider.interceptors.push('httpInterceptor');
	}
	
})();
