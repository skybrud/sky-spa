(function() {
	'use strict';
	angular.module('skySpa').animation('.view', viewAnimation);

	viewAnimation.$inject = ['skyDirection','$animate', '$rootScope'];
	function viewAnimation(skyDirection: sky.ISkyDirectionService, $animate: ng.IAnimateService, $rootScope) {

		var scope = $rootScope.$new();

		var ani = {
			enter(element, done) {
				var direction = skyDirection.getDirection();

				if (direction + 'Enter' in animations) {
					animations[direction + 'Enter'](element, done);
				} else {
					done();
				}

			},
			leave(element, done) {
				var direction = skyDirection.getDirection();

				if (direction + 'Leave' in animations) {
					animations[direction + 'Leave'](element, done);
				} else {
					done();
				}
			}
		};

		var animations = {
			defaultEnter(ele, done) {
				TweenLite.set(ele, {
					position: 'absolute',
					opacity: 0,
					zIndex: -1
				});

				var once = scope.$on('pageTransition:atTop', function(event, config) {
					TweenLite.set(ele, {
						clearProps: 'all'
					});
					done();
					once();
				});
			},
			defaultLeave(ele, done) {
				var scrollY = window.scrollY || window.pageYOffset;
				if (scrollY > 0) {
					var scroll = {
						y: scrollY
					};
					TweenLite.to(scroll, 0.3, {
						y: 0,
						ease: Cubic.easeInOut,
						onUpdate() {
							window.scrollTo(0, scroll.y);
						},
						onComplete() {
							scope.$broadcast('pageTransition:atTop', {});
							done();
						}
					});
				} else {
					scope.$broadcast('pageTransition:atTop', {});
					done();
				}

			}
		};


		return ani;

	}	
	
})();