

// [0] = type, [1] = lib.jar [2] = blockX, [3] = classX
var File = java.io.File,
  FileReader = java.io.FileReader,
  FileInputStream = java.io.FileInputStream,
  Bukkit = org.bukkit.event,
  FileUtils = org.apache.commons.io.FileUtils,
  FRAMEWORK = "Spigot",
  out = java.lang.System.out,
  err = java.lang.System.err,
  System = java.lang.System,
  Modifier = java.lang.reflect.Modifier,
  clz,
  ZipInputStream = java.util.zip.ZipInputStream,
  entry = null;


var jars = System.getProperty("java.class.path").split(";");


var bukkit = "./spigot.jar";
for(var j in jars){
  var m = jars[j].replace(/.+(\\|\/)([^\/\\]+)/, "$2")
  var shrtname = m.replace(/.*(spigot).*\.jar\S*/i, "$1") + "";
  if (shrtname.toLowerCase() === "spigot"){
    bukkit = jars[j];
  }
}
print("# " + bukkit);

var zis = new ZipInputStream(new FileInputStream(bukkit));

let final = `
/*********************

## Events Helper Module (${FRAMEWORK} version)
The Events helper module provides a suite of functions - one for each possible event.
For example, the events.
  blockBreak() function is just a wrapper function which calls events.on(
    org.bukkit.event.block.BlockBreakEvent,
    callback, priority)

  This module is a convenience wrapper for easily adding new event handling functions in Javascript. 
  At the in-game or server-console prompt, players/admins can type 'events.' and use TAB completion 
  to choose from any of the approx. 160 different event types to listen to.
### Usage
  events.blockBreak( function( event ) {
    echo( event.player, 'You broke a block!');
  });
  
  The crucial difference is that the events module now has functions for each of the built-in events. The functions are accessible via TAB-completion so will help beginning programmers to explore the events at the server console window.

***/
`;


var names = [];
while ((entry = zis.getNextEntry()) != null) {
  names.push(String(entry.getName()));
}

names.sort();
names.forEach(function(name) {
  var re1 = /org\/bukkit\/event\/.+Event\.class$/;
  if (re1.test(name)) {
    name = name.replace(new RegExp('\/', 'g'), '.').replace('.class', '');
    try {
      clz = java.lang.Class.forName(name);
    } catch (e) {
      err.println('Warning: could not Class.forName("' + name + '")');
      clz = engine.eval(name);
    }
    var isAbstract = Modifier.isAbstract(clz.getModifiers());
    if (isAbstract) {
      return;
    }
    var parts = name.split('.');
    var shortName = null;
    shortName = name.replace('org.bukkit.event.', '');
    var fname = parts
      .reverse()
      .shift()
      .replace(new RegExp('^(.)'), function(a) {
        return a.toLowerCase();
      });
    fname = fname.replace(new RegExp('Hook$'), '');
    var javaDoc = 'https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/';

    var comment = [
      '/*********************',
      '### events.' + fname + '()',
      '',
      '#### Parameters',
      '',
      ' * callback - A function which is called whenever the [' +
        shortName +
        ' event](' +
        javaDoc +
        shortName.replace('.', '/') +
        '.html) is fired',
      '',
      ' * priority - optional - see events.on() for more information.',
      '',
      '***/'
      //http://jd.bukkit.org/rb/apidocs/org/bukkit/event/player/PlayerJoinEvent.html
    ];
    for (var i = 0; i < comment.length; i++) {
      final += comment[i] + "\n"
    }

    var fungen = 'exports.' + fname + ' = function(callback,priority){ \n'
    + '  return events.on(' + name + ',callback,priority);\n'
    + '};\n';

    final += fungen;
  }
});

FileUtils.writeStringToFile(new File("scriptcraft/lib/events-helper-bukkit.js"), final);
