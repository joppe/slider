/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var Slider,
        default_options = {
            horizontal: true,
            loop: false,
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
                var $element = null;

                if (typeof slider.$elements[index] !== 'undefined') {
                    $element = slider.$elements[index];
                }

                return $element;
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
         * Prepare the dimesnions of the container so it wraps all elements
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
                    self.moveTo(self.status.activeIndex + 1);
                },
                sliderMoveTo: function (event, index) {
                    self.moveTo(index);
                },
                sliderPrevious: function () {
                    self.moveTo(self.status.activeIndex - 1);
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
            var self = this,
                elementPosition;

            if (this.status.loop) {
                if (index < 0) {
                    index = this.$elements.length - 1;
                }

                if (index >= this.$elements.length) {
                    index = 0;
                }
            } else if (this.status.options.justifyElements && index >= 0 && index < this.$elements.length) {
                elementPosition = $(this.$elements.get(index)).position();

                if (this.status.options.horizontal && -elementPosition.left < (this.$viewport.width() - this.$slider.width())) {
                    index = -1;
                } else if (!this.status.options.horizontal && -elementPosition.top < (this.$viewport.height() - this.$slider.height())) {
                    index = -1;
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
        var options = $.extend(default_options, typeof config === 'undefined' ? {} : config);

        return this.each(function () {
            var slider = new Slider($(this), options);
        });
    };
}(jQuery));