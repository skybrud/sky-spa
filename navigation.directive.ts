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
	 *	
	 *	Either pid or special must be filled out. If special is used,
	 *	only one level is supported. (levels-attr is ignored)
	 * 
	 **/
	
	angular.module('skySpa').directive('navigation', navigationDirective);

	navigationDirective.$inject = ['$compile', 'sitemap', '$rootScope', 'skyUtils'];
	function navigationDirective($compile, sitemap: sky.ISitemapService, $rootScope, skyUtils) {
		var directive = {
			restrict: 'E',
			scope: {
				levels: '=',
				pid: '=',
				special:'='
			},
			link: link
		};
		
		function link(scope, element, attrs) {
			
			scope.path = $rootScope.currentPath;
						
			if(attrs.hasOwnProperty('special') && attrs.special) {
				
				var wait = scope.$watch('special', function(items) {
					if(items) {
						skyUtils.asyncEach(items, sitemap.getPage).then(function(res) {
							renderMenu(res);
							wait();
						});					
					}
				});
				
			} else {
				sitemap.getChildren(scope.pid).then(renderMenu);
			}
			
			function renderMenu(res) {
				scope.items = res;				
				
				var template = '<ul>'+
					'<li ng-repeat="item in items">'+
						'<a href="{{item.url}}" ng-class="{act:path.indexOf(item.id)!=-1}">{{item.name}}</a>'+
						($rootScope.currentPath.indexOf(scope.pid) != -1 ? '<navigation pid="item.id" levels="levels-1" ng-if="item.hasChildren && path.indexOf(item.id)!=-1 && levels > 1"></navigation>' : '')+
					'</li>'+
				'</ul>';				
				
				element.html(template);
				$compile(element.contents())(scope);
			}
			
		}
		
		return directive;
	}

})();