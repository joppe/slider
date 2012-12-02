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
        return {
            $slider: slider.$slider,
            $viewport: slider.$viewport,
            options: options,
            original: {
                size: null,
                count: null
            },
            element: {
                activeIndex: null,
                newActiveIndex: null,
                count: null,
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
        this.status = createStatus(this, options);
        this.elements = this.getElements();
        this.status.original.count = this.elements.length;
        this.status.element.count = this.status.original.count;
        this.status.original.size = this.getSize();
        this.status.element.size = this.status.original.size;

        if (this.options.loopMode !== 'none') {
            this.createClones();
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
                var $element = $(this);

                elements.push({
                    $element: $element,
                    size: self.options.horizontal ? $element.outerWidth() : $element.outerHeight(),
                    position: self.options.horizontal ? $element.position().left : $element.position().top
                });
            });

            return elements;
        },

        /**
         * @return {Number}
         */
        getSize: function () {
            var size = 0;

            $.each(this.elements, function (index, element) {
                size += element.size;
            });

            return size;
        },

        createClones: function () {
            var self = this,
                $parent = this.elements[0].$element.parent(),
                viewportSize = this.options.horizontal ? this.$viewport.width() : this.$viewport.height(),
                size = 0;

            $.each(this.elements, function (index, element) {
                var $clone = element.$element.clone().addClass('clone').appendTo($parent);

                size += self.options.horizontal ? $clone.outerWidth() : $clone.outerHeight();

                self.elements.push({
                    $element: $clone,
                    size: self.options.horizontal ? $clone.outerWidth() : $clone.outerHeight(),
                    position: self.options.horizontal ? $clone.position().left : $clone.position().top
                });

                if (size >= viewportSize) {
                    return false;
                }
            });

            this.status.element.count = this.elements.length;
            this.status.element.size += size;

            this.$slider.css(this.options.horizontal ? 'width' : 'height', this.status.element.size);
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