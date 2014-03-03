requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: '../../bower_components/jquery/jquery',
        iterator: '../../src/iterator'
    }
});

define(['jquery', 'iterator'], function ($, iterator) {
    'use strict';

    $(function () {
        var it = iterator($('li').toArray());

        while (it.valid()) {
            console.log(it.key() + ' :: ' + it.current());
            it.next();
        }

        it.each(function (val, key) {
            console.log(key + ' :: ' + val);
        });

        console.log(it.reset().seek(2).valid());
        console.log(it.reset().next().next().next().valid());
        console.log(it.reset().next().next().next().key());
        console.log('count = ' + it.count());
    });
});