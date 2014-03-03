/*global define*/

/**
 * @author Joppe Aarts <joppe@apestaartje.info>
 */

define(function () {
    'use strict';

    return function (array) {
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

            next: function () {
                position += 1;
                return this;
            },

            reset: function () {
                position = 0;
                return this;
            },

            seek: function (newPosition) {
                position = newPosition;
                return this;
            },

            valid: function () {
                var valid = false;

                if (position >= 0 && position < this.count()) {
                    valid = true;
                }

                return valid;
            },

            each: function (callback, context) {
                for (this.reset(); this.valid(); this.next()) {
                    callback.call(context, this.current(), this.key());
                }
            }
        };
    };
});