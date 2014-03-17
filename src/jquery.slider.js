/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var defaultOptions = {
            slider: 'ul',
            elements: 'li',
            gapless: true,
            loop: false,
            adjustSize: true,
            horizontal: true,
            animation: function (properties, ready) {
                var posProp = properties.posProp;

                properties.$slider.css(posProp, -properties.newElement.getPosition());

                ready();
            }
        },
        Slider;

    /**
     * @param {*} val
     * @param {*} def
     * @returns {*}
     */
    function defaults(val, def) {
        if (val === undefined) {
            val = def;
        }

        return val;
    }

    Slider = function ($viewport, options) {
        this.gapless = options.gapless;
        this.loop = options.loop;
        this.adjustSize = options.adjustSize;
        this.horizontal = options.horizontal;
        this.animation = options.animation;

        this.sizeProp = options.horizontal ? 'width' : 'height';
        this.posProp = options.horizontal ? 'left' : 'top';

        this.$viewport = $viewport;
        this.$viewport.addClass('init');

        this.$slider = $viewport.find(options.slider);

        this.elements = this.createElements($viewport.find(options.elements));
        this.size = this.getSize();

        if (this.adjustSize) {
            this.$slider.css(this.sizeProp, this.size);
        }

        if (this.elements.length > 1) {
            this.activeIndex = 0;
            this.maxIndex = this.getMaxIndex();

            this.createClones();
            this.addEventHandlers();
        }

        this.$viewport.removeClass('init');
    };
    Slider.prototype = {
        /**
         * @param {jQuery} $els
         * @returns {Array}
         */
        createElements: function ($els) {
            var els = [],
                sizeProp = this.sizeProp,
                posProp = this.posProp;

            $els.each(function (i) {
                var $el = $(this);

                els.push({
                    getElement: function () {
                        return $el;
                    },
                    getSize: function () {
                        return $el[sizeProp]();
                    },
                    getIndex: function () {
                        return i;
                    },
                    getPosition: function () {
                        var pos = $el.position();

                        return pos[posProp];
                    }
                });
            });

            return els;
        },

        /**
         * @returns {number}
         */
        getMaxIndex: function () {
            var size = 0,
                viewportSize,
                maxIndex = this.elements.length - 1,
                i;

            if (true === this.gapless && false === this.loop) {
                viewportSize = this.$viewport[this.sizeProp]();

                for (i = maxIndex; i >= 0; i -= 1) {
                    size += this.elements[i].getSize();

                    if (size >= viewportSize) {
                        maxIndex = i;
                        break;
                    }
                }
            }

            return maxIndex;
        },

        /**
         * @returns {number}
         */
        getSize: function () {
            var size = 0;

            $.each(this.elements, function (i, el) {
                size += el.getSize();
            });

            return size;
        },

        createClones: function () {
            var size = 0,
                viewportSize,
                i,
                el;

            // create if necessary clones
            if (true === this.loop) {
                viewportSize = this.$viewport[this.sizeProp]();

                if (viewportSize < this.size) {

                    for (i = 0; i < this.elements.length; i += 1) {
                        el = this.elements[i];

                        size += el.getSize();
                        el.getElement().clone().addClass('__clone__').appendTo(this.$slider);

                        if (size >= viewportSize) {
                            break;
                        }
                    }

                    this.$slider.css(this.sizeProp, this.size + size);
                }
            }
        },

        addEventHandlers: function () {
            this.$viewport.on({
                reset: $.proxy(function () {
                    this.moveTo(0);
                }, this),

                moveTo: $.proxy(function (event, index) {
                    this.moveTo(defaults(index, 0));
                }, this),

                next: $.proxy(function (event, delta) {
                    var index = this.activeIndex + defaults(delta, 1);

                    if (index > this.maxIndex && true === this.loop) {
                        index = (index - 1) % this.maxIndex;
                    }

                    this.moveTo(index, 1);
                }, this),

                previous: $.proxy(function (event, delta) {
                    var index = this.activeIndex + defaults(delta, -1);

                    if (index < 0 && true === this.loop) {
                        index = this.maxIndex + 1 + index;
                    }

                    this.moveTo(index, -1);
                }, this),

                refreshstatus: $.proxy(function () {
                    this.$viewport.trigger('status', this.createStatus());
                }, this)
            });
        },

        /**
         * @param {number} [newIndex]
         * @param {number} [direction]
         * @returns {{$slider: *, sizeProp: *, posProp: *, oldElement: *, newElement: *, direction: number, loop: *, maxIndex: *, size: *}}
         */
        createStatus: function (newIndex, direction) {
            newIndex = newIndex === undefined ? this.activeIndex : newIndex;
            direction = direction === undefined ? 0 : direction;

            return {
                $slider: this.$slider,
                sizeProp: this.sizeProp,
                posProp: this.posProp,
                oldElement: this.elements[this.activeIndex],
                newElement: this.elements[newIndex],
                direction: direction,
                loop: this.loop,
                maxIndex: this.maxIndex,
                size: this.size
            };
        },

        /**
         * @param {number} index
         * @param {number} [direction] -1 or 1
         */
        moveTo: function (index, direction) {
            if (index >= 0 && index <= this.maxIndex) {
                direction = direction || (this.activeIndex - index > 0 ? -1 : 1);

                this.$viewport.trigger('beforechange', this.createStatus());

                this.animation(this.createStatus(index, direction), $.proxy(function () {
                    var status;

                    this.activeIndex = index;

                    status = this.createStatus();

                    this.$viewport.trigger('status', status);
                    this.$viewport.trigger('afterchange', status);
                }, this));
            }
        }
    };

    /**
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.slider = function (options) {
        options = $.extend({}, defaultOptions, options || {});

        return this.each(function () {
            var slider = new Slider($(this), options);
            window.slider = slider;
        });
    };
}(jQuery));