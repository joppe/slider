/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    var Controls,
        default_options = {
            next: 'li.next a',
            previous: 'li.previous a',
            number: 'li.number a'
        };

    Controls = (function () {
        var Controls;

        Controls = function ($container, $slider, options) {
            this.$container = $container;
            this.$slider = $slider;

            this.$next = this.$container.find(options.next);
            this.$previous = this.$container.find(options.previous);

            this.numbers = this.getNumbers(options);

            this.addTriggers();
            this.addEventListeners();
        };
        Controls.prototype = {
            getNumbers: function (options) {
                var $numbers = this.$container.find(options.number),
                    numbers = {};

                $numbers.each(function (index) {
                    var $number = $(this),
                        slideIndex = $number.data('slide-index');

                    if (typeof slideIndex === 'number') {
                        index = slideIndex;
                    }

                    numbers['number-' + index] = $number;
                });

                return numbers;
            },

            addTriggers: function () {
                var self = this;

                this.$next.on({
                    click: function (event) {
                        event.preventDefault();

                        self.$slider.trigger('sliderNext');
                    }
                });
                this.$previous.on({
                    click: function (event) {
                        event.preventDefault();

                        self.$slider.trigger('sliderPrevious');
                    }
                });

                $.each(this.numbers, function (slideIndex, $number) {
                    $number.on({
                        click: function (event) {
                            var index = parseInt(slideIndex.replace('number-', ''), 10);

                            event.preventDefault();

                            self.$slider.trigger('sliderMoveTo', index);
                        }
                    });
                });
            },

            updateControls: function (sliderStatus) {
                var $activeAnchor,
                    $oldActiveAnchor;

                if (this.numbers['number-' + sliderStatus.activeIndex]) {
                    $activeAnchor = this.numbers['number-' + sliderStatus.activeIndex];

                    if (!$activeAnchor.hasClass('active')) {
                        $oldActiveAnchor = this.$container.find('.active');

                        if ($oldActiveAnchor.length > 0) {
                            $oldActiveAnchor.removeClass('active');
                            $oldActiveAnchor.trigger('slideControlSetInActive');
                        }
                    }

                    $activeAnchor.addClass('active');
                    $activeAnchor.trigger('slideControlSetActive');
                } else {
                    $oldActiveAnchor = this.$container.find('.active');

                    if ($oldActiveAnchor.length > 0) {
                        $oldActiveAnchor.removeClass('active');
                        $oldActiveAnchor.trigger('slideControlSetInActive');
                    }
                }

                if (sliderStatus.activeIndex === 0) {
                    this.$previous.addClass('disabled');
                    this.$previous.trigger('slideControlDisable');
                } else {
                    this.$previous.removeClass('disabled');
                    this.$previous.trigger('slideControlEnable');
                }

                if (sliderStatus.activeIndex >= sliderStatus.elementCount) {
                    this.$next.addClass('disabled');
                    this.$next.trigger('slideControlDisable');
                } else {
                    this.$next.removeClass('disabled');
                    this.$next.trigger('slideControlEnable');
                }
            },

            addEventListeners: function () {
                var self = this;

                this.$slider.on({
                    sliderAfterChange: function (event, sliderStatus) {
                        self.updateControls(sliderStatus);
                    }
                });
            }
        };

        return Controls;
    }());

    $.fn.sliderControls = function ($slider, config) {
        var options = $.extend(default_options, config === undefined ? {} : config);

        return this.each(function () {
            var controls = new Controls($(this), $slider, options);
        });
    };
}(jQuery));