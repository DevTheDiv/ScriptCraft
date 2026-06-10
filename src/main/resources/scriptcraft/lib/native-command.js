'use strict';

/**
 * Utility for registering top-level Bukkit commands at runtime.
 * Uses reflection to access Bukkit's internal CommandMap.
 */

var Bukkit = org.bukkit.Bukkit;
var CommandMap = null;

try {
    var server = Bukkit.getServer();
    var getCommandMap = server.getClass().getDeclaredMethod('getCommandMap');
    getCommandMap.setAccessible(true);
    CommandMap = getCommandMap.invoke(server);
} catch (e) {
    console.warn('Failed to access Bukkit CommandMap. Top-level aliases will not be available: ' + e);
}

/**
 * Registers a new top-level command.
 * 
 * @param {string} name The primary command name.
 * @param {string[]} aliases Array of alternative names.
 * @param {string} description Command description.
 * @param {function} callback The function to execute.
 * @param {function} [tabCompleteCallback] The function to handle tab completion.
 */
function register(name, aliases, description, callback, tabCompleteCallback) {
    if (!CommandMap) return;

    var ScriptCraftCommand = Java.extend(org.bukkit.command.defaults.BukkitCommand, {
        execute: function(sender, label, args) {
            try {
                return callback(sender, label, Array.prototype.slice.call(args));
            } catch (e) {
                console.error('Error executing native command ' + name + ': ' + e);
                return false;
            }
        },
        tabComplete: function(sender, alias, args) {
            var javaList = new java.util.ArrayList();
            try {
                if (typeof tabCompleteCallback === 'function') {
                    var result = tabCompleteCallback(sender, alias, Array.prototype.slice.call(args));
                    if (result && result.length) {
                        for (var i = 0; i < result.length; i++) {
                            javaList.add(String(result[i]));
                        }
                    }
                }
            } catch (e) {
                console.error('Error in tabComplete for native command ' + name + ': ' + e);
            }
            return javaList;
        }
    });

    var cmd = new ScriptCraftCommand(name);
    cmd.setDescription(description || '');
    if (aliases && aliases.length > 0) {
        var aliasList = new java.util.ArrayList();
        for (var i = 0; i < aliases.length; i++) {
            aliasList.add(aliases[i]);
        }
        cmd.setAliases(aliasList);
    }

    CommandMap.register('scriptcraft', cmd);
}

module.exports = {
    register: register
};
