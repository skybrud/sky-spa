(function() {
	'use strict';
	
	angular.module('skySpa').config(config);

	config.$inject = ['$stateProvider', '$locationProvider'];
	
	function config($stateProvider, $locationProvider) {
		
		$locationProvider.html5Mode(true);
	
		$stateProvider.state('root', {
			url: '*path',
			resolve: {
				fetch: fetch,
				preload: preload
			},
			templateProvider: templateProvider,
			controller: controller,
			controllerAs: 'stateCtrl',
		});


		preLoad.$inject = ['$q', 'fetch', 'skyCrop'];
		function preLoad($q, fetch, skyCrop: sky.ISkyCropService) {
			if(!fetch.data.data.topImage) { 
				return true;
			}
			
			var d = $q.defer();

			var img = new Image();
			
			/* Resolve on load, error or after 2000ms */
			img.onload = img.onerror = d.resolve;
			setTimeout(d.resolve, 2000);

			var orgImageSize = skyCrop.infoFromSrc(fetch.data.data.topImage);

			img.src = skyCrop.getUrl(fetch.data.data.topImage.slice(0, fetch.data.data.topImage.indexOf('?')), orgImageSize, { width: window.innerWidth }, 'width', 100);

			return d.promise;
		}

		fetch.$inject = ['$stateParams', '$rootScope', '$q', 'pageContentCache'];
		function fetch($stateParams, $rootScope, $q, pageContentCache: sky.IPageContentCacheService) {
			
			angular.element(document.body).addClass('loading');

			var deferred = $q.defer();
				
			pageContentCache.get($stateParams.path).then(deferred.resolve, handleError);
			
			return deferred.promise;
			
			function handleError(res) {		
				if(res.status === 404) {
					console.warn('404: page not found');
					deferred.resolve({
						data: {
							error: 404,
							data: {
								templatename: 'error.html',
								name: 'Siden findes ikke',
								msg: '404 - siden findes ikke!',//res.data.meta.error,
								path: [$rootScope.settings.siteRootId],
								jsonDebug: {}
							}
						}
					});
				} else {
					console.warn(res.status + ': ' + res.statusText);

					deferred.resolve({
						data: {
							error: res.status,
							data: {
								templatename: 'error.html',
								name: 'Der er sket en fejl',
								msg: res.data.meta.error || 'Ukendt fejl (Fejl: '+res.status+')',
								path: [$rootScope.settings.siteRootId],
								jsonDebug: {}
							}
						}
					});
				}
			}
			
		}
		
		templateProvider.$inject = ['fetch', '$templateCache'];
		function templateProvider(fetch, $templateCache) {

			/* Select template based on server-response */
			var template = $templateCache.get('/layout/views/' + fetch.data.data.templatename);
			
			if(!template) {
				console.warn('Template doesn\'t exist! Reload page?');
			}
			
			return template; 
		}
		
		controller.$inject = ['fetch', '$rootScope', 'sitemap'];
		function controller(fetch, $rootScope, sitemap: sky.ISitemapService) {

			// If there is a redirect path set, go ahead and redirect
			if(fetch.data.data.redirect) {
				$state.go('root', { path: fetch.data.data.redirect });
				return;
			}

			if (fetch.data.error) {
				_this.statusText = _this.data.msg;
			}

			angular.element(document.body).removeClass('loading');
			var _this = this;
			/* Attach fetched data to the controller instance */
			_this.data = fetch.data.data;	
			
			$rootScope.pageTitle = fetch.data.data.name;			
			$rootScope.currentPath = fetch.data.data.path;
								
			/* Get everything in the path (except siteRoot - TODO: do we ever need siteRoot) */	
			angular.forEach($rootScope.currentPath, function(id) {
				if(id != $rootScope.settings.siteRootId) {
					sitemap.batchFetch(id);
				}
			});		
			
		}
		
	}
	
})();