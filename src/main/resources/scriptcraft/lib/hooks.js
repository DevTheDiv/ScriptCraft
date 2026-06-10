'use strict';

/**
 * Hook system for ScriptCraft.
 * Allows plugins to register and trigger custom hooks.
 */

var _hooks = {};

/**
 * Registers a callback for a specific hook.
 * 
 * @param {string} hookName The name of the hook.
 * @param {function} callback The function to call when the hook is triggered.
 */
function addHook(hookName, callback) {
    if (!_hooks[hookName]) {
        _hooks[hookName] = [];
    }
    _hooks[hookName].push(callback);
}

/**
 * Triggers a hook, calling all registered callbacks.
 * 
 * @param {string} hookName The name of the hook to trigger.
 * @param {...any} args Arguments to pass to the callbacks.
 */
function triggerHook(hookName) {
    var args = Array.prototype.slice.call(arguments, 1);
    var callbacks = _hooks[hookName];
    if (callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
            try {
                callbacks[i].apply(null, args);
            } catch (e) {
                console.error('Error in hook ' + hookName + ': ' + e);
            }
        }
    }
}

exports.add = addHook;
exports.trigger = triggerHook;
