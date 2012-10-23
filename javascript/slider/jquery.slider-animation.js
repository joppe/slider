/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var default_options = {
            animationEasing: 'swing',
            animationDuration: 400
        };

    $.createSliderAnimation = function (config) {
        var options = $.extend(default_options, typeof config === 'undefined' ? {} : config);

        return function (status) {
            var $newActiveSlide = $(status.getElementByIndex(status.newActiveIndex)),
                position = $newActiveSlide.position(),
                top = -position.top,
                left = -position.left;

            // status.$slider.is(':animated')
            status.$slider.stop(true, false);

            status.$slider.animate({
                top: top,
                left: left
            }, {
                duration: options.animationDuration,
                easing: options.animationEasing,
                complete: function () {
                    status.$viewport.trigger('sliderAnimationFinished');
                }
            });
        };
    };
}(jQuery));