"use strict";
// Change lat long to your location. You can add multiple markers.
var sites = [['Berg Restaurant', 51.104411, 17.01300, 1]];

var $ = jQuery.noConflict();

$(document).ready(function(){
	$('.loading-wrapper img').imagesLoaded(function() {
		$(this).addClass('ready');
	});

	//initNewMap();
	navbar.init();
	mobileNav.show();
	subnav.show();
	blog.init();
	unveil.init();
	// homeSlider.init();
	reviews.init();
	gallery.init();
	menu.init();
	overlay.init();

	$(".player").mb_YTPlayer();

	$(".video-controls .pause").click(function() {
		$(".player").pauseYTP();
		$(".video-controls .pause").addClass('hidden');
		$(".video-controls .play").removeClass('hidden');
	});

	$(".video-controls .play").click(function() {
		$(".player").playYTP();
		$(".video-controls .play").addClass('hidden');
		$(".video-controls .pause").removeClass('hidden');
	});

	$(".video-controls .fullscreen").click(function() {
		$(".player").fullscreen();
	});

	$('.to-the-top').click(function(e) {
		e.preventDefault();
		$('body').velocity("scroll", { duration: 1000});
	});
});

$(window).load(function() {
	homeSlider.init();

	$('#preloader').delay(1300).velocity({opacity: 0}, 500, function() {
		$(this).hide();
		animate_elements();
	});

	rating.init();
});

function animate_elements() {
	if (!ipad && !mobile) {
		if ($.waypoints) {
			var $obj=$('.yo-anim').each(function() {
				var delay=$(this).data('animation-delay');
				$(this).waypoint(function() {
					if (delay) {
						var $this=$(this);
						setTimeout(function() {
							$this.addClass('yo-anim-start');
						}, delay);
					} else {
						$(this).addClass('yo-anim-start');
					}
				}, {
					offset: '90%',
					triggerOnce: true
				});
			});
		}
	} else {
		$('.yo-anim').removeClass('yo-anim');
	}
}

var backgroundParallax = {
	init: function() {
		if ($('.parallax-layer').length > 0) {
			$('.home-parallax').parallaxify({
				parallaxBackgrounds: false,
				parallaxElements: true,
				alphaFilter: 0.9,
				positionProperty: 'transform',
			});
		}
	}
};

var unveil = {
	init : function() {
		$(".unveil img").unveil(-50, function() {
			$(this).load(function() {
				$(this).parents('.unveil').addClass('loaded');
			});
		});
	},
};

var overlay = {
	carousel: false,
	isLarge: false,
	isAnimating: false,
	init: function() {
		var that = this;
		$('body').on('click', '.open-overlay', function(e) {
			e.preventDefault();
			$('html').addClass('mobile-overflow');
			that.open($(this).attr('href'), this);
		});

		$('.gallery-wrapper').on('click', '.close-button, .close-overlay', function(e) {
			e.preventDefault();
			that.close();
			$('html').removeClass('mobile-overflow');
		});
	},
	initCarousel: function(current) {
		var owl = $('#images');

		owl.on('onChangeState', function(e) {
			$('#gallery #images .owl-item img').each(function(i, el) {
				if (el.offsetWidth !== 0) {
					$(el).css('margin-left', - (el.width / 2));
				}
				if (el.offsetHeight !== 0){
					$(el).css('margin-top', - (el.height / 2));
				}
			});
		});

		owl.on('onResponsiveAfter', function(e) {
			$('#images .owl-item img').each(function(i, el) {
				if (el.offsetWidth !== 0) {
					$(el).css('margin-left', - (el.offsetWidth / 2));
				}
				if (el.offsetHeight !== 0) {
					$(el).css('margin-top', - (el.offsetHeight / 2));
				}
			});
		});

			var loop = true;

			if ($(owl).find('.item').length === 1) {
				loop = false;
			}

			owl.owlCarousel({
			video: true,
			videoWidth: false,
			videoHeight: false,
			items: 1,
			loop: loop,
			merge: false,
			nav: true,
			slideSpeed: 2000,
			dots: false,
			startPosition: current,
			callbacks: true,
			navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
			responsiveClass: false,
			onInitialized: function() {
				this._plugins.navigation._controls.$container.prependTo($(".controls"));
				if ($(owl).find('.item').length === 1) {
					$('.controls').hide();
				}

				$('#gallery #images .owl-item img').each(function(i, el) {
					$(el).parent().imagesLoaded(function() {
						if(el.offsetWidth !== 0) {
							$(el).css('margin-left', - (el.width / 2));
						}
						if(el.offsetHeight !== 0) {
							$(el).css('margin-top', - (el.height / 2));
						}
						$(el).parent().addClass('loaded');
					});
				});
				$('.owl-video-wrapper').addClass('loaded');
			},
			onResized: function() {
				$('#gallery #images .owl-item img').each(function(i, el) {
					$(el).parent().imagesLoaded(function() {
						if(el.offsetWidth !== 0) {
							$(el).css('margin-left', - (el.width / 2));
						}
						if(el.offsetHeight !== 0) {
							$(el).css('margin-top', - (el.height / 2));
						}
					});
				});
			},
		});

		$(document.documentElement).on('keyup.portfolio', function(event) {
			// handle cursor keys
			if (event.keyCode === 37) {
				$('#images').data('owlCarousel').prev();
			} else if (event.keyCode === 39) {
				$('#images').data('owlCarousel').next();
			}
		});
	},
	open: function(url, element) {
		var that = this;
		if (url === undefined || url === '') {
			return false;
		}

		if (/\.(jpg|png|gif|jpeg)$/.test(url)) {
			var response = '';
			var current = 0;
			
			if (element.rel) {
				$('a[rel='+element.rel+']').each(function(i, el) {
					response += '<div class="item"><figure><img class="" src="'+el.href+'" /></figure></div>';
					if (el === element) {
						current = i;
					}
				});
			} else {
				response = '<div class="item"><figure><img src="'+element.href+'" /></figure></div>';
			}

			response = '<section id="gallery"><div class="gallery-content fullscreen"><a class="close-button"><i class="icon-close"></i></a><div class="gallery"><div class="loading-spinner"></div><div id="images" class="owl-carousel owl-theme">'+response+'</div><div class="controls"></div></div></div></section>';
			$('.gallery-wrapper').html(response);
			$('body').css('overflow-y', "hidden");
			$('.gallery-wrapper').show(0, function() {
				that.initCarousel(current);
				var owl = $('.gallery .owl-carousel');

				$(this).velocity({ opacity: 1}, function() {
					$(this).find('.owl-stage-outer').velocity({ opacity : 1 });
				}).addClass('overlay-active');
			});
		} else {
			$.get(url , function(response) {
				$('.gallery-wrapper').html(response);
				$('body').css('overflow-y', "hidden");
				$('.gallery-wrapper').show(0, function() {
					that.initCarousel();
					$(this).velocity({opacity: 1}, function() {
						$(this).find('.owl-stage-outer').velocity({opacity : 1});
					}).addClass('overlay-active');
				});
			}, 'html');
		}
	},
	close: function() {
		var that = this;
		var owl = $('.owl-carousel');

		$('body').css("overflow-y", "auto");
		$('.gallery-wrapper').velocity({opacity: 0}, {
			duration: 500,
			complete: function() {
				$(this).removeClass('overlay-active').hide();
				$(document.documentElement).off('keyup.portfolio');
				that.isLarge = false;
				that.isAnimating = false;
				$(".gallery-wrapper").removeClass('full-image');
				$('.gallery-wrapper').removeClass('large-image');
			}
		});
	},
	destroy: function() {
	}
};

var sectionIntro = {
	state : true,
	factor : 0.2,
	animated : false,
	initHeaders : true,
	autoscroll : true,
	
	init: function() {
		var that = this;
		var $body = $('body');

		if ($body.hasClass('no-intro')) {
			setTimeout(function() {
				$body.trigger('intro-end');
			}, 300);

			return false;
		} else if ($body.hasClass('intro-top')) {
			$('.section-intro .bg-section').removeClass('opacity-'+$('.section-intro').data('opacityEnd')).addClass('opacity-'+$('.section-intro').data('opacityStart'));
			that.state = false;
			setTimeout(function() {
				that.parallaxInit();
				$body.trigger('intro-end');
			}, 300);

			return false;
		}

		if ($body.hasClass('intro-fullscreen')) {
			if ($body.hasClass('intro-end')) {
				that.parallaxInit();
				return false;
			}

			if ($body.hasClass('scroll-down') && that.autoscroll === true) {
				that.autoscroll = false;
				that.scrollDown();
				return false;
			}

			$('.section-intro .arrow1').bind('click', function(e) {
				e.preventDefault();
				$('.section-intro .arrow1').unbind('click');
				$('.arrow1').fadeOut();
				that.scrollDown();
			});

			$('.section-intro .bg-section').addClass('opacity-'+$('.section-intro').data('opacityStart'));
			$body.addClass('intro-start');
			var $el = $('.section-scroll');

			$el.waypoint(function(direction) {
				if (direction === 'down' && that.state === true) {
					that.scrollDown();
				}
			}, {offset: '99%'});
		}
	},
	scrollDown: function() {
		var that = this;
		var $body = $('body');
		$('.arrow1').fadeOut();
		// $('.pre-content').transition({ }, 200, function(){
			
		setTimeout(function() {
			$body.removeClass('intro-start').addClass('intro-animating');

			$('html, body').animate({scrollTop: 0});
			that.state = false;
			setTimeout(function() {
				that.parallaxInit();
				$('.section-intro .bg-section').removeClass('opacity-'+$('.section-intro').data('opacityStart')).addClass('opacity-'+$('.section-intro').data('opacityEnd'));
				$body.removeClass('intro-animating').addClass('intro-end');
				$('html, body').animate({scrollTop: 0});
				$('body').trigger('intro-end');
				that.backToTop();
				// $('.pre-content').hide();
				$('.arrow2').fadeIn();
			}, 700);
		}, 200);
	},
	backToTop: function() {
		var that = this;
		var $body = $('body');

		$('.section-intro .arrow2, .section-intro.close-on-click').bind('click', function(e) {
			e.preventDefault();
			$('.section-intro .arrow2, .section-intro.close-on-click').unbind('click');
			$('.arrow2').fadeOut();
			that.back();
		});
	},
	back: function() {
		var that = this;
		var $body = $('body');

		$('body, html').animate({scrollTop :0}, 250);
		$('body').velocity("scroll", { duration: 250 });
		$('.section-intro').unbind('click.back-to-top');

		$body.removeClass('intro-end').addClass('out');
		that.state = true;
		setTimeout(function() {
			$body.removeClass('out').addClass('intro-start');
			that.destroy();
		}, 270);

		setTimeout(function() {
			$('.section-intro .bg-section').removeClass('opacity-'+$('.section-intro').data('opacityEnd')).addClass('opacity-'+$('.section-intro').data('opacityStart'));
			that.init();
			$('.arrow1').fadeIn();
		},1200);
	},
	parallax: function() {
		if (mobile || ipad) {
			return false;
		}

		var that = this;
		if (($(window).scrollTop() * that.factor) <= ($(window).height() * 0.5) - 200) {
			$('.section-intro-parallax').velocity({ translateY: $(window).scrollTop()*-(that.factor) }, { duration : 0});
			if(that.animated === true) {
				that.animated = false;
			}
		} else {
			if(that.animated === false) {
			$('.section-intro-parallax').velocity({ translateY: -($(window).height()* 0.5) + 200 },  { duration : 0});
				that.animated = true;
			}
		}

		return true;
	},
	parallaxInit: function() {
		var that = this;
		var scrolled = 0;

		if ($('.section-intro').hasClass('section-intro-parallax') && that.state === false) {
			$(window).on('scroll', function(){
				that.parallax();
			});
		}
	},
	destroy: function() {
		var $body = $('body');
		$.waypoints('destroy');
		this.initHeaders = true;
		$(window).unbind('scroll');
		$('.section-fullscreen').velocity({ translateY : 0}, { duration : 0});
		$('.first-header').velocity({ translateY : 0} , { duration : 0});
	},
	destroyMobile: function() {
		$('.pre-content').attr('style', '');
	},
	mobileInit: function() {
		$('.section-intro .bg-section').removeClass('opacity-'+$('.section-intro').data('opacityEnd')).addClass('opacity-'+$('.section-intro').data('opacityStart'));
	}
};

var menu = {
	init: function() {
		var that = this;

		$('.mixitup').mixItUp({
			animation: {
				animateResizeContainer: false,
				effects: 'fade',
				easing: 'ease',
			},
			layout: {
				display: 'block'
			},
			load: {
				filter: document.location.hash === '' ? 'all' : ('.' + document.location.hash.substring(1))
			},
			callbacks: {
				onMixEnd: function(state, futureState) {
					that.lazyLoad();
					var $content = $('.main-section');
					$content.velocity({ height : $('.mixitup').outerHeight()+$('.list-category').height() }, { duration : 600, complete: function(){} });
				},
				onMixStart: function(state, futureState) {
					document.location.hash = futureState.activeFilter.substring(1);
				},
				onMixLoad: function(state, futureState) {
					that.lazyLoad();
					if ($('body').hasClass('intro-fullscreen') && document.location.hash !== '#mix') {
						sectionIntro.scrollDown();
					}

					window.onhashchange = function() {
						$('.mixitup').mixItUp('filter', ('.' + document.location.hash.substring(1)));
					};

					if ($('.mixitup').hasClass('no-images')) {
						that.show();
					}
					that.resize();
				}
			}
		});
	},
	lazyLoad: function() {
		$('.mixitup').find('.mix:visible .menu-item').each(function() {
			var $t = $(this),
			$img = $(this).find('img'),
			src = $img.attr('data-src');

			$img.on('load',function() {
				imgLoaded($img);
			});

			if (!$img.hasClass('lazyloaded')) {
				$img.attr('src',src).addClass('lazyloaded');
			}
		});
	},
	show: function() {
		var state = $('.mixitup').mixItUp('getState');
		var $content = $('.main-section');
		$('#second-menu .menu-item').height($(state.activeFilter + ' .menu-item').width());
		$content.velocity({ height : $('.mixitup').outerHeight()+$('.list-category').height() }, { duration : 0});
	},
	resize: function(el) {
		var that = this;
		$(window).on('resize.menu', function(){
			that.show();
		});
	},
	destroy: function() {
		$(window).off('resize.menu');
		$('#second-menu .menu-item').height('auto');
	}
};

$('body').on('intro-end', function() {
	unveil.init();
	navbar.open();
});

var navbar = {
	wrapper: $('body'),

	init: function() {
		var that = this;
		$('.main-reorder').click(function(e) {
			e.preventDefault();
			if (that.wrapper.hasClass('show-nav')){
				that.close();
			} else {
				that.open();
			}
		});
	},
	open: function() {
		var that = this;
		that.wrapper.addClass('show-nav');
	},
	close: function() {
		var that = this;
		that.wrapper.removeClass('show-nav');
	}
};

var	subnav = {
	show: function() {
		if($('body').hasClass('home-page')) {
			var newHeight = ($(window).height() / 2) - ($('.main-nav').height() / 2) - 80;
			$('.image-subnav').height(newHeight);
			$('.image-subnav div').height(newHeight);
		}
		$('.main-nav ul li').hover(function() {
			subnav = $(this).find('.subnav-wrapper');
			var newPos = $(this).offset().left - subnav.width() / 2 + $(this).width() / 2 + 15;
			var adjustment = 0;

			if (newPos + subnav.width() > $(window).width()) {
				adjustment = newPos + subnav.width() - $(window).width();
			}
			if (newPos < 0) {
				newPos = 0;
			}
			subnav.css('left', newPos - adjustment);
		});
	}
};

var mobileNav = {
	show: function() {
		this.open();
		this.close();
	},
	open: function() {
		$('.reorder a').click(function(e) {
			e.preventDefault();
			if ($('body').hasClass('mobile-nav-show')) {
				$(this).parent().removeClass('flyout-open');

				$('#flyout-container').velocity({height: 0}, { complete: function() {
					$('#flyout-container .open').css('height', 0).removeClass('open');
					$('#flyout-container .subnav-open').removeClass('subnav-open');
				}});
				$('body').removeClass('mobile-nav-show');
			} else {
				$(this).parent().addClass('flyout-open');
				$('#flyout-container').velocity({height: $('#flyout-container .flyout-menu > li').height() * $('#flyout-container .flyout-menu > li').length}, { complete: function() {
					$('#flyout-container').css('height', 'auto');
				}});
				$('body').addClass('mobile-nav-show');
			}
		});

		$('.flyout-menu .open-children').click(function(e) {
			e.preventDefault();
			var that = this;

			if ($(this).next('.subnav').length > 0) {
				//has submenu
				if ($(this).next('.subnav').hasClass('open')) {

					$(this).parent().removeClass('subnav-open');

					$(this).next('.subnav').velocity({height: 0}, { complete: function() {
						$(that).next('.open').removeClass('open');
						$(that).next('.subnav').find('.open').css('height', 0).removeClass('open');
						$(that).next('.subnav').find('.subnav-open').removeClass('subnav-open');
					}});
				} else {
					$(this).parent().addClass('subnav-open');
					$(this).next('.subnav').velocity({height: $(this).next('.subnav').children('li').height() * $(this).next('.subnav').children('li').length}, { complete: function() {
						$(that).next('.subnav').css('height', 'auto').addClass('open');
					}});
				}
			}
		});
	},
	close: function() {
		$('#menu-mobile .menu-item a').on('click', function(e) {
			e.preventDefault();
			var that = this;
			
			$(".flyout-menu .open-children").parent().removeClass('subnav-open');
			$('#flyout-container').velocity({height: 0}, { complete:  function() {
				$('#flyout-container .open').css('height', 0).removeClass('open');
				$('body').removeClass('mobile-nav-show');
			}});
		});
	},
};

var verticalSlider = {
	init: function(autoScrolling) {
		if (mobile) {
			return;
		}

		if ($('body').hasClass('fullpage-scroll')) {
			$('#restaurant').fullpage({
				easing :'swing',
				scrollingSpeed: 500,
				css3: true,
				resize: false,
				autoScrolling: autoScrolling,
				paddingTop: 0,
				paddingBottom: 0,
				normalScrollElementTouchThreshold: 1,
				verticalCentered: false,
				navigation: true,
				navigationPosition: 'right',
			});
		}
	},
};





var footer = {
	init: function() {
		if($('body').hasClass('fixed-footer')) {
			$('#footer-spacer').css('height', $('#footer').outerHeight());
			$(window).on('resize', function(){
				$('#footer-spacer').css('height', $('#footer').outerHeight());
			});
		}
	},
	mobileInit: function() {
		$('#footer-spacer').css('height', 'auto');
	}
};

// if($('body').hasClass('fixed-footer')) {
// $('#footer-spacer').css('height', $('#footer').outerHeight());
//	$(window).on('resize', function(){
//		$('.section-scroll').css('padding-bottom', $('#footer').outerHeight());
//	});

var gallery = {
	init: function() {
		var that = this;
		var first = true;
		$('.gallery-content').mixItUp({
			animation: {
				animateResizeContainer: false,
				effects: 'fade',
				easing: 'ease',
			},
			layout: {
				display: 'inline-block'
			},
			callbacks: {
				onMixEnd: function(){
					that.lazyLoad();
				},

				onMixStart: function(state, futureState){
					var $content = $('#gallery-wrapper');
					var newHeight = 0;
					if(first === true) {
						first = false;
					} else {
						if(futureState.totalShow > 0) {
							newHeight = Math.ceil(futureState.totalShow / $('.gallery-content').data('columns')) * $('.mix').height();
						}
						$content.velocity({ height : newHeight+$('.list-category').height()+$('.section-header').height() }, 600);
					}
				},
				onMixLoad: function(state) {
					that.lazyLoad();
					var $content = $('#gallery-wrapper');
					var newHeight = 0;
					if(state.totalShow > 0) {
						newHeight = Math.ceil(state.totalShow / $('.gallery-content').data('columns')) * $('.mix').height();
					}
					$content.height(newHeight+$('.list-category').height()+$('.section-header').height());
				}
			}
		});
		$('#gallery').on('click', '.load-more-text button, .load-more-text span', function(e) {
			e.preventDefault();
			that.loadMore();
		});
	},
	lazyLoad: function() {
		$('#gallery').find('.mix:visible').each(function() {
			var $t = $(this),
				$img = $(this).find('img'),
				src = $img.attr('data-src');

			$img.on('load',function() {
				imgLoaded($img);
			});

			if (!$img.hasClass('lazyloaded')) {
				$img.attr('src',src).addClass('lazyloaded');
			}
		});
	},
	loadMore: function() {
		var that = this;
		var url = '';

		if ($('#gallery .load-more').length > 0) {
			url = $('#gallery .load-more').data('href');
		}

		if (url === '' || url === undefined) {
			return false;
		}

		$.get(url, function(response) {
			$('.new-content').html(response);
			if($('.new-content .load-more').length > 0) {
				$('#gallery > .load-more').replaceWith($('.new-content .load-more'));
			} else {
				$('#gallery > .load-more').remove();
			}

			$('.gallery-content').mixItUp('append', $('.new-content .mix'));

		}, 'html');

		return true;
	}
};

var blog = {
	init: function() {
		var that = this;
		$('#blog').on('click', '.load-more-text button, .load-more-text span', function(e) {
			e.preventDefault();
			that.loadMore();
		});
	},
	loadMore: function() {
		var that = this;
		var url = '';

		if ($('#blog.blog-content .load-more').length > 0) {
			url = $('#blog.blog-content .load-more').data('href');
		}

		if (url === '' || url === undefined) {
			return false;
		}

		$.get(url, function(response) {
			that.add(response);
		}, 'html');

		return true;
	},
	add: function(response) {
		var oldHeight = $('#blog-content-append').height();

		$('#blog-content-append').height(oldHeight);
		$('#blog.blog-content .load-more').velocity({opacity: 0}, { duration : 400, complete : function() {
			$(this).remove();
			$('#blog-content-append').append(response);
			$('#blog-content-append .load-post').imagesLoaded(function() {
				var newHeight = 0;
				$('.load-post').each(function(i, el) {
					newHeight += $(el).height();
				});

				$('#blog-content-append').velocity({height : oldHeight + newHeight }, { complete : function() {
					$.waypoints('refresh');

					setTimeout(function() {
						$('#blog-content-append .load-post').removeClass('load-post');
						$('#blog-content-append').height('');
					}, 400);

					$(".unveil img").unveil(-50, function() {
						$(this).load(function() {
							$(this).parents('.unveil').addClass('loaded');
						});
					});

				}});
			});
		}});
	}
};

var homeSlider = {
	init: function() {
		if (mobile) {
			return;
		}

		var sliderInfinite = false;

		$.fn.superslides.fx = $.extend({
			fadeTransition: function(orientation, complete) {
				var that = this,
				$children = that.$container.children(),
				$outgoing = $children.eq(orientation.outgoing_slide),
				$target = $children.eq(orientation.upcoming_slide);

				$target.css({
					left: this.width,
					opacity: 1,
					display: 'block'
				});

				// $('.slides-text li:eq('+orientation.outgoing_slide+') .slide-content-wrapper').removeClass('current-slide');
				// $('.slides-text li:eq('+orientation.upcoming_slide+') .slide-content-wrapper').addClass('current-slide');

				$target.velocity({scale:1},0);

				if (orientation.outgoing_slide >= 0) {
					$outgoing.velocity({
						opacity: 0,
						scale: 1.5,
					},
					that.options.animation_speed,
					function() {
						if (that.size() > 1) {
							$children.eq(orientation.upcoming_slide).css({
								zIndex: 2
							});

							if (orientation.outgoing_slide >= 0) {
								$children.eq(orientation.outgoing_slide).css({
									opacity: 1,
									display: 'none',
									zIndex: 0
								});
							}
						}

						complete();
					});
				} else {
					$target.css({
						zIndex: 2
					});
					complete();
				}
			}
		}, $.fn.superslides.fx);

		$('#slides').superslides({
			animation: 'fadeTransition',
			animation_speed: 2000,
			play: 3000,
			inherit_height_from: '.home',
		});

		$('#arrow-right').click(function(e) {
			e.preventDefault();
			$('#slides').superslides('animate', 'next');
		});

		$('#arrow-left').click(function(e) {
			e.preventDefault();
			$('#slides').superslides('animate', 'prev');
		});
	}
};

var reviews = {
	init: function() {
		var that = this;
		var owl = $("#reviews-carousel");
		owl.owlCarousel({
			items: 1,
			loop:true,
			margin:10,
			nav:true,
			autoplay:true,
			autoplayTimeout:5000,
			autoplayHoverPause:true,
			autoplaySpeed: 1500,
			navText: ['<i class="icon-arrow-left"></i>', '<i class="icon-arrow-right"></i>'],
			dots: false,
			onInitialized: function() {
				var controls = owl.find('.owl-controls');
				controls.prependTo($(".controls-reviews"));
			},
			responsive:{
				0:{
					items:1
				},
				600:{
					items:1
				},
				1000:{
					items:1
				}
			}
		});
	}
};

var rating = {
	init: function() {
		var ratingWidth = $('.rating-select span').width();
		var step = ratingWidth / 5;

		$('.rating-select').mousemove(function(e) {
			var x = e.pageX -  $(this).offset().left;
			x = Math.ceil(x / step) * step;
			$('.rating-select span span').width(x);
			$(this).data('rating', x/step);
		});

		$('.rating-select').mouseleave(function(e) {
			var newWidth = $(this).find('select').val();
			$('.rating-select span span').width(newWidth*step);
		});

		$('.rating-select').click(function(e) {
			e.preventDefault();
			$(this).find('select').val($(this).data('rating'));
		});
	}
};

$("#comments-form").submit(function(e) {
	$('#comments-form .form-control').removeClass('#comments-form message-error');
	$.post("comments-send.php", $('#comments-form').serialize(), function(data) {
		if (data.status === 'ok') {
			$("#comments-form .message-success").removeClass('hidden').velocity({ opacity : 1 });
			$("#comments-form .button-submit").addClass('button-transparent');
			$('#comments-form .form-control').val('');

			setTimeout(function() {
				$("#comments-form .message-success").velocity({ opacity : 0 }, function() {
					$(this).addClass('hidden');
				});
				$("#comments-form .button-submit").removeClass('button-transparent');
			}, 3000);
		} else {
			$.each(data.errors, function(i, e) {
				$('.' + i).addClass('#comments-form message-error');
			});
		}
	}, 'json');
	e.preventDefault();
});

$("#comments-form").on('keyup', '.contact-form', function() {
	var that = this;
	if ($(this).val() !== '') {
		$(this).removeClass('message-error');
	} else {
		$(that).addClass('message-error');
	}
});

$("#reviews-form").submit(function(e) {
	$('#reviews-form .form-control').removeClass('#reviews-form message-error');
	$.post("reviews-send.php", $('#reviews-form').serialize(), function(data) {
		if (data.status === 'ok') {
			$("#reviews-form .message-success").removeClass('hidden').velocity({ opacity : 1 });
			$("#reviews-form .button-submit").addClass('button-transparent');
			$('#reviews-form .form-control').val('');
			setTimeout(function() {
				$("#reviews-form .message-success").velocity({ opacity : 0 }, function() {
					$(this).addClass('hidden');
				});
				$("#reviews-form .button-submit").removeClass('button-transparent');
			}, 3000);
		} else {
			$.each(data.errors, function(i, e) {
				$('.' + i).addClass('#reviews-form message-error');
			});
		}
	}, 'json');
	e.preventDefault();
});

$("#reviews-form").on('keyup', '.contact-form', function() {
	var that = this;
	if ($(this).val() !== '') {
		$(this).removeClass('message-error');
	} else {
		$(that).addClass('message-error');
	}
});

$(document).on("submit", "#contact-form", function(e) {
	e.preventDefault();
	$('#contact-form .message-error').removeClass('message-error');

	$.ajax({
		url: 'contact-send.php',
		type: 'POST',
		dataType: 'json',
		data: $('#contact-form').serialize(),

	}).done(function(responseData) {
		if(responseData.status === 'success') {
			$("#contact-form .message-success").removeClass('hidden').velocity({ opacity : 1 });
			$("#contact-form .button-submit .button-send").addClass('button-transparent');
			$('#contact-form input, #contact-form textarea').val('');
			setTimeout(function() {
				$("#contact-form .message-success").velocity({ opacity : 0 }, function() {
					$(this).addClass('hidden');
				});
				$("#contact-form .button-submit .button-send").removeClass('button-transparent');
			}, 3000);
		} else {
			$.each(responseData.errors, function(i, field) {
				$('#contact-'+field).addClass('message-error');
			});
		}
	}).fail(function() {
		// handle server fail here
	});
});

$(document).on("submit", "#date-reservation-form", function(e) {
	e.preventDefault();
	$('#date-reservation-form .message-error').removeClass('message-error');

	$.ajax({
		url: 'reservation-send.php',
		type: 'POST',
		dataType: 'json',
		data: $('#date-reservation-form').serialize(),
	}).done(function(responseData) {
		if(responseData.status === 'success') {
			$("#date-reservation-form .message-success").removeClass('hidden').velocity({ opacity : 1 });
			$("#date-reservation-form .button-submit .button-send").addClass('button-transparent');
			$('#date-reservation-form input, #date-reservation-form textarea').val('');

			setTimeout(function() {
				$("#date-reservation-form .message-success").velocity({ opacity : 0 }, function() {
					$(this).addClass('hidden');
				});
				$("#date-reservation-form .button-submit .button-send").removeClass('button-transparent');
			}, 3000);
		} else {
			$.each(responseData.errors, function(i, field) {
				$('#reservation-'+field).addClass('message-error');
			});
		}
	}).fail(function() {
		// handle server fail here
	});
});

$(document).on('click', '.refresh-captcha', function(e) {
	e.preventDefault();
	$('#captcha').attr('src', 'inc/securimage/securimage_show.php?' + Math.random());
});

function imgLoaded($img) {
	$img.parents('.unveil').addClass('loaded');
}

enquire.register("screen and (min-width: 1px)", {
	match : function() {

	},
	unmatch : function() {

	},
	setup : function() {
		verticalSlider.init();
		// console.log('setup')
	},
	deferSetup : true,
	shouldDegrade: true,
	// OPTIONAL
	// If supplied, triggered when handler is unregistered. 
	// Place cleanup code here
	destroy : function() {}
}, true);

enquire.register("screen and (max-width: 767px)", {
	match : function() {
		if($('.mobile-basic-info').height() < $(window).height()) {
			$('.mobile-basic-info').height($(window).height());
		}
	},
	unmatch : function() {

	},
	setup : function() {
		
	},
	deferSetup : true,
	shouldDegrade: true,
	// OPTIONAL
	// If supplied, triggered when handler is unregistered. 
	// Place cleanup code here
	destroy : function() {}
}, true);

enquire.register("screen and (max-width: 991px)", {
	// OPTIONAL
	// If supplied, triggered when a media query matches.
	match : function() {
		footer.mobileInit();
		sectionIntro.destroy();
		sectionIntro.mobileInit();
		$('.section-intro-parallax').attr('style', '');
		$.fn.fullpage.setAutoScrolling(false);
	},
	unmatch : function() {

	},
	setup : function() {

	},
	deferSetup : true,
	shouldDegrade: true,
	destroy : function() {}
}, true);

enquire.register("screen and (min-width: 992px)", {
	// OPTIONAL
	// If supplied, triggered when a media query matches.
	match : function() {
		if(!$('body').hasClass('no-smooth-scroll')) {
			$('body').addClass('scrollable');
		} else {
			$('body').removeClass('scrollable');
		}
		footer.init();
		sectionIntro.init();
		backgroundParallax.init();
		// console.log($.fn.fullpage.setAutoScrolling);
		// $.fn.fullpage.setAutoScrolling(true);
		// menu.show();
		// menu.rezize();
	},
	// OPTIONAL
	// If supplied, triggered when the media query transitions 
	// *from a matched state to an unmatched state*.
	unmatch : function() {

	},
	// OPTIONAL
	// If supplied, triggered once, when the handler is registered.
	setup : function() {

	},
	// OPTIONAL, defaults to false
	// If set to true, defers execution of the setup function 
	// until the first time the media query is matched
	deferSetup : true,
	shouldDegrade: true,
	// OPTIONAL
	// If supplied, triggered when handler is unregistered. 
	// Place cleanup code here
	destroy : function() {}
}, true);
