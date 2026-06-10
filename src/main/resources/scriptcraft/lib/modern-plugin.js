'use strict';

/**
 * Modern Plugin API for ScriptCraft with JSON support.
 */

var hooks = require('./hooks.js');
var command = require('./command.js').command;
var events = require('./events.js');
var nativeCmd = require('./native-command.js');
var persist = require('./persistence.js');

function createPlugin(name, definition) {
    // If name is an object, it might be the definition with name in metadata
    if (typeof name === 'object') {
        definition = name;
        name = definition.name || (global.__plugin_metadata && global.__plugin_metadata.name);
    }

    var metadata = global.__plugin_metadata || definition.metadata || {};
    
    var pluginObj = {
        name: name,
        metadata: metadata,
        definition: definition,
        store: {},
        config: metadata.config || definition.config || {},
        storage: {
            get: function(key) { return pluginObj.store[key]; },
            set: function(key, val) { pluginObj.store[key] = val; },
            all: function() { return pluginObj.store; }
        }
    };

    // Load persistent store
    // Use the persistence module if available
    if (global.persist) {
        pluginObj.store = global.persist(name, pluginObj.store);
    }

    // Handle Enable
    if (definition.onEnable) {
        hooks.add('enable', function() {
            definition.onEnable.call(pluginObj);
        });
    }

    // Handle Commands from Definition
    if (definition.commands) {
        var metaCommands = metadata.commands || {};

        for (var cmdName in definition.commands) {
            var cmdDef = definition.commands[cmdName];
            var metaDef = metaCommands[cmdName];
            var callback = (typeof cmdDef === 'function') ? cmdDef : cmdDef.callback;
            
            if (callback) {
                var boundCallback = callback.bind(pluginObj);
                
                // Always register under /jsp as a safe fallback
                command(cmdName, boundCallback);

                // If it's declared in plugin.json, treat it as a manifest for a top-level native command
                if (metaDef !== undefined) {
                    var aliases = cmdDef.aliases || metaDef.aliases || [];
                    var description = cmdDef.description || metaDef.description || '';
                    var tabComplete = cmdDef.tabComplete || metaDef.tabComplete;

                    nativeCmd.register(cmdName, aliases, description, function(sender, label, args) {
                        boundCallback(args, sender);
                        return true;
                    }, function(sender, alias, args) {
                        if (typeof tabComplete === 'function') {
                            return tabComplete.call(pluginObj, args, sender);
                        } else if (Array.isArray(tabComplete)) {
                            var lastArg = args.length > 0 ? args[args.length - 1].toLowerCase() : '';
                            return tabComplete.filter(function(cand) {
                                return String(cand).toLowerCase().indexOf(lastArg) === 0;
                            });
                        }
                        return [];
                    });
                }
            }
        }
    }

    // Handle Events
    if (definition.events) {
        for (var eventName in definition.events) {
            if (events[eventName]) {
                events[eventName](definition.events[eventName].bind(pluginObj));
            } else {
                console.warn('Unknown event: ' + eventName + ' in plugin ' + name);
            }
        }
    }

    // Handle Disable
    if (definition.onDisable) {
        if (global.addUnloadHandler) {
            global.addUnloadHandler(function() {
                definition.onDisable.call(pluginObj);
            });
        }
    }

    return pluginObj;
}

module.exports = createPlugin;
