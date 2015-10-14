(function() {
	'use strict';

	/**
	 *	#Usage:
	 *	<breadcrumb levels="3" entry-level="1"></breadcrumb>
	 *
	 *	##Attributes
	 *	levels:int = 99
	 *	entry-level:int = 0
	 *
	 **/

	angular.module('skySpa').directive('breadcrumb', breadcrumbDirective);

	breadcrumbDirective.$inject = ['sitemap', '$rootScope', 'skyUtils'];
	function breadcrumbDirective(sitemap:sky.ISitemapService, $rootScope, skyUtils) {
		return {
			restrict: 'E',
			templateUrl: '/sky-spa/views/breadcrumb.template.html',
			scope: {
				entryLevel:'=',
				levels:'='
			},
			link: link
		};

		function link(scope, element, attrs) {

			var startLevel = scope.entryLevel ? scope.entryLevel : 0;
			var endLevel = scope.levels ? startLevel+scope.levels : 99;

			skyUtils.asyncEach($rootScope.currentPath.slice(startLevel, endLevel), sitemap.getPage).then(function(pages) {
				scope.bread = pages;
			});

		}
	}

})();
