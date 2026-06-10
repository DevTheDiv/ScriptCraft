'use strict';

/**
 * Enhanced Plugin Loader for ScriptCraft.
 * Supports legacy .js files and modern JSON-configured plugins.
 */

var _plugins = {};
var File = java.io.File;

function _plugin(moduleName, moduleObject, isPersistent) {
    if (typeof _plugins[moduleName] != 'undefined') {
        return _plugins[moduleName].module;
    }

    var pluginData = { persistent: isPersistent, module: moduleObject };
    if (typeof moduleObject.store == 'undefined') {
        moduleObject.store = {};
    }
    _plugins[moduleName] = pluginData;

    if (isPersistent && global.persist) {
        moduleObject.store = global.persist(moduleName, moduleObject.store);
    }
    return moduleObject;
}

function _autoload(context, pluginDir) {
    if (!pluginDir.exists()) return;

    var items = pluginDir.listFiles();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        
        if (item.isDirectory()) {
            // Check for modern plugin structure (plugin.json)
            var jsonFile = new File(item, 'plugin.json');
            if (jsonFile.exists()) {
                _loadModernPlugin(item, jsonFile);
            } else {
                // If it's a directory but no plugin.json, we don't load it as a plugin directly,
                // but we could recursively search if desired. For strictness, we'll only load
                // top-level plugin directories that contain plugin.json.
                if (global.config && global.config.verbose) {
                    console.warn('Ignoring directory without plugin.json: ' + item.name);
                }
            }
        } else if (item.name.match(/\.js$/)) {
            if (global.config && global.config.verbose) {
                console.warn('Ignoring legacy standalone script (use plugin.json instead): ' + item.name);
            }
        }
    }
}

function _loadModernPlugin(dir, jsonFile) {
    try {
        var jsonStr = require('fs').readFileSync(jsonFile.getAbsolutePath(), 'UTF-8');
        var metadata = JSON.parse(jsonStr);
        var mainFile = new File(dir, metadata.main || 'index.js');
        
        if (!mainFile.exists()) {
            console.warn('Main file ' + mainFile.name + ' not found for plugin ' + metadata.name);
            return;
        }

        // Require the main file - it should call registerPlugin()
        // We pass the metadata to the context so registerPlugin can access it
        global.__plugin_metadata = metadata;
        require(mainFile.getAbsolutePath());
        delete global.__plugin_metadata;

        if (global.config && global.config.verbose) {
            console.info('Loaded plugin: ' + (metadata.name || dir.name));
        }
    } catch (e) {
        console.error('Error loading modern plugin from ' + dir.name + ': ' + e);
    }
}

module.exports = {
    plugin: _plugin,
    autoload: _autoload
};
