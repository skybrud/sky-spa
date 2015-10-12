(function() {
	'use strict';
	
	angular.module('skySpa').factory('httpInterceptor', httpInterceptor);
	

	httpInterceptor.$inject = ['$q'];
	function httpInterceptor($q) {
		return {
			//response: function(response) {
			//	return response;
			//},
			responseError: function(response) {
				/** Globally handle request errors */
				
				
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
				
				/**
				 * TODO: what if the server is down - we dont want endless reload-circles...
				 */
								
				return $q.reject(response);
			},
			//request: function(config) {
			//	/** TODO: this would be the place to add something to the request when in preview-mode */
			//	return config;
			//}		
		}
	}

	angular.module('skySpa').config(config);
	
	config.$inject = ['$httpProvider'];
	function config($httpProvider){
		$httpProvider.interceptors.push('httpInterceptor');
	}
	
})();
