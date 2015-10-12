/**
 * TODO: is there a way we can save requests here?
 */

/**
 * Note regarding children
 * 
 * hasChildren: boolean;
 * children: Array;
 * 
 * If children is empty array, it means no children
 * If children is null, it means possible un-fetched children
 * If children is filled array, it means id's of children
 *  
 */

interface Window {
	pageTree?:any;
}

declare module sky {
	interface ISitemapService {
		batchFetch(pageId:number):ng.IPromise<IPage>;
		getPage(pageId:number):ng.IPromise<IPage>;
		getChildren(pageId:number):ng.IPromise<IPage[]>;
		clearCache():void;
	}
}

(function() {
	'use strict';
	
	angular.module('skySpa').service('sitemap', sitemap);

	sitemap.$inject = ['$http', '$q', '$timeout', 'pagetreeCache', 'skyPath'];
	function sitemap($http,	$q, $timeout, pagetreeCache:sky.IPagetreeCacheService, skyPath) {
		var _this = this;
		
		var allDeferreds = {};
		var fetchOnNextTick = [];
		
		_this.batchFetch = function batchFetch(id) {
			if(!allDeferreds[id]) {
				allDeferreds[id] = $q.defer();
	
				fetchOnNextTick.push(id);
	
				if(fetchOnNextTick.length === 1) {
					setTimeout(function() {
						doFetch(fetchOnNextTick);
					},0);
				}
	
			}
	
			return allDeferreds[id].promise;
		}
	
		_this.clearCache = function () {
			allDeferreds = {};
			pagetreeCache.empty();
		}
	
	
		function doFetch(ids) {
	
			$http({
				method: 'GET',
				url: skyPath.get() + '/umbraco/api/NavigationApi/GetByIds',
				params: {
					ids: ids.join(','),
					levels:2
				}	
			}).then(function(res) {
				angular.forEach(res.data.data, function(page) {
					pagetreeCache.add(page);
					allDeferreds[page.id].resolve(page);
				});
			});
			fetchOnNextTick.length = 0;
		}
		

		function fetch(id) {
			var defer = $q.defer();
			
			//TODO: should check if there already is a request for specific id
			
			$http({
				url: skyPath.get() + '/umbraco/api/NavigationApi/GetPageTree?nodeId=' + id + '&levels=2'
			}).then(function(res) {
				pagetreeCache.add(res.data.data);
				defer.resolve(res.data.data);
			});
			
			return defer.promise;
		}
		
		_this.getPage = function(id:number) {
			var defer = $q.defer();
		
			var page = pagetreeCache.get(id);
						
			if(!page) {
				_this.batchFetch(id).then(function(res) {
					defer.resolve(res);
				});	
			} else {
				defer.resolve(page);
			}
			return defer.promise;	
		};
	
		_this.getChildren = function(id:number) {
			var defer = $q.defer();
			var page = _this.getPage(id).then(function(page) {
				if (!page.hasChildren){
					defer.resolve([]);
				} else if (page.children != null) {
					defer.resolve(transform(page.children));
				} else {
					fetch(id).then(function(res) {
						defer.resolve(transform(res.children));
					});		
				}
			});
			
			function transform(children) {
				var returnValue = [];
				angular.forEach(children, function(id) {
					returnValue.push(pagetreeCache.get(id));
				});
				return returnValue;
			}
			
			return defer.promise;
		}	
	}

})();