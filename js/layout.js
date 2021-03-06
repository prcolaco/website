var Layout = function () {

    // detect mobile device
    var isMobileDevice = function() {
        return  ((
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
            navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i)
        ) ? true : false);
    }

    // Open In App script for apps than need a smart url like Facebook
    var openInApp = function (smarturl) {
      if (smarturl && isMobileDevice()) {
        window.location.href = smarturl;
        return false;   // preventDefault
      }
    }
    window.openInApp = openInApp;   // register for global use

    // handle header for other pages
    var handleHeaderOtherPages = function () {
        $('.js_nav-item a').each(function () {
            // ignore single page scroll links
            if ($(this).attr('href').includes('#')) return;

            if (window.location.href === $(this)[0].href) {
                $(this).parent().addClass('active');
            } else {
                $(this).parent().removeClass('active');
            }
        });
    } 

    // handle on page scroll
    var handleHeaderOnScroll = function() {
        if(window.location.pathname === '/index.html' || window.location.pathname === '/' ||
            window.location.pathname === '/pt/index.html' || window.location.pathname === '/pt/'){
            if ($(window).scrollTop() > 60) {
                $("body").addClass("page-on-scroll");
            } else {
                $("body").removeClass("page-on-scroll");
            }
        } else {
            $("body").addClass("page-on-scroll");
        }
    }

    // Handle Header
    var handleOnePageHeader = function() {
        // jQuery to collapse the navbar on scroll
        if ($('.navbar').offset().top > 150) {
            $('.navbar-fixed-top').addClass('top-nav-collapse');
        }
        $(window).scroll(function() {
            if ($('.navbar').offset().top > 150) {
                $('.navbar-fixed-top').addClass('top-nav-collapse');
            } else {
                $('.navbar-fixed-top').removeClass('top-nav-collapse');
            }
        });

        var $offset = 0;
        $offset = $(".navbar-fixed-top").height()-20;

        // jQuery for page scrolling feature - requires jQuery Easing plugin
        $('.js_nav-item a').bind('click', function(event) {
            // ignore standalone pages
            if (!$(this).attr('href').includes('#')) return;
            // ignore when navigation is required
            if (window.location.href.split('#')[0] !== $(this)[0].href.split('#')[0]) return;

            var $position = $('#'+$(this).attr('href').split('#')[1]).offset().top;
            $('html, body').stop().animate({
                scrollTop: $position - $offset
            }, 600);
            event.preventDefault();
        });

        var $scrollspy = $('body').scrollspy({target: '.navbar-fixed-top', offset: $offset+2});

        // Collapse Navbar When It's Clickicked
        $(window).scroll(function() {
            $('.navbar-collapse.in').collapse('hide');
        });
    }

    // handle carousel
    var handleCarousel = function() {
        var $item = $('.carousel .item');
        var $wHeight = $(window).height();
        $item.eq(0).addClass('active');
        $item.height($wHeight);
        $item.addClass('full-screen');

        $('.carousel img').each(function() {
            var $src = $(this).attr('src');
            var $color = $(this).attr('data-color');
            $(this).parent().css({
                'background-image' : 'url(' + $src + ')',
                'background-color' : $color
            });
            $(this).remove();
        });

        $(window).on('resize', function (){
            $wHeight = $(window).height();
            $item.height($wHeight);
        });
    }

    // handle group element heights experience
    var handleHeight = function() {
       $('[data-auto-height]').each(function() {
            var parent = $(this);
            var items = $('[data-height]', parent);
            var height = 0;
            var mode = parent.attr('data-mode');
            var offset = parseInt(parent.attr('data-offset') ? parent.attr('data-offset') : 0);

            items.each(function() {
                if ($(this).attr('data-height') == "height") {
                    $(this).css('height', '');
                } else {
                    $(this).css('min-height', '');
                }

                var height_ = (mode == 'base-height' ? $(this).outerHeight() : $(this).outerHeight(true));
                if (height_ > height) {
                    height = height_;
                }
            });

            height = height + offset;

            items.each(function() {
                if ($(this).attr('data-height') == "height") {
                    $(this).css('height', height);
                } else {
                    $(this).css('min-height', height);
                }
            });

            if(parent.attr('data-related')) {
                $(parent.attr('data-related')).css('height', parent.height());
            }
       });
    }

    // Handle Work Popup
    var handleWorkPopup = function() {
        var overlay = $('.work-popup-overlay'),
            close = $('.work-popup-close'),
            trigger = $('.work-popup-trigger');

        trigger.on('click', function() {
            $(this).find('.work-popup-overlay').removeClass('work-popup-overlay-show');
            $(this).find('.work-popup-overlay').addClass('work-popup-overlay-show');
        });

        close.on('click', function(e) {
            e.stopPropagation();
            overlay.removeClass('work-popup-overlay-show');
        });

        overlay.on('click', function (e) {
            e.stopPropagation();
            overlay.removeClass('work-popup-overlay-show');
        });
    }

    return {
        init: function () {
            // initial setup for fixed header
            handleHeaderOtherPages();
            handleHeaderOnScroll();
            handleOnePageHeader(); // initial header
            handleCarousel(); // initial setup for carousel
            handleHeight(); // initial setup for group element height
            handleWorkPopup(); // initial setup for group work popup

            // handle minimized header on page scroll
            $(window).scroll(function() {
                handleHeaderOnScroll();
            });
        },

        // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },
    };
}();

$(document).ready(function() {
    Layout.init();
});