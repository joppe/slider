/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var default_options = {
            justifyElements: true,
            animationEasing: 'swing',
            animationDuration: 400
        };

    function isValidPosition(slidePosition, $slider, $viewport, justifyElements, horizontal) {
        var validPosition = true;

        if (justifyElements && horizontal && slidePosition.left > ($slider.width() - $viewport.width())) {
            validPosition = false;
        } else if (justifyElements && !horizontal && slidePosition.top > ($slider.height() - $viewport.height())) {
            validPosition = false;
        }

        return validPosition;
    }

    $.createSliderAnimation = function (config) {
        var options = $.extend(default_options, config === undefined ? {} : config);

        return function (status) {
            var $newActiveSlide = $(status.getElementByIndex(status.newActiveIndex)),
                slidePosition = $newActiveSlide.position();

            if (isValidPosition(slidePosition, status.$slider, status.$viewport, options.justifyElements, status.options.horizontal)) {
                status.$slider.stop(true, false);

                status.$slider.animate({
                    top: -slidePosition.top,
                    left: -slidePosition.left
                }, {
                    duration: options.animationDuration,
                    easing: options.animationEasing,
                    complete: function () {
                        status.$viewport.trigger('sliderAnimationFinished');
                    }
                });
            } else {
                status.$viewport.trigger('sliderAnimationFinished');
            }
        };
    };
}(jQuery));