/*global jQuery*/

jQuery(function ($) {
    'use strict';

    // create the slider
    $('div.slider').each(function () {
        var $slider = $(this);

        $slider.slider({
            animation: $.createSliderAnimation()
        });
        $('ul.slider-nav').sliderControls($slider);
    });
});