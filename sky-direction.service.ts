declare module sky {
	interface ISkyDirectionService {
		getDirection():string;
		setDirection(direction:string):string;
		getToPage(): any;
	}
}

(function() {
	'use strict';
	
	angular.module('skySpa').service('skyDirection', skyDirectionService);
	
	skyDirectionService.$inject = ['$rootScope', 'pageContentCache', '$state'];
	
	function skyDirectionService($rootScope, pageContentCache, $state) {
		var direction = 'noAni';
		var currentPage:any = {};
		var previousPage:any = {};

		var getToPage = function() {
			return angular.copy(currentPage);
		}
	
		var getDirection = function() {
			return direction;
		};
	
		var setDirection = function(dir) {
			direction = dir;
			return direction;
		};
	
		var determineAnimation = function(current, previous) {
			/** Here goes special-animations */

			if (!Object.keys(pageContentCache.getFromCache(current.path)).length || (previous && !Object.keys(pageContentCache.getFromCache(previous.path)).length)) {
				// go to/from 404 with no animation
				setDirection('noAni');
				return direction;
			}

			currentPage = pageContentCache.getFromCache(current.path).data.data;
			if (previous) {
				previousPage = pageContentCache.getFromCache(previous.path).data.data;
			}

			if(!previous) {
				if (currentPage.templatename === 'EssFoodOversigtsside.html') {
					setDirection('frontIntro');
				} else if (currentPage.templatename === 'EssFoodMedarbejderoversigt.html' || currentPage.templatename === 'EssfoodProduktkatalog.html' || currentPage.templatename === 'EssFoodUnderside.html') {
					setDirection('subIntro');
				} else {
					setDirection('noAni');
				}
				return direction
			}

			//navigating around the frontpage bubles
			if (previousPage.templatename === 'EssFoodOversigtsside.html' && currentPage.templatename === 'EssFoodOversigtsside.html') {
				setDirection('bublechange');
				return direction;
			}

			// from frontpage
			if (previousPage.templatename === 'EssFoodOversigtsside.html') {
				setDirection('frontToSub');
				return direction;
			}

			// to frontpage
			if (currentPage.templatename === 'EssFoodOversigtsside.html') {
				setDirection('subToFront');
				return direction;
			}


			//otherwise just wipe it...
			setDirection('wipe');
			return direction;
		};
	
		determineAnimation($state.params, null)

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			determineAnimation(toParams, fromParams);
		});
		
		return {
			getDirection: getDirection,
			setDirection: setDirection,
			getToPage: getToPage
		};
	}
	
})();