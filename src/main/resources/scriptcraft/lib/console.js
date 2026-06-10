'use strict';

/**
 * A modern console implementation for ScriptCraft that integrates with 
 * Bukkit's logger and provides better object inspection.
 */

var logger = __plugin__.getLogger();

function format(args) {
    return Array.prototype.slice.call(args).map(function(arg) {
        if (typeof arg === 'object' && arg !== null) {
            try {
                // Handle Java objects
                if (arg instanceof java.lang.Object) {
                    return arg.toString();
                }
                return JSON.stringify(arg, null, 2);
            } catch (e) {
                return '[Complex Object]';
            }
        }
        return String(arg);
    }).join(' ');
}

var console = {
    log: function() {
        logger.info(format(arguments));
    },
    info: function() {
        logger.info(format(arguments));
    },
    warn: function() {
        logger.warning(format(arguments));
    },
    error: function() {
        logger.severe(format(arguments));
    },
    debug: function() {
        if (global.config && global.config.verbose) {
            logger.info('[DEBUG] ' + format(arguments));
        }
    }
};

module.exports = console;
