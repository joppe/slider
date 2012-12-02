/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var Slider,
        default_options = {
            horizontal: true,
            loopMode: 'none',// none|circular|auto-reverse
            slider: 'ul',
            element: 'li',
            animation: function (status) {
                var position = status.element.getByIndex(status.element.newActiveIndex).position();

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
        var size = slider.getSize(),
            count = slider.elements.length;

        return {
            $slider: slider.$slider,
            $viewport: slider.$viewport,
            options: options,
            original: {
                size: size,
                count: count
            },
            element: {
                activeIndex: null,
                newActiveIndex: null,
                size: size,
                count: count,
                getByIndex: function (index) {
                    return slider.elements[index].$element;
                }
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
        this.options = options;

        this.$slider = this.$viewport.find(this.options.slider);
        this.elements = this.getElements();

        this.status = createStatus(this, options);

        if (this.options.loopMode !== 'none') {
            this.elements = this.elements.concat(this.createClones());
            this.status.element.count = this.elements.length;
            this.status.element.size = this.getSize();
        }

        this.$slider.css(this.options.horizontal ? 'width' : 'height', this.status.element.size);

        this.addEventListeners();
    };
    Slider.prototype = {
        /**
         * @return {Array}
         */
        getElements: function () {
            var self = this,
                elements = [];

            this.$viewport.find(this.options.element).each(function () {
                elements.push(self.createElement($(this)));
            });

            return elements;
        },

        /**
         * @return {number}
         */
        getSize: function () {
            var size = 0;

            $.each(this.elements, function (index, element) {
                size += element.size;
            });

            return size;
        },

        /**
         * @param {jQuery} $element
         * @return {Object}
         */
        createElement: function ($element) {
            return {
                $element: $element,
                size: this.options.horizontal ? $element.outerWidth() : $element.outerHeight(),
                position: this.options.horizontal ? $element.position().left : $element.position().top
            };
        },

        /**
         * @return {Array}
         */
        createClones: function () {
            var self = this,
                clones = [],
                $parent = this.elements[0].$element.parent(),
                viewportSize = this.options.horizontal ? this.$viewport.width() : this.$viewport.height(),
                size = 0;

            $.each(this.elements, function (index, element) {
                var $clone = element.$element.clone().addClass('clone').appendTo($parent),
                    clone = self.createElement($clone);

                clones.push(clone);

                size += clone.size;

                if (size >= viewportSize) {
                    return false;
                }
            });

            return clones;
        },

        /**
         * Add (custom) event listeners to the container
         */
        addEventListeners: function () {
            var self = this;

            this.$viewport.on({
                sliderReset: function (event) {
                    event.stopPropagation();

                    self.moveTo(0);
                },
                sliderForward: function (event, delta) {
                    var moveToIndex = self.status.element.activeIndex + delta;

                    event.stopPropagation();

                    if (self.status.element.newActiveIndex !== null) {
                        moveToIndex = self.status.element.newActiveIndex + delta;
                    }

                    self.moveTo(moveToIndex);
                },
                sliderMoveTo: function (event, index) {
                    event.stopPropagation();

                    self.moveTo(index);
                },
                sliderReverse: function (event, delta) {
                    var moveToIndex = self.status.element.activeIndex - delta;

                    event.stopPropagation();

                    if (self.status.element.newActiveIndex !== null) {
                        moveToIndex = self.status.element.newActiveIndex - delta;
                    }

                    self.moveTo(moveToIndex);
                },
                sliderAnimationFinished: function (event) {
                    event.stopPropagation();

                    self.status.element.activeIndex = self.status.element.newActiveIndex;
                    self.status.element.newActiveIndex = null;
                    self.$slider.trigger('sliderAfterChange', self.status);
                }
            });
        },

        /**
         * @param {number} index
         */
        moveTo: function (index) {
            console.log(index);
            if (this.options.loopMode !== 'none' || (this.options.loopMode === 'none' && index >= 0 && index < this.status.element.count)) {
                this.status.element.newActiveIndex = index;
                this.$viewport.trigger('sliderBeforeChange', this.status);
                this.options.animation(this.status);
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