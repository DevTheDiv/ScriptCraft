'use strict';
/* 
   command management - allow for non-ops to execute approved javascript code.
*/
var _commands = {},
  _cmdInterceptors = [];
/*
  execute a JSP command.
*/
var executeCmd = function(args, player) {
  var name,
    cmd,
    intercepted,
    result = null;

  if (args.length === 0) {
    throw new Error('Usage: jsp command-name command-parameters');
  }
  name = args[0];
  cmd = _commands[name];
  if (typeof cmd === 'undefined') {
    // it's not a global command - pass it on to interceptors
    intercepted = false;
    for (var i = 0; i < _cmdInterceptors.length; i++) {
      if (_cmdInterceptors[i](args, player)) intercepted = true;
    }
    if (!intercepted) {
      console.warn('Command %s is not recognised', name);
    }
  } else {
    try {
      result = cmd.callback(args.slice(1), player);
    } catch (e) {
      console.error(
        'Error while trying to execute command: ' + JSON.stringify(args)
      );
      throw e;
    }
  }
  return result;
};
/*
  define a new JSP command.
*/
/**
 * Defines a new JavaScript plugin command (JSP).
 * 
 * @param {string|function} name The name of the command, or the callback function if it has a name.
 * @param {function} [func] The callback function to execute when the command is called.
 * @param {string[]} [options] An array of options for the command (e.g., tab-completion candidates).
 * @param {boolean} [intercepts] If true, this command will intercept all JSP calls.
 * @returns {function} The callback function.
 */
var defineCmd = function(name, func, options, intercepts) {
  if (typeof name == 'function') {
    intercepts = options;
    options = func;
    func = name;
    name = func.name;
  }

  if (typeof options == 'undefined') {
    options = [];
  }
  _commands[name] = { callback: func, options: options };
  if (intercepts) {
    _cmdInterceptors.push(func);
  }
  return func;
};
exports.command = defineCmd;
exports.commands = _commands;
exports.exec = executeCmd;
