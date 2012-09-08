/*global jQuery*/

jQuery(function ($) {
    'use strict';

    // create the slider
    $('div.slider').slider();
    $('ul.slider-nav').sliderControls($('div.slider'));
});