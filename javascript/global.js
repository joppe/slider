/*global jQuery*/

jQuery(function ($) {
    'use strict';

    // create the slider
    $('#example-1 div.slider').each(function () {
        var $slider = $(this);

        $slider.slider({
            loopMode: 'none',
            animation: $.createSliderAnimation()
        });
        $('#example-1 ul.slider-nav').sliderControls($slider);
    });

    // create the slider
    $('#example-2 div.slider').each(function () {
        var $slider = $(this);

        $slider.slider({
            loopMode: 'auto-reverse',
            animation: $.createSliderAnimation()
        });
        $('#example-2 ul.slider-nav').sliderControls($slider);
    });

    // create the slider
    $('#example-3 div.slider').each(function () {
        var $slider = $(this);

        $slider.slider({
            loopMode: 'circular',
            animation: $.createSliderAnimation()
        });
        $('#example-3 ul.slider-nav').sliderControls($slider);
    });
});