/*global jQuery*/

jQuery(function ($) {
    'use strict';

    // create the slider
    $('div.slider').each(function () {
        var $slider = $(this);

        $slider.slider({
            loopMode: 'none'
        });
        $('ul.slider-nav').sliderControls($slider);
    });
});