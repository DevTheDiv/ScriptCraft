# ScriptCraft - Modding Minecraft with Javascript

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/walterhiggins/ScriptCraft?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

ScriptCraft is a Minecraft Server plugin that lets operators, administrators, and plug-in authors customize the game using JavaScript. It provides a modern, high-performance scripting environment built directly into the server.

Originally created to make it easier for younger programmers to create their own Minecraft Mods, ScriptCraft has evolved into a robust platform capable of supporting complex, modern JavaScript applications.

Anything you can do using the Spigot APIs in Java, you can do using ScriptCraft in JavaScript.

# Modern ScriptCraft Features

The latest version of ScriptCraft brings significant modernization to the platform:

* **Java 17 & GraalVM 23+**: High-performance execution with native support for the latest ECMAScript features (ES2023+).
* **Native Module Support**: Use standard `require()` (CommonJS) and `import/export` (ES Modules) natively via GraalVM. No custom wrappers are needed.
* **Global `fetch` API**: Make asynchronous HTTP requests easily using the standard `fetch()` syntax (backed by Java 11's `HttpClient`).
* **Modern I/O**: Access standard globals like `console` (with object inspection), `process`, `setTimeout`, and a complete `fs` module (including `fs.promises` for `async/await` file operations).
* **Modernized Events**: High-performance event multiplexing, `once()` support, and browser-standard `addEventListener()` aliases.
* **`EventEmitter` Support**: Native-feeling `EventEmitter` class for custom inter-plugin communication.
* **Strict JSON-Based Plugins**: A structured, modular plugin architecture using `plugin.json` manifests.
* **Native Bukkit Commands**: Commands declared in `plugin.json` are automatically registered as native, top-level Minecraft commands (e.g., `/mycmd`) with full support for native Tab Completion.
* **TypeScript & Autocompletion**: Full type definitions are included in `scriptcraft/typings/`. A reflection-based Type Generator (`src/tools/js/run-type-gen.js`) is provided to automatically generate types directly from the Bukkit server jar for perfect IntelliSense.

# JSON-Based Plugin Architecture (Strict Mode)

ScriptCraft **strictly enforces** a structured, modular plugin architecture. Standalone `.js` files dropped into the `plugins/` folder are not supported. 

Every plugin must be housed in its own folder and contain a `plugin.json` file for metadata and configuration.

### Example: A Modern Plugin

**`scriptcraft/plugins/my-plugin/plugin.json`**
```json
{
    "name": "super-tools",
    "version": "1.0.0",
    "main": "index.js",
    "config": {
        "welcomeMessage": "Welcome to the modernized server!"
    },
    "commands": {
        "spawn": {
            "aliases": ["hub", "home"],
            "description": "Teleports you to the main hub",
            "tabComplete": ["world", "nether", "end"]
        }
    }
}
```

**`scriptcraft/plugins/my-plugin/index.js`**
```javascript
// registerPlugin is globally available
registerPlugin({
    // Lifecycle hooks
    onEnable() {
        console.info('Super Tools enabled! Config message:', this.config.welcomeMessage);
    },
    
    // Command handling
    commands: {
        // The aliases and tab completion defined in plugin.json are automatically registered natively!
        spawn(args, player) {
            echo(player, "Teleporting...");
            // ... teleport logic here ...
        },
        
        // You can also provide dynamic tab completion directly in the code
        heal: {
            callback(args, player) {
                player.setHealth(20);
                echo(player, "Healed!");
            },
            tabComplete(args, player) {
                // Return dynamic suggestions (e.g., list of online players)
                return server.getOnlinePlayers().map(p => p.name);
            }
        }
    },
    
    // Event handling
    events: {
        playerJoin(event) {
            echo(event.player, this.config.welcomeMessage);
        }
    }
});
```

# Prerequisites

ScriptCraft is a Minecraft Server Mod which works with Minecraft for Personal computers (Windows, Mac, and Linux). 

You **must** have **Java version 17 or later** installed. Check your version by typing `java -version` at a command prompt.

# Installation

ScriptCraft works with the **SpigotMC** server software.

1. Download and build the latest Spigot server (1.20+) using [BuildTools](https://www.spigotmc.org/wiki/buildtools/).
2. Run your server once to generate the necessary folders, accept the EULA in `eula.txt`, and start it again.
3. Download the `scriptcraft.jar` plugin and place it in your server's `plugins/` directory.
4. Restart the server. ScriptCraft will automatically generate a `scriptcraft/` directory in your server root containing the standard library, modules, and an `example-plugin`.

# Getting Started & Development

Once installed, navigate to the `scriptcraft/plugins/` directory. 
* To create a new mod, create a new folder and add a `plugin.json` and `index.js` file.
* Use `console.log()` to debug; it outputs directly to the server console with color support.
* If you use VS Code or another modern editor, open the `scriptcraft/` folder directly. The included `typings/` folder will automatically provide full type checking and autocompletion for the Bukkit API, `fs`, `fetch`, and ScriptCraft globals.

### Generating Updated Types
If you upgrade your Spigot server version, you can regenerate the TypeScript definitions to get the latest methods and classes:
From within the game or server console, use the legacy evaluate command to run the generator:
`/js require('../../tools/js/run-type-gen.js')`

# Built-in APIs

### `fetch`
Make async requests easily:
```javascript
const response = await fetch('https://api.example.com/data');
const data = await response.json();
console.log(data);
```

### `fs.promises`
Read and write files asynchronously without blocking the server:
```javascript
const content = await fs.promises.readFile('my-file.txt', 'UTF-8');
await fs.promises.writeFile('out.txt', 'Hello World');
```

# Additional information

Because the SpigotMC API is open, all of the SpigotMC API is accessible via javascript. There are a couple of useful Java objects exposed globally:

 * `__plugin__` – the ScriptCraft Java Plugin instance.
 * `server` – The top-level org.bukkit.Server object.
 * `self` – The player or console operator who invoked the current command.

# Docker 

To launch a container with SpigotMC and ScriptCraft you can just do 

      docker run -p 25565:25565 -it tclavier/scriptcraft

You can find all files used to build this container in the github project: [docker-scriptcraft](https://github.com/tclavier/docker-scriptcraft)
