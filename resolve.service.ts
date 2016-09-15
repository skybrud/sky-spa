/**
 *
 * Resolve service
 * 
 * Maintains array of promises that need to resolve before allowing a state change to occur.
 * 
 * Intended for minor uses where fetch data is not needed, for instance animations that
 * need to finish before a state change.
 * 
 */


declare module sky {
	interface IResolveService {
		add(promise:ng.IPromise<any>):ng.IPromise<any>;
		all():ng.IPromise<any>;
	}
}

(function() {
	'use strict';
	
	angular.module('skySpa').service('resolve', resolve);

	resolve.$inject = ['$q'];
	function resolve($q) {
		let allResolves = [];
		
		this.all = function() {
			return $q.all(allResolves).then(clear);
		}

		this.add = function add(promise:ng.IPromise<any>) {
			let indexOf = allResolves.indexOf(promise);

			if(indexOf !== -1) {
				indexOf = allResolves.push(promise);
			}
	
			return allResolves[indexOf];
		}

		function clear() {
			allResolves.length = 0;
		}

	}

})();