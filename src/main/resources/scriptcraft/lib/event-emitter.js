'use strict';

/**
 * A simple Node.js-style EventEmitter implementation.
 */

function EventEmitter() {
    this._events = {};
}

EventEmitter.prototype.on = function(type, listener) {
    this._events[type] = this._events[type] || [];
    this._events[type].push(listener);
    return this;
};

EventEmitter.prototype.once = function(type, listener) {
    var self = this;
    function g() {
        self.removeListener(type, g);
        listener.apply(this, arguments);
    }
    g.listener = listener;
    this.on(type, g);
    return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
    if (!this._events[type]) return this;
    var list = this._events[type];
    for (var i = 0; i < list.length; i++) {
        if (list[i] === listener || list[i].listener === listener) {
            list.splice(i, 1);
            break;
        }
    }
    return this;
};

EventEmitter.prototype.emit = function(type) {
    if (!this._events[type]) return false;
    var handler = this._events[type];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < handler.length; i++) {
        handler[i].apply(this, args);
    }
    return true;
};

module.exports = EventEmitter;
