/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var Controls,
        default_options = {
            next: 'li.next a',
            previous: 'li.previous a',
            number: null
        };

    Controls = (function () {
        var Controls;

        Controls = function ($container, $slider, options) {
            this.$container = $container;
            this.$slider = $slider;

            this.$next = this.$container.find(options.next);
            this.$previous = this.$container.find(options.previous);
            this.$numbers = this.$container.find(options.number);

            this.addEventListeners();
        };
        Controls.prototype = {
            /**
             * @property {jQuery} $container
             */
            $container: null,

            /**
             * @property {jQuery} $slider
             */
            $slider: null,

            /**
             * @property {jQuery} $next
             */
            $next: null,

            /**
             * @property {jQuery} $previous
             */
            $previous: null,

            /**
             * @property {jQuery} $numbers
             */
            $numbers: null,

            addEventListeners: function () {
                var self = this;

                this.$next.on({
                    click: function (event) {
                        event.preventDefault();

                        self.$slider.trigger('sliderForward', 1);
                    }
                });
                this.$previous.on({
                    click: function (event) {
                        event.preventDefault();

                        self.$slider.trigger('sliderReverse', 1);
                    }
                });

                this.$numbers.on({
                    click: function (event) {
                        var index = self.$numbers.index($(this));

                        event.preventDefault();

                        self.$slider.trigger('sliderMoveTo', index);
                    }
                });

                this.$slider.on({
                    sliderAfterChange: function (event, sliderStatus) {
                        self.update(sliderStatus);
                    }
                });
            },

            update: function () {

            }
        };

        return Controls;
    }());

    $.fn.sliderControls = function ($slider, config) {
        var options = $.extend(default_options, config === undefined ? {} : config);

        return this.each(function () {
            var controls = new Controls($(this), $slider, options);
        });
    };
}(jQuery));