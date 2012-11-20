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
            elementCount: slider.$elements.not('.ghost').length,
            newActiveIndex: null,
            activeIndex: null,
            activePage: null,
            newActivePage: null,
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
        this.elements = this.$viewport.find(options.element).toArray();

        this.pages = this.createPages(options);

        if (options.loopMode === 'circular') {
            this.createClones(options);
        }

        // TODO prepare container? check for active class? or trigger an event to do this?

        this.status = createStatus(this, options);

//        this.addEventListeners();
    };
    Slider.prototype = {
        createPages: function (options) {
            var pages = [],
                viewportSize = options.horizontal ? this.$viewport.width() : this.$viewport.height(),
                pageSize = 0,
                totalSize = 0,
                $pageElement = null;

            $.each(this.elements, function (index, element) {
                var $element = $(element),
                    size = options.horizontal ? $element.width() : $element.height();

                if ($pageElement === null) {
                    $pageElement = $element;
                }

                totalSize += size;
                pageSize += size;
                if (pageSize > viewportSize) {
                    pages.push($pageElement);
                    pageSize = size;
                    $pageElement = $element;
                }
            });

            pages.push($pageElement);

            if (options.horizontal) {
                this.$slider.css({
                    width: totalSize
                });
            } else {
                this.$slider.css({
                    height: totalSize
                });
            }

            return pages;
        },

        createClones: function (options) {
            var $first = $(this.elements[0]),
                $last = $(this.elements[this.elements.length - 1]),
                firstSize = options.horizontal ? $first.width() : $first.height(),
                lastSize = options.horizontal ? $last.width() : $last.height();

            this.elements.push($first.clone().addClass('ghost').appendTo(this.$slider).get(0));
            this.elements.unshift($last.clone().addClass('ghost').prependTo(this.$slider).get(0));

            if (options.horizontal) {
                this.$slider.css({
                    left: -firstSize,
                    width: this.$slider.width() + firstSize + lastSize
                });
            } else {
                this.$slider.css({
                    top: -firstSize,
                    height: this.$slider.height() + firstSize + lastSize
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
//                    self.moveTo(0);
                },
                sliderNext: function () {
//                    var moveToIndex = self.status.activeIndex + 1;
//
//                    if (self.status.newActiveIndex !== null) {
//                        moveToIndex = self.status.newActiveIndex + 1;
//                    }
//
//                    self.moveTo(moveToIndex);
                },
                sliderMoveTo: function (event, index) {
//                    self.moveTo(index);
                },
                sliderPrevious: function () {
//                    var moveToIndex = self.status.activeIndex - 1;
//
//                    if (self.status.newActiveIndex !== null) {
//                        moveToIndex = self.status.newActiveIndex - 1;
//                    }
//
//                    self.moveTo(moveToIndex);
                },
                sliderAnimationFinished: function () {
//                    self.status.activeIndex = self.status.newActiveIndex;
//                    self.status.newActiveIndex = null;
//                    self.$slider.trigger('sliderAfterChange', self.status);
                }
            });
        },

        /**
         * Move the slider to the specified index of an element
         *
         * @param {Number} index
         */
        moveTo: function (index) {
//            var self = this;
//
//            if (this.status.options.loopMode !== 'none') {
//                if (index < 0) {
//                    index = this.status.elementCount - 1;
//                }
//
//                if (index >= this.status.elementCount) {
//                    index = 0;
//                }
//            }
//
//            if (index >= 0 && index < this.status.elementCount) {
//                this.status.newActiveIndex = index;
//                this.$viewport.trigger('sliderBeforeChange', self.status);
//                this.animation(this.status);
//            }
        }
    };

    $.fn.slider = function (config) {
        var options = $.extend(default_options, config === undefined ? {} : config);

        return this.each(function () {
            var slider = new Slider($(this), options);
        });
    };
}(jQuery));