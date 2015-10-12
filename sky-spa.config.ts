(function() {
	'use strict';
	
	angular.module('skySpa').config(config);

	config.$inject = ['$stateProvider', '$locationProvider'];
	
	function config($stateProvider, $locationProvider) {
		
		$locationProvider.html5Mode(true);
	
		$stateProvider.state('root', {
			url: '*path',
			resolve: {
				fetch:fetch,
				preload:preload
			},
			templateProvider: templateProvider,
			controller: controller,
			controllerAs: 'stateCtrl',
		});


		preload.$inject = ['fetch','$q','skyCrop','skyMediaQuery'];
		function preload(fetch, $q, skyCrop: sky.ISkyCropService, skyMediaQuery) {
			//Preload topImage if exists
			if (fetch.data.data.topImage) {
				var defer = $q.defer();

				var img = document.createElement('img');
				img.onload = defer.resolve;
				img.onerror = defer.resolve
				setTimeout(defer.resolve,1000);

				var orgImageSize = skyCrop.infoFromSrc(fetch.data.data.topImage);

				img.src = skyMediaQuery.is('phone') ? 
							skyCrop.getUrl(fetch.data.data.topImage.slice(0, fetch.data.data.topImage.indexOf('?')), orgImageSize, { width: window.innerWidth, height: 300 }, 'cover', 50) :
							skyCrop.getUrl(fetch.data.data.topImage.slice(0, fetch.data.data.topImage.indexOf('?')), orgImageSize, {width:window.innerWidth*0.75, height:window.innerHeight-250}, 'cover', 50);

				return defer.promise;
			}
		}

		fetch.$inject = ['$stateParams', '$rootScope', '$q', 'pageContentCache'];
		function fetch($stateParams, $rootScope, $q, pageContentCache:sky.IPageContentCacheService) {
			
			document.body.classList.add('loading');

			var deferred = $q.defer();
				
			pageContentCache.get($stateParams.path).then(deferred.resolve, handleError);
			
			return deferred.promise;
			
			function handleError(res) {		
				if(res.status === 404) {
					console.warn('404: page not found');
					deferred.resolve({
						data:{
							error: 404,
							data:{
								templatename: 'error.html',
								name: 'Siden findes ikke',
								msg: '',//res.data.meta.error,
								path: [$rootScope.settings.siteRootId]
							}
						}
					});
				} else {
					console.warn(res.status+': '+res.statusText);

					deferred.resolve({
						data:{
							error: res.status,
							data: {
								templatename: 'error.html',
								name: 'Der er sket en fejl',
								msg: res.data.meta.error || 'Ukendt fejl (Fejl: '+res.status+')',
								path: [$rootScope.settings.siteRootId]
							}
						}
					});
				}
			}
			
		}
		
		templateProvider.$inject = ['fetch', '$templateCache'];
		function templateProvider(fetch, $templateCache) {
					
			/* Select template based on server-response */
			var template = $templateCache.get('/layout/'+fetch.data.data.templatename);
			
			if(!template) {
				/* TODO: handle when there is no matching template  */
				console.warn('Template doesn\'t exist! Reload page?');
			}
			
			return template; 
		}
		
		controller.$inject = ['fetch', '$rootScope', 'sitemap'];
		function controller(fetch, $rootScope, sitemap: sky.ISitemapService) {
			document.body.classList.remove('loading');
			var _this = this;
			/* Attach fetched data to the controller instance */
			_this.data = fetch.data.data;	
			
			$rootScope.pageTitle = fetch.data.data.name;			
			$rootScope.currentPath = fetch.data.data.path;
					
			if(fetch.data.error) {
				_this.statusText = fetch.data.data.msg;
				return; 
			}
			
			/* Get everything in the path (except siteRoot - TODO: do we ever need siteRoot) */	
			angular.forEach($rootScope.currentPath, function(id) {
				if(id != $rootScope.settings.siteRootId) {
					sitemap.batchFetch(id);
				}
			});		
			
		}
		
	}
	
})();