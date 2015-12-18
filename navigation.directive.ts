(function() {
	'use strict';

	/**
	 *	#Usage:
	 *	<navigation levels="3" pid="currentPath[1]"></navigation>
	 *  <navigation special="settings.mainNavigation"></navigation>
	 *
	 *	##Attributes
	 *	levels:number = 1
	 *	pid:number
	 *  special:id[]
	 *  template:string
	 *
	 *	Either pid or special must be filled out. If special is used,
	 *	only one level is supported. (levels-attr is ignored)
	 *
	 **/

	angular.module('skySpa').directive('navigation', navigationDirective);

	navigationDirective.$inject = ['$compile', 'sitemap', '$rootScope', 'skyUtils', '$templateCache'];
	function navigationDirective($compile, sitemap: sky.ISitemapService, $rootScope, skyUtils, $templateCache) {
		var directive = {
			restrict: 'E',
			scope: {
				levels: '=',
				pid: '=',
				special:'=',
				template:'@'
			},
			link: link
		};

		function link(scope, element, attrs) {

			scope.path = $rootScope.currentPath;

			if(attrs.hasOwnProperty('special') && attrs.special) {

				var wait = scope.$watch('special', function(items) {
					if(items) {
						skyUtils.asyncEach(items, sitemap.getPage).then(function(result) {
							renderMenu(result);
							wait();
						});
					}
				});

			} else {
				sitemap.getChildren(scope.pid).then(renderMenu);
			}

			function renderMenu(result) {
				var templateUrl = scope.template ? ('/sky-spa/views/navigation.'+scope.template+'.template.html') : '/sky-spa/views/navigation.template.html' ;
				var template = $templateCache.get(templateUrl);


				element.html(template);

				scope.items = result;
				$compile(element.contents())(scope);
			}

		}

		return directive;
	}

})();
