/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var defaultOptions = {
        animationEasing: 'swing',
        animationDuration: 400
    };

    $.createSliderAnimation = function (options) {
        options = $.extend({}, defaultOptions, options || {});

        return function (properties, ready) {
            var $animation,
                posProp = properties.posProp,
                size = properties.size,
                $slider = properties.$slider,
                targetPos = -properties.newElement.getPosition(),
                deltaIndex = properties.newElement.getIndex() - properties.oldElement.getIndex(),
                direction = properties.direction,
                position = $slider.position()[posProp];

            if (deltaIndex < 0 && direction > 0) {
                targetPos += -size;
            } else if (deltaIndex > 0 && direction < 0) {
                position -= size;
            }

            $animation = $({
                prop: position
            }).animate({
                prop: targetPos
            }, {
                duration: 800,
                complete: function () {
                    ready();
                },
                step: function (now) {
                    $slider.css(posProp, now % size);
                }
            });
        };
    };
}(jQuery));