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
                var position = status.$target.position();

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
            activePage: 0,
            newActivePage: null,
            pageCount: slider.pages.length,
            $target: null,
            getElementByPage: function (page) {
                var $element = null;

                if (slider.pages[page] !== undefined) {
                    $element = slider.pages[page];
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
        this.elements = this.getElements(options);

        this.pages = this.createPages(options);

        if (options.loopMode === 'circular') {
            this.createClones(options);
        }

        // TODO prepare container? check for active class? or trigger an event to do this?

        this.status = createStatus(this, options);

        this.addEventListeners();
    };
    Slider.prototype = {
        getElements: function (options) {
            var elements = [];

            this.$viewport.find(options.element).each(function () {
                elements.push($(this));
            });

            return elements;
        },

        createPages: function (options) {
            var pages = [],
                viewportSize = options.horizontal ? this.$viewport.width() : this.$viewport.height(),
                pageSize = 0,
                totalSize = 0,
                $pageElement = null;

            $.each(this.elements, function (index, $element) {
                var size = options.horizontal ? $element.width() : $element.height();

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
            var $first = this.elements[0],
                $last = this.elements[this.elements.length - 1],
                firstSize = options.horizontal ? $first.width() : $first.height(),
                lastSize = options.horizontal ? $last.width() : $last.height();
            // TODO make enough copies so that the viewportsize is covered
            this.elements.push($first.clone().addClass('ghost').appendTo(this.$slider));
            this.elements.unshift($last.clone().addClass('ghost').prependTo(this.$slider));

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
                sliderReset: function (event) {
                    event.stopPropagation();

//                    self.moveTo(0);
                },
                sliderNext: function (event) {
                    event.stopPropagation();
//                    var moveToIndex = self.status.activeIndex + 1;
//
//                    if (self.status.newActiveIndex !== null) {
//                        moveToIndex = self.status.newActiveIndex + 1;
//                    }
//
//                    self.moveTo(moveToIndex);
                },
                sliderMoveTo: function (event, index) {
                    event.stopPropagation();
//                    self.moveTo(index);
                },
                sliderPrevious: function (event) {
                    var moveToPage = self.status.activePage - 1;

                    event.stopPropagation();

//                    if (self.status.newActiveIndex !== null) {
//                        moveToIndex = self.status.newActiveIndex - 1;
//                    }

                    self.moveTo(moveToPage);
                },
                sliderAnimationFinished: function (event) {
                    event.stopPropagation();

                    var position;

                    self.status.activePage = self.status.newActivePage;
                    self.status.newActivePage = null;

                    // correct the position
                    if (self.status.options.loopMode === 'circular') {
                        console.log(self.status.activePage);
                        if (self.status.options.horizontal) {
                            self.$slider.css({
                                left: -self.pages[self.status.activePage].position().left
                            });
                        } else {
                            self.$slider.css({
                                top: -self.pages[self.status.activePage].position().top
                            });
                        }
                    }

                    self.$slider.trigger('sliderAfterChange', self.status);
                }
            });
        },

        /**
         * Move the slider to the specified index of an element
         *
         * @param {Number} page
         */
        moveTo: function (page) {
            console.log('moveTo: ' + page);
            var block = false;

            if (this.status.options.loopMode === 'circular') {
                if (page < 0) {
                    page = this.status.pageCount - 1;
                    this.status.$target = this.elements[0];
                } else if (page >= this.status.pageCount) {
                    page = 0;
                    this.status.$target = this.elements[this.elements.length - 1];
                }
            }

            if (block === false) {
                this.status.newActivePage = page;
                this.$viewport.trigger('sliderBeforeChange', this.status);
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