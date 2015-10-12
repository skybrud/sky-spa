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

		var isMobile = window.matchMedia("(max-width: 767px)");


		var animations = {
			frontIntroEnter(element, done) {
				document.body.classList.add('fifty');

				window.scrollTo(0, 0);
				$rootScope.backgroundImage = '/img/5897es/background.jpg';

				if (isMobile.matches) {
					animations['bublechangeEnter'](element, done);
				} else {
					document.body.classList.add('full');

					var areaMenu = element[0].querySelector('.area-menu');
					var fieldset = element[0].querySelector('fieldset')
					var circles = element[0].querySelector('.circles');			
					TweenLite.set([areaMenu, fieldset, circles], {
						opacity: 0
					});

					document.body.classList.add('no-ani');
					setTimeout(function() {
						document.body.classList.remove('no-ani');
						document.body.classList.remove('full');
					}, 1500);

					setTimeout(function() {
						TweenLite.set(circles, {
							opacity: 1
						});

						TweenLite.to([areaMenu, fieldset], 1, {
							opacity: 1,
							onComplete() {
								TweenLite.set([areaMenu, fieldset], {
									clearProps: 'all'
								});
							}
						});

						animations['bublechangeEnter'](element, done);
					}, 2200);

				}		
			},
			subIntroEnter(element, done) {
				var headerBg = element[0].querySelector('.bg');
				var breadcrumb = element[0].querySelector('breadcrumb');
				var scrollArrow = element[0].querySelector('es-scroll-down');
				var header = element[0].querySelector('h1');
				var teaser = element[0].querySelector('.teaser');

				TweenLite.from(headerBg, 4, {
					y: 100,
					delay: 0.2,
					ease: Expo.easeOut,
					onComplete() {
						done();
					}
				});

				TweenLite.from([breadcrumb, scrollArrow], 1, {
					opacity: 0,
					delay: 1.2
				});

				TweenLite.from(header, 1.5, {
					opacity: 0,
					y: 30,
					delay: 1,
					ease: Expo.easeOut
				});
				TweenLite.from(teaser, 1.5, {
					opacity: 0,
					y: 30,
					delay: 1.1,
					ease: Expo.easeOut
				});
			},
			subIntroLeave(element, done) {
				done();
			},
			wipeEnter(element, done) {
				TweenMax.set(element[0], {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					zIndex:1
				});

				var colorTop = element[0].querySelector('.color-top, .img-top');
				var icon = element[0].querySelector('.icon-circle');

				var once = scope.$on('wipeLeave:ready', function(event, config) {
					TweenLite.from(icon, 1, {
						top: config.iconTop,
						delay: 0.6
					});
					TweenLite.from(colorTop, 1, {
						height: config.height,
						delay: 0.6,
						onComplete() {
							TweenLite.set([element, icon, colorTop], {
								clearProps: 'all'
							});
							done();
						}
					});
					once();
				});	
			},
			wipeLeave(element, done) {
				var scrollY = window.scrollY || window.pageYOffset;
				var outer = element[0].querySelector('.wipe-outer');
				var inner = element[0].querySelector('.wipe-inner');

				TweenMax.set(element[0], {
					position: 'relative',
					zIndex:2
				});

				if (scrollY > 0) {
					var scroll = {
						y: scrollY
					};
					TweenLite.to(scroll, 0.6, {
						y: 0,
						ease: Cubic.easeInOut,
						onUpdate() {
							window.scrollTo(0, scroll.y);
						},
						onComplete: wipe
					});
				} else {
					wipe();
				}

				function wipe() {

					if (element[0].querySelectorAll('.img-top').length) {
						// has image top (variable height)

						scope.$broadcast('wipeLeave:ready', { 
							height: element[0].querySelector('.img-top').clientHeight,
							iconTop: element[0].querySelector('.icon-circle').offsetTop
						});
					} else {
						// has color-top (fixed height)
						scope.$broadcast('wipeLeave:ready', { 
							height: element[0].querySelector('.color-top').clientHeight,
							iconTop: element[0].querySelector('.icon-circle').offsetTop
						});
					}
					
					TweenLite.set(outer, {
						overflow: 'hidden'
					});

					TweenLite.fromTo(outer, 0.6, {
						xPercent: 0
					}, {
						xPercent: 100,
						ease: CustomEase.byName('smoothOut')
					});

					TweenLite.fromTo(inner, 0.6, {
						xPercent: 0
					},{
						xPercent: -100,
						ease: CustomEase.byName('smoothOut'),
						onComplete() {
							done()
						}
					});
				}
			},
			subToFrontEnter(element, done) {
				TweenMax.set(element[0], {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
				});

				var leftOuter = element[0].querySelector('.left-outer');
				var leftInner = element[0].querySelector('.left-inner');
				var rightOuter = element[0].querySelector('.right-outer');

				var pageLeft = element[0].querySelector('.page-left');
				var pageRight = element[0].querySelector('.page-right');
				var footerLeft = element[0].querySelector('.page-left footer');
				var branding = element[0].querySelector('.branding');

				leftOuter.classList.add('transparent');

				TweenLite.from(branding, 0.8, {
					xPercent: -150,
					delay:0.4
				});

				setTimeout(function() {
					animations['bublechangeEnter'](element, done);
				},0.6);			
			},
			subToFrontLeave(element, done) {
				$rootScope.backgroundImage = '/img/5897es/background.jpg';

				TweenMax.set(element[0], {
					position: 'relative',
					zIndex: 1
				});
				var menu = element[0].querySelector('.left-menu');
				var leftOuter = element[0].querySelector('.left-outer');
				var outer = element[0].querySelector('.wipe-outer');
				var inner = element[0].querySelector('.wipe-inner');
				
				var pageRight = element[0].querySelector('.page-right');
				var pageLeft = element[0].querySelector('.page-left');

				TweenLite.set([pageRight,pageLeft],{
					transitionDelay:'10s'
				});


				TweenLite.set(outer, {
					overflow: 'hidden',
				});

				document.body.classList.add('fifty');
				
				// Wipe start
				TweenLite.fromTo(outer, 0.6, {
					xPercent: 0
				}, {
					xPercent: 100,
					ease: CustomEase.byName('smoothOut')
				});
				TweenLite.fromTo(inner, 0.6, {
					xPercent: 0
				}, {
					xPercent: -100,
					ease: CustomEase.byName('smoothOut'),
					onComplete() {
						done()
					}
				});

				TweenLite.to(menu, 0.45, {
					xPercent: 150,
					delay:0.15
				});
			},
			frontToSubEnter(element, done) {
				$rootScope.backgroundImage = '';
				TweenMax.set(element[0], {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0
				});

				var cloned = element[0].querySelector('.icon-circle.cloned');
				var headerBg = element[0].querySelector('.bg');
				var breadcrumb = element[0].querySelector('breadcrumb');
				var scrollArrow = element[0].querySelector('es-scroll-down');
				var header = element[0].querySelector('h1');
				var teaser = element[0].querySelector('.teaser');

				var menu = element[0].querySelector('.left-menu');
				
				var pageRight = element[0].querySelector('.page-right');

				TweenLite.set(pageRight, {
					opacity: 0
				});

				TweenLite.set(cloned, {
					display: 'block'
				});
				
				var circlePos = cloned.getBoundingClientRect();

				var rects = {
					top: circlePos.top,
					left: circlePos.left,
					width: circlePos.width,
					height: circlePos.height
				};

				TweenLite.from(menu, 0.45, {
					xPercent: 150,
					delay:0.75
				})

				setTimeout(function() {
					TweenLite.set(pageRight, {
						opacity: 1
					});
					TweenMax.set(element[0], {
						top:0,
					});
					TweenLite.fromTo(cloned,0.8, {
						scale: calcFillRadius(rects),
					},{
						scale:1,
						ease:Cubic.easeInOut,
						onComplete() {
							TweenLite.set([cloned,element[0]], {
								clearProps:'all'
							});
							//Dispatch a resize-event, so skySwipe will get dimensions correct after the animation

							var event = document.createEvent('Event');
							event.initEvent('resize', true, true);
							window.dispatchEvent(event);
							done();
							
						}
					});

					TweenLite.from(headerBg,4,{
						y:100,
						delay:0.2,
						ease:Expo.easeOut
					});

					TweenLite.from([breadcrumb, scrollArrow], 1, {
						opacity: 0,
						delay: 1.2
					});

					TweenLite.from(header, 1.5, {
						opacity: 0,
						y:30,
						delay: 1,
						ease:Expo.easeOut
					});
					TweenLite.from(teaser, 1.5, {
						opacity: 0,
						y: 30,
						delay: 1.1,
						ease: Expo.easeOut
					});

				},750);
			},
			frontToSubLeave(element, done) {

				var scrollY = window.scrollY || window.pageYOffset;

				TweenMax.set(element[0], {
					position: 'relative',
					zIndex: 1
				});

				var branding = element[0].querySelector('.branding');
				var pageRight = element[0].querySelector('.page-right');
				var pageLeft = element[0].querySelector('.page-left');
				var footerLeft = element[0].querySelector('.page-left footer');
				var footerRight = element[0].querySelector('.page-right footer');

				//first, lets find the circle-icon that was clicked...
				var circle = element[0].querySelector('.circles a[href="' + skyDirection.getToPage().url + '"]');

				if (circle) {

					var circlePos = circle.querySelector('.fill').getBoundingClientRect();

					var clone = angular.element(document.createElement('div'));
					var rects = {
						top: scrollY + circlePos.top,
						left: circlePos.left,
						width: circlePos.width,
						height: circlePos.height
					};

					TweenLite.set([pageRight, pageLeft, footerLeft, footerRight], {
						transitionDelay: '10s'
					});

					clone.addClass('clone');
					clone.addClass(circle.className);
					clone.css({
						top: scrollY + circlePos.top + 'px',
						left: circle.offsetParent.offsetLeft + 'px',
						zIndex: 999
					});

					element[0].querySelector('.page-right .content').appendChild(clone[0]);

					TweenLite.to(clone, 0.8, {
						scale: calcFillRadius(rects) + 2,
						ease: Expo.easeInOut
					});
				}

				document.body.classList.remove('fifty');

				TweenLite.to(branding, 0.8, {
					xPercent: -100,
					onComplete() {
						window.scrollTo(0, 0);
						done();
					}
				});
			},
			bublechangeEnter(element, done) {
				var items = element[0].querySelectorAll('.circles li');

				TweenMax.set(element[0], {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					zIndex: 1
				});

				var timelines = [];

				angular.forEach(items, function(item) {

					// dont tween the empty placeholders... 
					if (item.classList.contains('empty')) {
						return;
					}

					var icon = item.querySelector('svg');
					var title = item.querySelector('.title');

					var tl = new TimelineMax({ paused: true });

					tl.from(item, 0.3, {
						scale: 0,
						clearProps: 'all',
						ease: Cubic.easeOut
					}, 0.1);

					if (title) {
						tl.from(title, 0.5, {
							opacity: 0,
							y: -30,
							clearProps: 'all',
							ease: Cubic.easeOut,
						}, -0.2);
					}

					if (icon) {
						tl.from(icon, 0.3 * 2, {
							scale: 1.2,
							opacity: 0,
							clearProps: 'all',
							ease: Sine.easeOut,
						}, 0.3);
					}

					timelines.push(tl);
				});

				setTimeout(function() {
					TweenMax.staggerTo(timelines, 1, {
						progress: 1
					}, 0.05, function() {
						// last stagger done
						TweenMax.set(element[0], {
							clearProps: 'all'
						});
						done();
					});

					if (!items.length) {
						TweenMax.set(element[0], {
							clearProps: 'all'
						});
						done();
						return;
					}
				}, 400); //start the animation after 400ms 
			},
			bublechangeLeave(element, done) {
				var items = element[0].querySelectorAll('.circles li');

				if (!items.length) {
					setTimeout(done, 400);
					done();
					return;
				}

				TweenMax.set(element[0], {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0
				});

				var timelines = [];

				angular.forEach(items, function(item) {

					// dont tween the empty placeholders... 
					if (item.classList.contains('empty')) {
						return;
					}

					var icon = item.querySelector('svg');
					var title = item.querySelector('.title');

					TweenLite.set([icon, title], {
						transition: 'none'
					});

					var tl = new TimelineMax({ paused: true });

					TweenMax.killTweensOf(item);

					tl.to(item, 0.3, {
						scale: 0,
						ease: Cubic.easeInOut
					}, 0.1);

					if (title) {
						TweenMax.killTweensOf(title);

						tl.to(title, 0.2, {
							opacity: 0,
							y: -30,
							ease: Cubic.easeInOut,
						}, 0);
					}

					if (icon) {
						TweenMax.killTweensOf(icon);

						tl.to(icon, 0.2, {
							scale: 1.2,
							opacity: 0,
							ease: Sine.easeInOut,
						}, 0);
					}

					timelines.push(tl);

				});

				TweenMax.staggerTo(timelines, 0.5, {
					progress: 1
				}, 0.05, function() {
					//last stagger done
					done();
				});
			}
		};

		function calcFillRadius(elementRect) {
			var viewport = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			var maxDistanceToViewEdges = {
				x: Math.max(viewport.width - elementRect.left, viewport.width - (viewport.width - elementRect.left)),
				y: Math.max(viewport.height - elementRect.top, viewport.height - (viewport.height - elementRect.top)),
			};

			var circleRadius = Math.sqrt(Math.pow(maxDistanceToViewEdges.x, 2) + Math.pow(maxDistanceToViewEdges.y, 2));

			return Math.ceil(circleRadius * 2 / elementRect.width);
		}


		return ani;

	}	
	
})();