'use strict';

/**
 * Modernized Timers for ScriptCraft using Bukkit's Scheduler.
 * Converts millisecond delays to Minecraft ticks (approx. 50ms per tick).
 */

(function() {
    const Bukkit = org.bukkit.Bukkit;
    const Server = Bukkit.getServer();
    const Runnable = Java.type('java.lang.Runnable');

    function toTicks(ms) {
        return Math.max(1, Math.ceil(ms / 50));
    }

    global.setTimeout = function(callback, delay, ...args) {
        const task = Server.getScheduler().runTaskLater(__plugin__, new Runnable({
            run: function() {
                callback(...args);
            }
        }), toTicks(delay || 0));
        return task;
    };

    global.clearTimeout = function(task) {
        if (task && task.cancel) {
            task.cancel();
        }
    };

    global.setInterval = function(callback, interval, ...args) {
        const ticks = toTicks(interval || 0);
        const task = Server.getScheduler().runTaskTimer(__plugin__, new Runnable({
            run: function() {
                callback(...args);
            }
        }), ticks, ticks);
        return task;
    };

    global.clearInterval = global.clearTimeout;

    // nextTick is already in process.js, but let's ensure consistency
    if (!global.setImmediate) {
        global.setImmediate = function(callback, ...args) {
            return global.setTimeout(callback, 0, ...args);
        };
    }
})();
