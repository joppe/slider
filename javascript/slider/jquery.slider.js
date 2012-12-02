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
                var position = status.normalizePosition(status.getPositionForIndex(status.index.newActive));

                status.$slider.css(status.options.horizontal ? 'left' : 'top', position);
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
            count = slider.elements.length,
            status = {
                $slider: slider.$slider,
                $viewport: slider.$viewport,
                options: options,
                original: {
                    size: size,
                    count: count
                },
                element: {
                    size: size,
                    count: count,
                    getByIndex: function (index) {
                        return slider.elements[index];
                    }
                },
                index: {
                    active: null,
                    newActive: null,
                    max: null
                },
                getPositionForIndex: function (index) {
                    var element = status.element.getByIndex(status.normalizeIndex(index)),
                        position = Math.floor(Math.abs(index) / count) * size;

                    if (index > 0 || options.loopMode !== 'circular') {
                        position += element.position();
                        position *= -1;
                    } else {
                        position += size - element.position();
                    }

                    return position;
                },
                normalizeIndex: function (index) {
                    var nIndex = index % count;

                    if (index <= 0 && options.loopMode === 'circular') {
                        nIndex += count;
                    }

                    return nIndex;
                },
                normalizePosition: function (position) {
                    position %= size;

                    if (position > 0) {
                        position -= size;
                    }

                    return position;
                }
            };

        return status;
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

        if (this.options.loopMode === 'circular') {
            this.elements = this.elements.concat(this.createClones());
            this.status.element.count = this.elements.length;
            this.status.element.size = this.getSize();
        } else {
            this.status.index.max = this.getMaxIndex();
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
            var self = this;

            return {
                $element: $element,
                size: self.options.horizontal ? $element.outerWidth() : $element.outerHeight(),
                position: (function () {
                    var pos = null;

                    return function () {
                        if (pos === null) {
                            pos = self.options.horizontal ? $element.position().left : $element.position().top
                        }

                        return pos;
                    };
                }())
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

        getMaxIndex: function () {
            var viewportSize = this.options.horizontal ? this.$viewport.width() : this.$viewport.height(),
                index,
                maxIndex = this.status.element.count - 1,
                size = 0;

            for (index = this.status.element.count - 1; index >= 0 && size < viewportSize; index -= 1) {
                maxIndex = index;
                size += this.elements[index].size;
            }

            return maxIndex;
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
                    var moveToIndex = self.status.index.active + delta;

                    event.stopPropagation();

                    if (self.status.index.newActive !== null) {
                        moveToIndex = self.status.index.newActive + delta;
                    }

                    self.moveTo(moveToIndex);
                },
                sliderMoveTo: function (event, index) {
                    event.stopPropagation();

                    self.moveTo(index);
                },
                sliderReverse: function (event, delta) {
                    var moveToIndex = self.status.index.active - delta;

                    event.stopPropagation();

                    if (self.status.index.newActive !== null) {
                        moveToIndex = self.status.index.newActive - delta;
                    }

                    self.moveTo(moveToIndex);
                },
                sliderAnimationFinished: function (event) {
                    event.stopPropagation();

                    self.status.index.active = self.status.index.newActive;
                    self.status.index.newActive = null;
                    self.$slider.trigger('sliderAfterChange', self.status);
                }
            });
        },

        /**
         * @param {number} index
         */
        moveTo: function (index) {
            if (this.options.loopMode !== 'none' || (this.options.loopMode === 'none' && index >= 0 && index <= this.status.index.max)) {
                if (this.options.loopMode === 'auto-reverse') {
                    if (index < 0) {
                        index = this.status.index.max;
                    } else if (index > this.status.index.max) {
                        index = 0;
                    }
                }

                this.status.index.newActive = index;
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