"use strict";
(function () {
    var calling = function (func) {
        return {
            withArgs: function () {
                var args = Array.prototype.slice.call(arguments);
                return function() {
                    func.apply(null, args);
                };
            }
        };
    };

    // Node / CommonJS.
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = calling;
    // AMD / RequireJS.
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return calling; });
    // Globals / <script>.
    } else {
        window.calling = calling;
    }
}());
