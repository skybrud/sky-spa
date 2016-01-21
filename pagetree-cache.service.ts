declare module sky {
	interface IPage {
		id: number;
		hasChildren: boolean;
		children: IPage[];
		parentId: number;
		url: string;
	}
	interface IPagetreeCacheService {
		add(page: IPage): void;
		get(id: number): IPage;
		empty(): void;
	}
}

(function() {
	'use strict';
	
	angular.module('skySpa').service('pagetreeCache', pagetreeCacheService);
	
	pagetreeCacheService.$inject = [];
	
	function pagetreeCacheService() {
		var _this = this;
		
		var pageTreeCache = {};
						
		_this.add = function(obj) {
			if(obj.hasChildren) {
				if(obj.children != null) {
					var children = angular.copy(obj.children);
					obj.children = [];
					angular.forEach(children, function(child) {
						obj.children.push(child.id);
						_this.add(child);
					});
				} 
			} else {
				obj.children = [];	
			}
			
			pageTreeCache[obj.id] = obj;
		}
		
		_this.empty = function() {
			angular.forEach(pageTreeCache, (value, key) => {
				delete pageTreeCache[key];
			});
		}
 		
		
		_this.get = function(id) {
			return pageTreeCache[id];
		}
		
		return _this;
	}
	
})();