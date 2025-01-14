'use strict';

var global = this;

// ADD GLOBALS AND TOOLS TO SCOPE
// SCRoot
load("./scriptcraft/init/globals.js");
//Timers - setTimeout(), setInterval(), clearInterval(), clearTimeout()

load("./scriptcraft/init/timers.js");
// isJavaObject()
load("./scriptcraft/init/java-utils.js");
// find()
load("./scriptcraft/init/find.js");


// ECHO
load("./scriptcraft/init/echo.js");

//_save
load("./scriptcraft/init/save.js");
// _load
load("./scriptcraft/init/load.js");
// _loadJSOJN
load("./scriptcraft/init/loadJSON.js");


var configFile = new File(SCRoot, 'data/');
configFile.mkdirs();
configFile = new File(configFile, 'global-config.json');
var config = _load(configFile);
if (!config) {
  config = { verbose: false };
}
global.config = config;

var modulePaths = [
  SCRoot + '/lib/',
  SCRoot + '/modules/'
];

var requireHooks = {
  loading: function(path) {
    if (config.verbose) {
      console.info('loading ' + path);
    }
  },
  loaded: function(path) {
    if (config.verbose) {
      console.info('loaded  ' + path);
    }
  }
};

var configRequire = _load(SCRoot + '/lib/require.js', true);
global.require = configRequire(
  SCRoot,
  modulePaths,
  requireHooks,
  [eval]
);


var cmdModule = require('./lib/command.js');
global.command = cmdModule.command;


var unloadHandlers = [];
function _onDisable(/* evt */) {
  // save config
  scsave(global.config, new File(SCRoot, 'data/global-config.json'));
  for (var i = 0; i < unloadHandlers.length; i++) {
    unloadHandlers[i]();
  }
}

global.addUnloadHandler = function(f) {
  unloadHandlers.push(f);
};

function __onEnable() {

  var File = java.io.File,
    FileReader = java.io.FileReader,
    BufferedReader = java.io.BufferedReader,
    PrintWriter = java.io.PrintWriter,
    FileWriter = java.io.FileWriter,
    // assumes scriptcraft.js is in mcserver/plugins/scriptcraft/lib directory
    jsPluginsRootDir = new File("scriptcraft"),
    jsPluginsRootDirName = jsPluginsRootDir.getCanonicalPath().replaceAll('\\', '/');


  if (config.verbose) {
    console.info(`Setting up CommonJS-style module system. Root Directory: ${jsPluginsRootDirName}`);
    console.info('Module paths: ' + JSON.stringify(modulePaths));
  }



  /*
   setup persistence
   */
  require('./lib/persistence.js')(jsPluginsRootDir, global);


  global.__onTabComplete = require('tabcomplete.js');

  load('scriptcraft/lib/plugin.js')
  global.plugin = plugins.plugin;
  global.events = require('./lib/events-helper-bukkit.js');
  var evnts = require('./lib/events-bukkit.js');
  for (var func in evnts) {
    global.events[func] = evnts[func]
  }

  events.pluginDisableEvent(_onDisable);

  plugins.autoload(global, new File(SCRoot, 'plugins'));

  require('./lib/legacy-check.js')(jsPluginsRootDir);
 }


function __onCommand(sender, cmd, label, args) {
  var cmdName = ('' + cmd.getName()).toLowerCase(); //should be js
  var result = false;
  this.self = sender;
  load("./scriptcraft/init/refresh.js");
  if (cmdName === 'js') {
    result = true;
    try {
      var code = args.join(' ');
      var codeRes = eval(code);
      if (codeRes !== undefined) {
        if (codeRes === null) {
           // engine eval will return null even if the result should be undefined
           // this can be confusing so I think it's better to omit output for this case
           // sender.sendMessage('(null)');
        } else {
          try {
            if (isJavaObject(codeRes) || typeof codeRes === 'function') {
              echo(sender, codeRes);
            } else {
              var replacer = function replacer(key, value) {
                return this[key] instanceof Packages.java.lang.Object
                  ? '' + this[key]
                  : value;
              };
              echo(sender, JSON.stringify(codeRes, replacer, 2));

            }
          } catch (displayError) {
            console.error(`Error while trying to display result: ${codeRes}, Error: ${displayError}`);
          }
        }
      }
    } catch (e) {
      console.error(`Error while trying to evaluate javascript: ${codeRes}, Error: ${e}`);
      echo(sender,  `Error while trying to evaluate javascript: ${codeRes}, Error: ${e}`);
      throw e;
    }
  }
  if (cmdName == 'jsp') {
    cmdModule.exec(args, sender);
    result = true;
  }
  delete this.self;
  return result;
}
