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

            this.$slider.trigger('sliderRefreshStatus');
        };
        Controls.prototype = {
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
                    sliderStatus: function (event, sliderStatus) {
                        self.update(sliderStatus);
                    },
                    sliderAfterChange: function (event, sliderStatus) {
                        self.update(sliderStatus);
                    }
                });
            },

            update: function (sliderStatus) {
                if (sliderStatus.options.loopMode === 'none') {
                    if (this.$next.size() > 0) {
                        if (sliderStatus.index.active >= sliderStatus.index.max) {
                            this.$next.addClass('disabled');
                        } else {
                            this.$next.removeClass('disabled');
                        }
                    }
                    if (this.$previous.size() > 0) {
                        if (sliderStatus.index.active === 0) {
                            this.$previous.addClass('disabled');
                        } else {
                            this.$previous.removeClass('disabled');
                        }
                    }
                }
                if (this.$numbers.size() > 0) {
                    this.$numbers.filter('.active.').removeClass('active');
                    this.$numbers.eq(sliderStatus.normalizeIndex(sliderStatus.index.activeIndex)).removeClass('active');
                }
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