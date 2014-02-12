<!DOCTYPE html>
<html>
    <head>
        <title>Slider demo</title>
        <link type="text/css" rel="stylesheet" href="../bower_components/bootstrap-css/css/bootstrap.min.css">
        <link type="text/css" rel="stylesheet" href="css/screen.css">
        <script type="text/javascript" src="../bower_components/jquery/jquery.min.js"></script>
        <script type="text/javascript" src="../src/jquery.slider.js"></script>
        <script type="text/javascript" src="../src/jquery.slider-animation.js"></script>
        <script type="text/javascript" src="../src/jquery.slider-controls.js"></script>
    </head>

    <body>
        <div class="container">
            <div class="slider" id="slider-1">
                <ul>
                    <?php foreach (range(0, 5) as $index) { ?>
                        <li>
                            <a href="#">
                                <span><?php echo $index; ?></span>
                                <img src="http://lorempixel.com/200/200/sports/<?php echo $index; ?>" width="200" height="200">
                            </a>
                        </li>
                    <?php } ?>
                </ul>
            </div>
            <a class="next" href="javascript:void(null);">Next</a>
            <a class="previous" href="javascript:void(null);">Previous</a>
            <div class="numbers"></div>
            <script type="text/javascript">
                'use strict';

                var $slider = jQuery('#slider-1'),
                    $numbers = jQuery('.numbers');

                $slider.find('li').each(function (index) {
                    jQuery('<a href="javascript:void(null);">' + index + '</a>').appendTo($numbers);
                });

                $slider.slider({
                    gapless: true,
                    loop: true,
                    animation: jQuery.createSliderAnimation()
                });

                jQuery('.container').sliderControls($slider, {
                    next: 'a.next',
                    previous: 'a.previous',
                    numbers: '.numbers a'
                });
            </script>
        </div>
    </body>
</html>