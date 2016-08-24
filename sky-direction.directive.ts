(function() {
	'use strict';

	/**
	 *	#Usage:
	 *	<a href="#url" sky-direction="#directionName"></page-info>
	 *
	 * 	Forces skyDirection to specific name on click
	 *
	 **/

	angular.module('skySpa').directive('skyDirection', skyDirectionDirective);

	skyDirectionDirective.$inject = ['skyDirection'];
	function skyDirectionDirective(skyDirection) {
		return {
			restrict: 'A',
			link: link
		};

		function link(scope, element, attrs) {
			let binding = attrs.$watch('skyDirection', (direction) => {
				if(direction) {
					element[0].addEventListener('click', function() {
						skyDirection.setDirection(direction);
					});

					binding();
				}
			});
		}
	}
})();
