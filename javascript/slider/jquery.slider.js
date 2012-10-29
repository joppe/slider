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
            justifyElements: true,
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
     * @param {Number} maxIndex
     * @param {Object} options
     * @return {Object}
     */
    function createStatus(slider, maxIndex, options) {
        return {
            $slider: slider.$slider,
            $viewport: slider.$viewport,
            elementCount: slider.$elements.length,
            newActiveIndex: null,
            activeIndex: null,
            maxIndex: maxIndex,
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

        this.prepareContainer(options);

        this.status = createStatus(this, this.getMaxIndex(options), options);

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

        getMaxIndex: function (options) {
            var maxIndex = this.$elements.length - 1,
                left,
                maxLeft,
                top,
                maxTop;

            if (options.justifyElements && options.horizontal) {
                left = this.$slider.width();
                maxLeft = left - this.$viewport.width();

                while (left > 0 && maxIndex >= 0 && left > maxLeft) {
                    left -= $(this.$elements.get(maxIndex)).width();

                    if (left > maxLeft) {
                        maxIndex -= 1;
                    }
                }
            } else if (options.justifyElements && !options.horizontal) {
                top = this.$slider.height();
                maxTop = top - this.$viewport.height();

                while (top > 0 && maxIndex >= 0 && top > maxTop) {
                    top -= $(this.$elements.get(maxIndex)).height();

                    if (top > maxTop) {
                        maxIndex -= 1;
                    }
                }
            }

            return maxIndex;
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
            } else if (this.status.options.justifyElements && index > this.status.maxIndex) {
                index = -1;
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