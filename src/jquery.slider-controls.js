/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var Controls,
        defaultOptions = {
            active: 'active',
            disabled: 'disabled',
            next: '.next',
            previous: '.previous',
            numbers: '.number',
            event: 'afterChange'
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
        this.options = options;

        this.$next = this.$container.find(options.next);
        this.$previous = this.$container.find(options.previous);
        this.$numbers = this.$container.find(options.numbers);

        this.addEventListeners();
    };
    Controls.prototype = {
        addEventListeners: function () {
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

            this.$slider.on('status ' + this.options.event, $.proxy(function (event, status) {
                this.update(status);
            }, this));
        },

        /**
         * @param {Object} status
         */
        update: function (status) {
            if (false === status.loop) {
                if (this.$next.size()) {
                    if (status.newElement.getIndex() >= status.maxIndex) {
                        this.$next.addClass(this.options.disabled);
                    } else {
                        this.$next.removeClass(this.options.disabled);
                    }
                }
                if (this.$previous.size()) {
                    if (0 === status.newElement.getIndex()) {
                        this.$previous.addClass(this.options.disabled);
                    } else {
                        this.$previous.removeClass(this.options.disabled);
                    }
                }
            }
            if (this.$numbers.size()) {
                this.$numbers.filter('.' + this.options.active).removeClass(this.options.active);
                this.$numbers.eq(status.newElement.getIndex()).addClass(this.options.active);
            }
        }
    };

    /**
     * @param {jQuery} $slider
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.sliderControls = function ($slider, options) {
        options = $.extend({}, defaultOptions, options || {});

        this.each(function () {
            new Controls($(this), $slider, options);
        });

        $slider.trigger('refreshstatus');

        return this;
    };
}(jQuery));