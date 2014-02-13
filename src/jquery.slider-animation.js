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
                positionProperty = properties.positionProperty,
                size = properties.size,
                $container = properties.$container,
                targetPos = -properties.newElement.position()[positionProperty],
                deltaIndex = properties.newElement.index - properties.oldElement.index,
                direction = properties.direction,
                position = $container.position()[positionProperty];

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
                    $container.css(positionProperty, now % size);
                }
            });
        };
    };
}(jQuery));