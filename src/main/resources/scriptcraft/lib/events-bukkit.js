/*global Java, exports, org, __plugin__ */

var bkEventPriority = org.bukkit.event.EventPriority;
var bkHandlerList = org.bukkit.event.HandlerList;
var bkPluginManager = org.bukkit.Bukkit.getPluginManager();
var ScriptCraftListener = Java.extend(org.bukkit.event.Listener, {});

// Central registry for multiplexing event listeners
// Key: EventClassName + Priority
var _dispatchers = {};

/**
 * Registers an event listener with the Bukkit plugin manager.
 * 
 * @param {any} eventType The Java class of the event to listen for.
 * @param {function} handler The function to call when the event fires.
 * @param {string} [priority] The priority of the event. Defaults to HIGHEST.
 * @returns {{ unregister: function(): void }}
 */
exports.on = function(eventType, handler, priority) {
    if (typeof priority == 'undefined') {
        priority = 'HIGHEST';
    } else {
        priority = priority.toUpperCase().trim();
    }
    
    var eventClassName = eventType.class.name;
    var dispatcherKey = eventClassName + ':' + priority;
    
    if (!_dispatchers[dispatcherKey]) {
        var callbacks = [];
        var listener = new ScriptCraftListener();
        
        var eventExecutor = function(l, evt) {
            var callbacksToRun = callbacks.slice(); // Copy to avoid issues if unregistered during loop
            for (var i = 0; i < callbacksToRun.length; i++) {
                var cbObj = callbacksToRun[i];
                var cancel = function() {
                    if (evt instanceof org.bukkit.event.Cancellable) {
                        evt.setCancelled(true);
                    }
                };
                
                var bound = {
                    unregister: cbObj.unregister,
                    cancel: cancel
                };
                
                try {
                    cbObj.handler.call(bound, evt, cancel);
                } catch (e) {
                    console.error('Error in event ' + eventClassName + ': ' + e);
                }
            }
        };
        
        bkPluginManager.registerEvent(
            eventType.class,
            listener,
            bkEventPriority[priority],
            eventExecutor,
            __plugin__
        );
        
        _dispatchers[dispatcherKey] = {
            listener: listener,
            callbacks: callbacks
        };
    }
    
    var dispatcher = _dispatchers[dispatcherKey];
    var cbRecord = { handler: handler };
    
    cbRecord.unregister = function() {
        var idx = dispatcher.callbacks.indexOf(cbRecord);
        if (idx > -1) {
            dispatcher.callbacks.splice(idx, 1);
        }
        if (dispatcher.callbacks.length === 0) {
            bkHandlerList.unregisterAll(dispatcher.listener);
            delete _dispatchers[dispatcherKey];
        }
    };
    
    dispatcher.callbacks.push(cbRecord);
    
    return { unregister: cbRecord.unregister };
};

/**
 * Alias for on() to match browser standards.
 */
exports.addEventListener = exports.on;

/**
 * Alias for on() with automatic unregistration after first fire.
 */
exports.once = function(eventType, handler, priority) {
    var reg = exports.on(eventType, function(evt, cancel) {
        this.unregister();
        handler.call(this, evt, cancel);
    }, priority);
    return reg;
};

/**
 * Alias for removeEventListener/off - note that this requires the exact same function reference.
 */
exports.off = function(eventType, handler, priority) {
    // This is tricky with the multiplexer since we store cbRecords.
    // We'd need to search for the handler.
    priority = (priority || 'HIGHEST').toUpperCase().trim();
    var dispatcherKey = eventType.class.name + ':' + priority;
    var dispatcher = _dispatchers[dispatcherKey];
    if (dispatcher) {
        for (var i = 0; i < dispatcher.callbacks.length; i++) {
            if (dispatcher.callbacks[i].handler === handler) {
                dispatcher.callbacks[i].unregister();
                break;
            }
        }
    }
};

exports.removeEventListener = exports.off;
