/**
 * ScriptCraft Modern Bootstrap
 * Central entry point for all initialization logic.
 */

(function(global) {
    'use strict';

    // 1. Initialize core constants and Java bridges
    const File = java.io.File;
    const SCRoot = new File("./scriptcraft").getCanonicalPath();
    global.SCRoot = SCRoot;

    global.Bukkit = Packages.org.bukkit;
    global.Server = global.Bukkit.Bukkit.getServer();
    global.CurrentPlugin = __plugin__;

    global.isJavaObject = function(o) {
        if (o === global) return false;
        if (o !== undefined && o !== null) {
            try {
                if (typeof o.constructor === 'function') return false;
            } catch (e) { return true; }
            try {
                var result = o.getClass ? true : false;
                if (result == true) return result;
            } catch (e2) { }
            if (o instanceof Packages.java.lang.Object) return true;
        }
        return o instanceof Packages.java.lang.Object;
    };

    // 2. Setup the Native Module System
    // We strictly rely on GraalVM's native CommonJS and ESM support configured in Java.

    // 3. Initialize Modern Polyfills and Globals
    global.echo = function(...args) {
        var _self = false;
        try {
            _self = args[0].getClass().getSimpleName() === "CraftPlayer"
                ||  args[0].getClass().getSimpleName() === "ColouredConsoleSender";
        } catch(e){
            _self = false;
        }
        var sender = _self ? args[0] : global.self;
        var msg    = _self ? args[1] : args[0];
        if (sender) {
            sender.sendMessage(msg);
        } else {
            console.log(msg); // Fallback if no sender context
        }
    };
    global.alert        = global.echo;

    global.console      = require('console');
    global.process      = require('process');
    global.fs           = require('fs');
    global.fetch        = require('fetch');
    global.hooks        = require('hooks');
    global.EventEmitter = require('event-emitter');
    require('timers'); // Timers initialize themselves globally

    // 4. Initialize Core Systems
    const cmdModule     = require('command');
    global.command      = cmdModule.command;
    
    // Event Multiplexer Setup
    // Dynamically generate events-helper-bukkit.js based on the current server jar
    var eventsHelper = new File(SCRoot, "lib/events-helper-bukkit.js");
    if (!eventsHelper.exists()) {
        console.info('Generating dynamic events helper...');
        load("./scriptcraft/lib/generate-events-helper.js");
    }

    global.events       = require('events-helper-bukkit');
    const evnts         = require('events-bukkit');
    for (var func in evnts) {
        global.events[func] = evnts[func];
    }

    // Modern Plugin System
    global.registerPlugin = require('modern-plugin');

    // 6. Handle Plugin Lifecycle
    global.__onEnable = function() {
        console.info('ScriptCraft Modern Core initialized.');
        
        // Autoload legacy plugins
        const pluginsDir = new File(SCRoot, 'plugins');
        if (pluginsDir.exists()) {
            const pluginLoader = require('plugin');
            pluginLoader.autoload(global, pluginsDir);
        }

        // Trigger the enable hook for modern plugins
        global.hooks.trigger('enable');
    };

    global.__onCommand = function(sender, cmd, label, args) {
        const cmdName = ('' + cmd.getName()).toLowerCase();
        global.self = sender;
        
        try {
            if (cmdName === 'js') {
                const code = args.join(' ');
                const result = eval(code);
                if (result !== undefined && result !== null) {
                    global.echo(sender, result);
                }
                return true;
            }
            if (cmdName === 'jsp') {
                cmdModule.exec(args, sender);
                return true;
            }
        } catch (e) {
            console.error('Command Error:', e);
            global.echo(sender, 'Error: ' + e.message);
        } finally {
            delete global.self;
        }
        return false;
    };

})(this);
