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
        var options = $.extend(default_options, config === undefined ? {} : config),
            animation = null,
            propertyStartValue = 0;

        return function (status) {
            var propertyName = status.options.horizontal ? 'left' : 'top',
                propertyEndValue = status.getPositionForIndex(status.index.newActive);

            if (animation !== null) {
                animation.stop(true, false);
            }

            animation = $({
                prop: propertyStartValue
            }).animate({
                prop: propertyEndValue
            }, {
                duration: 800,
                easing: options.animationEasing,
                complete: function () {
                    propertyStartValue = propertyEndValue;

                    status.$slider.css(propertyName, status.normalizePosition(propertyEndValue));
                    status.$viewport.trigger('sliderAnimationFinished');
                },
                step: function (now) {
                    propertyStartValue = now;

                    status.$slider.css(propertyName, status.normalizePosition(now));
                }
            });
        };
    };
}(jQuery));