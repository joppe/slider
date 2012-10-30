/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var Slider,
        default_options = {
            horizontal: true,
            loopMode: 'none', // none|circular|auto-reverse
            slider: 'ul',
            element: 'li',
            animation: function (status) {
                var $newActiveSlide = $(status.getElementByIndex(status.newActiveIndex)),
                    position = $newActiveSlide.position();

                status.$slider.css({
                    top: -position.top,
                    left: -position.left
                });

                status.$viewport.trigger('sliderAnimationFinished');
            }
        };

    /**
     * Create a slider status object
     *
     * @param {Slider} slider
     * @param {Object} options
     * @return {Object}
     */
    function createStatus(slider, options) {
        return {
            $slider: slider.$slider,
            $viewport: slider.$viewport,
            elementCount: slider.$elements.length,
            newActiveIndex: null,
            activeIndex: null,
            options: options,
            getElementByIndex: function (index) {
                var element = null;

                if (slider.$elements[index] !== undefined) {
                    element = slider.$elements[index];
                }

                return element;
            }
        };
    }

    /**
     * Constructor
     *
     * @constructor
     * @param {jQuery} $viewport
     * @param {Object} options
     */
    Slider = function ($viewport, options) {
        this.$viewport = $viewport;
        this.animation = options.animation;

        this.$slider = this.$viewport.find(options.slider);
        this.$elements = this.$viewport.find(options.element);
        this.status = createStatus(this, options);

        this.prepareContainer(options);
        this.addEventListeners();
    };
    Slider.prototype = {
        /**
         * Prepare the dimensions of the container so it wraps all elements
         *
         * @param {Object} options
         */
        prepareContainer: function (options) {
            var width = 0;

            if (options.horizontal) {
                this.$elements.each(function () {
                    width += $(this).width();
                });

                this.$slider.css({
                    width: width
                });
            }
        },

        /**
         * Add (custom) event listeners to the container
         */
        addEventListeners: function () {
            var self = this;

            this.$viewport.on({
                sliderReset: function () {
                    self.moveTo(0);
                },
                sliderNext: function () {
                    var moveToIndex = self.status.activeIndex + 1;

                    if (self.status.newActiveIndex !== null) {
                        moveToIndex = self.status.newActiveIndex + 1;
                    }

                    self.moveTo(moveToIndex);
                },
                sliderMoveTo: function (event, index) {
                    self.moveTo(index);
                },
                sliderPrevious: function () {
                    var moveToIndex = self.status.activeIndex - 1;

                    if (self.status.newActiveIndex !== null) {
                        moveToIndex = self.status.newActiveIndex - 1;
                    }

                    self.moveTo(moveToIndex);
                },
                sliderAnimationFinished: function () {
                    self.status.activeIndex = self.status.newActiveIndex;
                    self.status.newActiveIndex = null;
                    self.$slider.trigger('sliderAfterChange', self.status);
                }
            });
        },

        /**
         * Move the slider to the specified index of an element
         *
         * @param {Number} index
         */
        moveTo: function (index) {
            var self = this;

            if (this.status.options.loopMode !== 'none') {
                if (index < 0) {
                    index = this.$elements.length - 1;
                }

                if (index >= this.$elements.length) {
                    index = 0;
                }
            }

            if (index >= 0 && index < this.$elements.length) {
                this.status.newActiveIndex = index;
                this.$viewport.trigger('sliderBeforeChange', self.status);
                this.animation(this.status);
            }
        }
    };

    $.fn.slider = function (config) {
        var options = $.extend(default_options, config === undefined ? {} : config);

        return this.each(function () {
            var slider = new Slider($(this), options);
        });
    };
}(jQuery));