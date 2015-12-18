(function() {
	'use strict';

	/**
	 *	#Usage: 
	 *  <page-info></page-info>
	 *	<page-info pid="3" field="url"></page-info>
	 *	
	 *	##Attributes
	 *	pid:number = #currentPage.id
	 *  field:string = 'name'
	 *  link:any 
	 * 
	 **/

	angular.module('skySpa').directive('pageInfo', pageInfoDirective);

	pageInfoDirective.$inject = ['sitemap', '$rootScope'];
	function pageInfoDirective(sitemap: sky.ISitemapService, $rootScope) {
		return {
			restrict: 'E',
			template: '<span ng-bind-html="info"></span>',
			scope: {
				field:'=',
				pid:'=',
				link:'='
			},
			link: link
		};
		
		function link(scope,element,attrs) {
	
			var id = scope.pid ? scope.pid : $rootScope.currentPath[$rootScope.currentPath.length-1];
			var displayField = scope.field ? scope.field : 'name';
						
			sitemap.getPage(id).then(function(page) {
				scope.info = scope.link ? '<a href="' + page['url'] + '">' + page[displayField] + '</a>' : page[displayField];
			});
		}
	}
	
})();