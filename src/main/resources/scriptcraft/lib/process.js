'use strict';

/**
 * A minimal 'process' global for ScriptCraft.
 */

var System = java.lang.System;

var process = {
    env: {},
    platform: System.getProperty('os.name').toLowerCase().indexOf('win') >= 0 ? 'win32' : 'linux',
    version: 'v20.0.0', // Faked version for compatibility
    arch: System.getProperty('os.arch'),
    cwd: function() {
        return new java.io.File('.').getCanonicalPath();
    },
    nextTick: function(callback) {
        server.getScheduler().runTask(__plugin__, callback);
    }
};

// Populate env
var env = System.getenv();
var keys = env.keySet().iterator();
while (keys.hasNext()) {
    var key = keys.next();
    process.env[key] = env.get(key);
}

module.exports = process;
