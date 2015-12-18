interface Window {
	settings?:any;
}
(function() {
	'use strict';

	angular.module('skySpa').run(run);

	run.$inject = ['$rootScope', 'pagetreeCache', '$location'];
	
	function run($rootScope, pagetreeCache, $location) {
		
		$rootScope.settings = angular.copy(window.settings);
			
		$rootScope.settings.mainNavigation = [];
		angular.forEach(window.settings.mainNavigation, function(page) {	
			pagetreeCache.add(page);
			$rootScope.settings.mainNavigation.push(page.id);
		});
					

	}	
	
})();