<!DOCTYPE html>
<html>
    <head>
        <title>Slider demo</title>
        <link type="text/css" rel="stylesheet" href="../bower_components/bootstrap-css/css/bootstrap.min.css">
        <link type="text/css" rel="stylesheet" href="css/screen.css">
        <script type="text/javascript" src="../bower_components/jquery/jquery.min.js"></script>
        <script type="text/javascript" src="../src/jquery.slider.js"></script>
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
            <script type="text/javascript">
                'use strict';

                jQuery('#slider-1').slider({
                    gapless: true,
                    loop: true
                });
            </script>
        </div>
    </body>
</html>