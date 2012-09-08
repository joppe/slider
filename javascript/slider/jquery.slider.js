/*global jQuery*/

(function ($) {
    'use strict';

    var Slider,
        Viewport,
        Element,
        Elements,
        default_options = {
            horizontal: true,
            loop: true,
            container: 'ul',
            element: 'li'
        };

    Viewport = (function () {
        var Viewport;

        Viewport = function ($element) {
            this.$element = $element;
        };
        Viewport.prototype = {
            width: null,
            height: null,
            getElement: function () {
                return this.$element;
            },

            getWidth: function () {
                if (this.width === null) {
                    this.width = this.$element.width();
                }
                return this.width;
            },

            getHeight: function () {
                if (this.height === null) {
                    this.height = this.$element.height();
                }
                return this.height;
            }
        };

        return Viewport;
    }());

    Element = (function () {
        var Element;

        Element = function ($element, index) {
            this.$element = $element;
            this.index = index;
        };
        Element.prototype = {
            width: null,

            height: null,

            position: null,

            getElement: function () {
                return this.$element;
            },

            getPosition: function () {
                if (this.position === null) {
                    this.position = this.$element.position();
                }
                return this.position;
            },

            getWidth: function () {
                if (this.width === null) {
                    this.width = this.$element.width();
                }
                return this.width;
            },

            getHeight: function () {
                if (this.height === null) {
                    this.height = this.$element.height();
                }
                return this.height;
            }
        };

        return Element;
    }());

    Elements = (function () {
        var Elements;

        Elements = function ($root, container_selector, element_selector, horizontal) {
            console.log('Elements.constructor');
            this.elements = this.createElements($root, element_selector, horizontal);
            this.$container = this.createContainer($root, container_selector);

            this.count = this.elements.length;
        };
        Elements.prototype = {
            width: 0,

            height: 0,

            createContainer: function ($root, container_selector) {
                var $element = $root.find(container_selector);

                $element.width(this.width);
                $element.height(this.height);

                return $element;
            },

            createElements: function ($root, element_selector, horizontal) {
                var self = this,
                    elements = [];

                $root.find(element_selector).each(function (index) {
                    var $element = $(this),
                        element = new Element($element, index);

                    elements.push(element);

                    if (horizontal) {
                        self.width += element.getWidth();
                        self.height = Math.max(self.height, element.getHeight());
                    } else {
                        self.width = Math.max(self.width, element.getWidth());
                        self.height += element.getHeight();
                    }
                });

                return elements;
            },

            getCount: function () {
                return this.count;
            }
        };

        return Elements;
    }());

    Slider = (function () {
        var Slider;

        Slider = function ($viewport, options) {
            console.log('Slider.constructor');
            this.viewport = new Viewport($viewport);
            this.elements = new Elements($viewport, options.container, options.element,  options.horizontal);

            if (this.elements.getCount() > 0) {
                this.active = 0;
            }
        };
        Slider.prototype = {
            active: null,

            addEventListeners: function () {
                this.viewport.getElement().on({
                    next: function (event) {

                    },
                    previous: function (event) {

                    }
                });
            }
        };

        return Slider;
    }());

    $.fn.slider = function (config) {
        var options = {};

        if (typeof config === 'undefined') {
            config = {};
        }
        $.extend(options, default_options, config);

        return this.each(function () {
            var slider = new Slider($(this), options);
        });
    };
}(jQuery));

// controls
(function ($) {
    'use strict';

    var Controls,
        default_options = {
            next: '.next',
            previous: '.previous'
        };

    Controls = (function () {
        var Controls;

        Controls = function ($container, $slider, options) {
            console.log('Controls.constructor');
            this.$container = $container;
            this.$slider = $slider;

            this.$next = $container.find(options.next);
            this.$previous = $container.find(options.previous);

            this.addTriggers();
            this.addEventListeners();
        };
        Controls.prototype = {
            addTriggers: function () {
                var self = this;

                this.$next.on({
                    click: function (event) {
                        event.preventDefault();

                        self.$slider.trigger('next');
                    }
                });
                this.$previous.on({
                    click: function (event) {
                        event.preventDefault();

                        self.$slider.trigger('previous');
                    }
                });
            },

            addEventListeners: function () {
                this.$slider.on({
                    change: function (event, slider) {
                        console.log(slider);
                    }
                });
            }
        };

        return Controls;
    }());

    $.fn.sliderControls = function ($slider, config) {
        var options = {};

        if (typeof config === 'undefined') {
            config = {};
        }
        $.extend(options, default_options, config);

        return this.each(function () {
            var controls = new Controls($(this), $slider, options);
        });
    };
}(jQuery));