interface Window {
	settings?:any;
}
(function() {
	'use strict';

	angular.module('skySpa').run(run);

	run.$inject = ['$rootScope', 'pagetreeCache'];
	
	function run($rootScope, pagetreeCache) {
		
		$rootScope.settings = angular.copy(window.settings);
			
		$rootScope.settings.mainNavigation = [];
		angular.forEach(window.settings.mainNavigation, function(page) {	
			pagetreeCache.add(page);
			$rootScope.settings.mainNavigation.push(page.id);
		});
					

	}	
	
})();