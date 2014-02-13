/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    /**
     * @param {Array} list
     * @param {Function} iterator
     * @param {Object} [context]
     */
    function each(list, iterator, context) {
        var i,
            len = list.length;

        for (i = 0; i < len; i += 1) {
            iterator.call(context, list[i], i, list);
        }
    }

    /**
     * @param {Array} list
     * @param {Function} iterator
     * @param {*} memo
     * @param {Object} [context]
     * @returns {*}
     */
    function reduce(list, iterator, memo, context) {
        each(list, function (value, index, list) {
            memo = iterator.call(context, memo, value, index, list);
        });

        return memo;
    }

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

    var defaultOptions = {
            container: 'ul',
            element: 'li',
            gapless: false,
            loop: false,
            adjustSize: true,
            horizontal: true,
            responsive: false,
            animation: function (properties, ready) {
                properties.$container.css('left', -properties.newElement.$element.position().left);
                ready();
            }
        },
        Slider;

    /**
     * @param {jQuery} $viewport
     * @param {Object} options
     * @constructor
     */
    Slider = function ($viewport, options) {
        this.options = options;

        this.sizeProperty = options.horizontal ? 'width' : 'height';
        this.positionProperty = options.horizontal ? 'left' : 'top';

        this.$container = $viewport.find(options.container);
        this.animation = options.animation;

        this.viewport = this.createViewport($viewport);
        this.viewport.$element.addClass('init');

        // create the elements
        this.elements = this.createElements(this.$container.find(options.element));

        this.size = reduce(this.elements, function (size, element) {
            return size + element.size;
        }, 0);

        if (this.options.adjustSize) {
            this.$container.css(this.sizeProperty, this.size);
        }

        if (this.elements.length > 1) {
            this.maxIndex = this.getMaxIndex(options.gapless, options.loop);

            this.createClones(options.loop);
            this.addEventHandlers(options.loop);
        }

        this.viewport.$element.removeClass('init');
    };
    Slider.prototype = {
        maxIndex: 0,

        activeIndex: 0,

        /**
         * @param $viewport
         * @returns {{$element: *, width: *}}
         */
        createViewport: function ($viewport) {
            return {
                $element: $viewport,
                size: $viewport[this.sizeProperty]()
            };
        },

        /**
         * @param {jQuery} $elements
         * @returns {Array}
         */
        createElements: function ($elements) {
            var elements = [],
                sizeProperty = this.sizeProperty;

            $elements.each(function (index, el) {
                var $element = $(el);

                elements.push({
                    $element: $element,
                    size: $element[sizeProperty](),
                    index: index,
                    position: (function () {
                        var pos = null;

                        return function () {
                            if (null === pos) {
                                pos = $element.position();
                            }

                            return pos;
                        };
                    }())
                });
            });

            return elements;
        },

        /**
         * @param {Boolean} gapless
         * @param {Boolean} loop
         * @returns {number}
         */
        getMaxIndex: function (gapless, loop) {
            var size,
                maxIndex,
                i;

            if (true === gapless && false === loop) {
                size = 0;

                for (i = this.elements.length - 1; i >= 0; i -= 1) {
                    size += this.elements[i].size;

                    if (size >= this.viewport.size) {
                        maxIndex = i;
                        break;
                    }
                }
            } else {
                maxIndex = this.elements.length - 1;
            }

            return maxIndex;
        },

        /**
         * @param {Boolean} loop
         */
        createClones: function (loop) {
            var size,
                i,
                element;

            // create if necessary clones
            if (true === loop && this.viewport.size < this.size) {
                size = 0;

                for (i = 0; i < this.elements.length; i += 1) {
                    element = this.elements[i];

                    size += element.size;
                    element.$element.clone().addClass('__clone__').appendTo(this.$container);

                    if (size >= this.viewport.size) {
                        break;
                    }
                }

                this.$container.css(this.sizeProperty, this.size + size);
            }
        },

        /**
         * @param {Boolean} loop
         */
        addEventHandlers: function (loop) {
            this.viewport.$element.on({
                reset: $.proxy(function () {
                    this.moveTo(0);
                }, this),

                moveTo: $.proxy(function (event, index) {
                    this.moveTo(defaults(index, 0));
                }, this),

                next: $.proxy(function (event, delta) {
                    var index = this.activeIndex + defaults(delta, 1);

                    if (index > this.maxIndex && true === loop) {
                        index = (index - 1) % this.maxIndex;
                    }

                    this.moveTo(index, 1);
                }, this),

                previous: $.proxy(function (event, delta) {
                    var index = this.activeIndex + defaults(delta, -1);

                    if (index < 0 && true === loop) {
                        index = this.maxIndex + 1 + index;
                    }

                    this.moveTo(index, -1);
                }, this),

                refreshstatus: $.proxy(function () {
                    this.viewport.$element.trigger('status', this.createStatus());
                }, this)
            });
        },

        /**
         * @param [newIndex]
         * @param [direction]
         * @returns {{$container: *, size: *, sizeProperty: *, positionProperty: *, oldElement: *, newElement: *, direction: number}}
         */
        createStatus: function (newIndex, direction) {
            newIndex = newIndex === undefined ? this.activeIndex : newIndex;
            direction = direction === undefined ? 0 : direction;

            return {
                $container: this.$container,
                size: this.size,
                sizeProperty: this.sizeProperty,
                positionProperty: this.positionProperty,
                oldElement: this.elements[this.activeIndex],
                newElement: this.elements[newIndex],
                direction: direction
            };
        },

        /**
         * @param {number} index
         * @param {number} [direction] -1 or 1
         */
        moveTo: function (index, direction) {
            if (index >= 0 && index <= this.maxIndex) {
                direction = direction || (this.activeIndex - index > 0 ? -1 : 1);

                this.animation(this.createStatus(index, direction), $.proxy(function () {
                    this.activeIndex = index;
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