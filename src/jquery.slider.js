/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    function each(list, iterator, context) {
        var i,
            len = list.length;

        for (i = 0; i < len; i += 1) {
            iterator.call(context, list[i], i, list);
        }
    }

    function every(list, iterator, context) {
        var i,
            len = list.length;

        for (i = 0; i < len; i += 1) {
            if (iterator.call(context, list[i], i, list) === false) {
                break;
            }
        }
    }

    function reduce(list, iterator, memo, context) {
        each(list, function (value, index, list) {
            memo = iterator.call(context, memo, value, index, list);
        });

        return memo;
    }

    function defaults(val, def) {
        if (val === undefined) {
            val = def;
        }

        return val;
    }

    function bind(callback, context) {
        return function () {
            callback.apply(context, arguments);
        };
    }

    var $window = $(window),
        defaultOptions = {
            slider: 'ul',
            element: 'li',
            gapless: false,
            loop: false,
            animation: function ($container, viewport, elements, index, direction, ready) {
                var element = elements[index];

                $container.css('left', -element.$element.position().left);
                ready();
            }
        },
        Slider;

    /**
     * - calculate the size of the viewport
     * - create the elements
     * - get the total width of the elements
     * - get the max index
     * - create if necessary clones
     * - add event listeners
     */
    Slider = function ($viewport, options) {
        this.$container = $viewport.find(options.slider);

        this.animation = options.animation;

        // calclulate the size of the viewport
        this.viewport = this.createViewport($viewport);
        this.viewport.$element.addClass('init');

        // create the elements
        this.elements = this.createElements(this.$container.find(options.element));

        this.width = reduce(this.elements, function (memo, element) {
            return memo + element.width;
        }, 0);

        if (this.elements.length) {
            this.maxIndex = this.getMaxIndex(options.gapless, options.loop);

            this.createClones(options.loop);
            this.addEventHandlers(options.loop);
        }

        this.$container.css({
            width: this.width
        });
        this.viewport.$element.removeClass('init');
    };
    Slider.prototype = {
        maxIndex: 0,

        activeIndex: 0,

        createViewport: function ($viewport) {
            return {
                $element: $viewport,
                width: $viewport.width()
            };
        },

        createElements: function ($elements) {
            var elements = [];

            $elements.each(function (index, el) {
                var $element = $(el);

                elements.push({
                    $element: $element,
                    width: $element.width(),
                    position: $element.position()
                });
            });

            return elements;
        },

        getMaxIndex: function (gapless, loop) {
            var width,
                maxIndex,
                i;

            if (true === gapless && false === loop) {
                width = 0;

                for (i = this.elements.length - 1; i >= 0; i -= 1) {
                    width += this.elements[i].width;

                    if (width >= this.viewport.width) {
                        maxIndex = i;
                        break;
                    }
                }
            } else {
                maxIndex = this.elements.length - 1;
            }

            return maxIndex;
        },

        createClones: function (loop) {
            var width,
                i,
                element;

            // create if necessary clones
            if (true === loop && this.viewport.width < this.width) {
                // put clones after
                width = 0;

                for (i = 0; i < this.elements.length; i += 1) {
                    element = this.elements[i];

                    width += element.width;
                    element.$element.clone().addClass('__clone__').appendTo(this.$container);

                    if (width >= this.viewport.width) {
                        break;
                    }
                }

                this.width += width;
            }
        },

        addEventHandlers: function (loop) {
            this.viewport.$element.on({
                reset: bind(function (event, index) {
                    this.moveTo(0);
                }, this),
                moveTo: bind(function (event, index) {
                    this.moveTo(defaults(index, 0));
                }, this),
                next: bind(function (event, delta) {
                    var index = this.activeIndex + defaults(delta, 1);
                    console.log(index);
                    if (index > this.maxIndex) {
                        index = (index - 1) % this.maxIndex;
                    }

                    this.moveTo(index, 1);
                }, this),
                previous: bind(function (event, delta) {
                    var index = this.activeIndex + defaults(delta, -1);
                    console.log(index);
                    if (index < 0) {
                        index = this.maxIndex + 1 + index;
                    }

                    this.moveTo(index, -1);
                }, this)
            });
        },

        moveTo: function (index, direction) {
            var element;

            if (index >= 0 && index <= this.maxIndex) {
                element = this.elements[index];

                direction = direction || (this.activeIndex - index > 0 ? 1 : -1);

                this.animation(this.$container, this.viewport, this.elements, index, direction, bind(function () {
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