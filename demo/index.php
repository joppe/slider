<!DOCTYPE html>
<html>
    <head>
        <title>Slider demo</title>
        <link type="text/css" rel="stylesheet" href="../bower_components/bootstrap-css/css/bootstrap.min.css">
        <link type="text/css" rel="stylesheet" href="css/screen.css">
        <script data-main="js/global.js" src="../bower_components/requirejs/require.js"></script>
    </head>

    <body>
        <section id="slider-1">
            <div class="slider">
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
            <nav class="slider">
                <a class="previous" href="javascript:void(null);">Previous</a>
                <div class="numbers"></div>
                <a class="next" href="javascript:void(null);">Next</a>
            </nav>
        </section>
    </body>
</html>