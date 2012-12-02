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

    function calculatePosition(position, size) {
        position %= size;

        if (position > 0) {
            position -= size;
        }

        return position;
    }

    $.createSliderAnimation = function (config) {
        var options = $.extend(default_options, config === undefined ? {} : config),
            animation = null,
            propertyStartValue = 0;

        return function (status) {
            var propertyName = status.options.horizontal ? 'left' : 'top',
                propertyEndValue = 0,
                index = status.index.newActive,
                sign = index  > 0 ? -1 : 1;

            if (index > 0) {
                propertyEndValue = Math.floor(index / status.original.count) * status.original.size;

                index %= status.original.count;

                propertyEndValue += status.options.horizontal ? status.element.getByIndex(index).position().left : status.element.getByIndex(index).position().top;
            } else {
                propertyEndValue = Math.floor(-index / status.original.count) * status.original.size;

                index %= status.original.count;
                index += status.original.count;

                propertyEndValue += status.original.size - (status.options.horizontal ? status.element.getByIndex(index).position().left : status.element.getByIndex(index).position().top);
            }

            propertyEndValue *= sign;

            if (animation !== null) {
                animation.stop(true, false);
            }
console.log(propertyStartValue, propertyEndValue);
            animation = $({
                prop: propertyStartValue
            }).animate({
                prop: propertyEndValue
            }, {
                duration: 800,
                easing: options.animationEasing,
                complete: function () {
                    propertyStartValue = propertyEndValue;
                    status.$slider.css(propertyName, calculatePosition(propertyEndValue, status.original.size));
                    status.$viewport.trigger('sliderAnimationFinished');
                },
                step: function (now) {
                    propertyStartValue = now;
                    status.$slider.css(propertyName, calculatePosition(now, status.original.size));
                }
            });
        };
    };
}(jQuery));