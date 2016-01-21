declare module sky {
	interface ISkyDirectionService {
		getDirection(): string;
		setDirection(direction: string): string;
		getToPage(): any;
	}
}

(function() {
	'use strict';
	
	angular.module('skySpa').service('skyDirection', skyDirectionService);
	
	skyDirectionService.$inject = ['$rootScope', 'pageContentCache', '$state'];
	
	function skyDirectionService($rootScope, pageContentCache, $state) {
		var direction = 'noAni';
		var currentPage: any = {};
		var previousPage: any = {};

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
				setDirection('noAni');
				return direction
			}

			//otherwise use default
			setDirection('default');
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