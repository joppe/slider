/*global jQuery*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

(function ($) {
    'use strict';

    /**
     * @param array
     * @returns {{count: count, current: current, key: key, next: next, previous: previous, reset: reset, seek: seek, valid: valid}}
     */
    $.iterator = function (array) {
        var position = 0;

        return {
            /**
             * @returns {Number}
             */
            count: function () {
                return array.length;
            },

            /**
             * @returns {*}
             */
            current: function () {
                return array[position];
            },

            /**
             * @returns {Number}
             */
            key: function () {
                return position;
            },

            /**
             * @returns {$.iterator}
             */
            next: function () {
                position += 1;
                return this;
            },

            /**
             * @returns {$.iterator}
             */
            previous: function () {
                position -= 1;
                return this;
            },

            /**
             * @returns {$.iterator}
             */
            reset: function () {
                position = 0;
                return this;
            },

            /**
             * @param newPosition
             * @returns {$.iterator}
             */
            seek: function (newPosition) {
                position = newPosition;
                return this;
            },

            /**
             * @returns {boolean}
             */
            valid: function () {
                var valid = false;

                if (position >= 0 && position < this.count()) {
                    valid = true;
                }

                return valid;
            }
        };
    };
}(jQuery));