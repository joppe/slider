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
                width = properties.width,
                $container = properties.$container,
                targetPos = -properties.newElement.$element.position().left,
                deltaIndex = properties.newElement.index - properties.oldElement.index,
                direction = properties.direction,
                left = $container.position().left;

            if (deltaIndex < 0 && direction > 0) {
                targetPos += -width;
            } else if (deltaIndex > 0 && direction < 0) {
                left -= width;
            }

            $animation = $({
                prop: left
            }).animate({
                prop: targetPos
            }, {
                duration: 800,
                complete: function () {
                    ready();
                },
                step: function (now) {
                    $container.css('left', now % width);
                }
            });
        };
    };
}(jQuery));