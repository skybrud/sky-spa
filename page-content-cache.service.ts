declare module sky {
	interface IPageContentCacheService {
		get(url:string):ng.IPromise<any>;
		getFromCache(url: string): any;
	}
}

(function() {
	'use strict';
	
	angular.module('skySpa').service('pageContentCache',pageContentCache);
	
	pageContentCache.$inject = ['$http', '$q', '$rootScope', 'sitemap', 'skyPath'];
	
	function pageContentCache($http, $q, $rootScope:ng.IRootScopeService, sitemap:sky.ISitemapService, skyPath):sky.IPageContentCacheService {
		var _this = this;
		var cache = {};
		
		var JsChangesGuid; 
		var contentChangesGuid;
		
			
		_this.get = function(url) {
			var defer = $q.defer();
			
			if(encodeURIComponent(url) in cache) {
				// resolve with cache-reponsonce unless the noCache flag is present and true
				if( !('noCache' in cache[encodeURIComponent(url)].data.data && cache[encodeURIComponent(url)].data.data.noCache === true)) {
					defer.resolve(cache[encodeURIComponent(url)]);
				}		
			}			
			
			$http({
				method: 'GET',
				url: skyPath.get() + '/umbraco/api/ContentApi/GetContent/?url=' + encodeURIComponent(url)
			}).then(function(res:any) {


		// HANDLING cache-invalidation
		
			//should this be moved somewhere else and look for the skySpa:pageContentCache:contentChanged event?
		
				// If there is a new version of the javascript-hash, force a page reload! 				
				if (JsChangesGuid && JsChangesGuid != res.data.data.JsChangesGuid) {
					/** TODO: Should this call a hook somewhere ($animate) to allow interception for animation etc.  */
					location.reload(true);
				}
				JsChangesGuid = res.data.data.JsChangesGuid;


				// If there is a new version of the content-hash, clear the pageTreeCache 				
				if (contentChangesGuid && contentChangesGuid != res.data.data.contentChangesGuid) {
					sitemap.clearCache();
				}
				contentChangesGuid = res.data.data.contentChangesGuid;
				
		// END HANDLING cache-invalidation
		
		
				// Resolve the promise if it is still unresolved!								
				if(defer.promise.$$state.status === 0) {
					defer.resolve(res);
				}	
		
				if(encodeURIComponent(url) in cache) {
					if(!angular.equals(cache[encodeURIComponent(url)], res)) {
						// The new content is different from the served content! 
						cache[encodeURIComponent(url)] = angular.copy(res);
						$rootScope.$broadcast('skySpa:pageContentCache:contentChanged');
					}
				} else {
					// Always cache the response (so we can ask to current response later),
					// if noCache-flag is set, then we dont return the cache there
					cache[encodeURIComponent(url)] = angular.copy(res);
				}
				
			}, function(err){
				if (err.status === 404 && (encodeURIComponent(url) in cache)) {
					delete cache[encodeURIComponent(url)];
					$rootScope.$broadcast('skySpa:pageContentCache:contentChanged');
				}
				
				// Reject the promise if it is still unresolved!	
				if(defer.promise.$$state.status === 0) {
					defer.reject(err);
				}
			});
			
			return defer.promise;
		}
		
		_this.getFromCache = function(url) {
			return cache[encodeURIComponent(url)] || {};
		}
		
		return _this;		
	}
	
})();