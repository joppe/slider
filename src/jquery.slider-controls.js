/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var Controls,
        defaultOptions = {
            next: 'li.next a',
            previous: 'li.previous a',
            numbers: null
        };

    /**
     * @param {jQuery} $container
     * @param {jQuery} $slider
     * @param {Object} options
     * @constructor
     */
    Controls = function ($container, $slider, options) {
        this.$container = $container;
        this.$slider = $slider;

        this.$next = this.$container.find(options.next);
        this.$previous = this.$container.find(options.previous);
        this.$numbers = this.$container.find(options.numbers);

        this.addEventListeners();

        this.$slider.trigger('refreshstatus');
    };
    Controls.prototype = {
        addEventListeners: function () {
            console.log('addEventListeners');
            this.$next.on('click', $.proxy(function (event) {
                event.preventDefault();

                this.$slider.trigger('next');
            }, this));

            this.$previous.on('click', $.proxy(function (event) {
                event.preventDefault();

                this.$slider.trigger('previous');
            }, this));

            this.$numbers.on('click', $.proxy(function (event) {
                var index = this.$numbers.index(event.target);

                event.preventDefault();

                this.$slider.trigger('moveTo', index);
            }, this));

            this.$slider.on({
                status: $.proxy(function (event, status) {
                    this.update(status);
                }, this)
            });
        },

        /**
         * @param {Object} status
         */
        update: function (status) {
            /*
            if (status.options.loopMode === 'none') {
                if (this.$next.size() > 0) {
                    if (status.index.active >= status.index.max) {
                        this.$next.addClass('disabled');
                    } else {
                        this.$next.removeClass('disabled');
                    }
                }
                if (this.$previous.size() > 0) {
                    if (status.index.active === 0) {
                        this.$previous.addClass('disabled');
                    } else {
                        this.$previous.removeClass('disabled');
                    }
                }
            }
            if (this.$numbers.size() > 0) {
                this.$numbers.filter('.active.').removeClass('active');
                this.$numbers.eq(status.normalizeIndex(status.index.activeIndex)).removeClass('active');
            }
            */
        }
    };

    /**
     * @param {jQuery} $slider
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.sliderControls = function ($slider, options) {
        options = $.extend({}, defaultOptions, options || {});

        return this.each(function () {
            var controls = new Controls($(this), $slider, options);
        });
    };
}(jQuery));