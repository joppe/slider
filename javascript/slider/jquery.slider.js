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
                var position = status.element.getByIndex(status.newActiveIndex).position();

                status.$slider.css({
                    top: -position.top,
                    left: -position.left
                });

                status.$viewport.trigger('sliderAnimationFinished');
            }
        };

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
        this.status = this.createStatus(this);
        this.elements = this.getElements();

        if (this.options.loopMode !== 'none') {
            this.createClones();
        }

        this.addEventListeners();
    };
    Slider.prototype = {
        /**
         * @property {jQuery} $viewport
         */
        $viewport: null,

        /**
         * @property {Object} $viewport
         */
        options: null,

        /**
         * @property {jQuery} $viewport
         */
        $slider: null,

        createStatus: function (slider) {
            return {
                $slider: slider.$slider,
                $viewport: slider.$viewport,
                original: {
                    size: 0,
                    count: 0
                },
                element: {
                    size: 0,
                    count: 0,
                    getByIndex: function (index) {
                        return slider.elements[index];
                    }
                },
                activeIndex: null,
                newActiveIndex: null
            };
        },

        getElements: function () {
            var self = this,
                elements = [];

            this.$viewport.find(this.options.element).each(function () {
                var $element = $(this);

                self.status.original.size += self.options.horizontal ? $element.outerWidth() : $element.outerHeight();

                elements.push($element);
            });

            this.status.original.count = elements.length;

            this.status.element.count = this.status.original.count;
            this.status.element.size = this.status.original.size;

            this.$slider.css(this.options.horizontal ? 'width' : 'height', this.size);

            return elements;
        },

        createClones: function () {
            var self = this,
                $parent = this.elements[0].parent(),
                viewportSize = this.options.horizontal ? this.$viewport.width() : this.$viewport.height(),
                size = 0;

            $.each(this.elements, function (index, $element) {
                var $clone = $element.clone().addClass('clone').appendTo($parent);

                size += self.options.horizontal ? $clone.outerWidth() : $clone.outerHeight();

                self.elements.push($clone);

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
                sliderNext: function (event, delta) {
                    event.stopPropagation();

                    var moveToIndex = self.status.activeIndex + delta;

                    if (self.status.newActiveIndex !== null) {
                        moveToIndex = self.status.newActiveIndex + delta;
                    }

                    self.moveTo(moveToIndex);
                },
                sliderMoveTo: function (event, index) {
                    event.stopPropagation();

                    self.moveTo(index);
                },
                sliderPrevious: function (event, delta) {
                    event.stopPropagation();

                    var moveToIndex = self.status.activeIndex - delta;

                    if (self.status.newActiveIndex !== null) {
                        moveToIndex = self.status.newActiveIndex - delta;
                    }

                    self.moveTo(moveToIndex);
                },
                sliderAnimationFinished: function (event) {
                    event.stopPropagation();

                    self.status.activeIndex = self.status.newActiveIndex;
                    self.status.newActiveIndex = null;
                    self.$slider.trigger('sliderAfterChange', self.status);
                }
            });
        },

        moveTo: function (index) {
            console.log(index);
            if (this.options.loopMode === 'none' && index >= 0 && index < this.status.element.count) {
                this.status.newActiveIndex = index;
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