<!DOCTYPE html>
<html>
    <head>
        <title>Slider demo</title>
        <link type="text/css" rel="stylesheet" href="style/screen.css">
        <script type="text/javascript" src="javascript/3th-party/jquery-1.8.1.min.js"></script>
        <script type="text/javascript" src="javascript/slider/jquery.slider.js"></script>
        <script type="text/javascript" src="javascript/slider/jquery.slider-controls.js"></script>
        <script type="text/javascript" src="javascript/slider/jquery.slider-animation.js"></script>
        <script type="text/javascript" src="javascript/global.js"></script>
    </head>

    <body>
        <div id="example-1">
            <div class="slider" id="slider-1">
                <ul>
                    <?php
                    foreach (range(1, 6) as $index) {
                        ?>
                        <li>
                            <a href="#">
                                <span><?php echo $index; ?></span>
                                <img src="http://lorempixel.com/200/200/sports/<?php echo $index; ?>" width="200" height="200">
                            </a>
                        </li>
                        <?php
                    }
                    ?>
                </ul>
            </div>
            <ul class="slider-nav">
                <li class="previous">
                    <a href="#">previous</a>
                </li>
                <li class="next">
                    <a href="#">next</a>
                </li>
            </ul>
        </div>
        <div id="example-2">
            <div class="slider" id="slider-2">
                <ul>
                    <?php
                    foreach (range(1, 6) as $index) {
                        ?>
                        <li>
                            <a href="#">
                                <span><?php echo $index; ?></span>
                                <img src="http://lorempixel.com/200/200/sports/<?php echo $index; ?>" width="200" height="200">
                            </a>
                        </li>
                        <?php
                    }
                    ?>
                </ul>
            </div>
            <ul class="slider-nav">
                <li class="previous">
                    <a href="#">previous</a>
                </li>
                <li class="next">
                    <a href="#">next</a>
                </li>
            </ul>
        </div>
        <div id="example-3">
            <div class="slider" id="slider-3">
                <ul>
                    <?php
                    foreach (range(1, 6) as $index) {
                        ?>
                        <li>
                            <a href="#">
                                <span><?php echo $index; ?></span>
                                <img src="http://lorempixel.com/200/200/sports/<?php echo $index; ?>" width="200" height="200">
                            </a>
                        </li>
                        <?php
                    }
                    ?>
                </ul>
            </div>
            <ul class="slider-nav">
                <li class="previous">
                    <a href="#">previous</a>
                </li>
                <li class="next">
                    <a href="#">next</a>
                </li>
            </ul>
        </div>
    </body>
</html>