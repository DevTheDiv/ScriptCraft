# lib directory

This directory contains core scriptcraft files and modules. 

 * plugin.js - A module which provides support for persistent plugins (plugins which need to save state)
 * events.js - Event handling module for use by plugin/module developers.
 * hooks.js - Custom hook system for plugin lifecycle and inter-plugin communication.
 * modern-plugin.js - Modern API for registering plugins (`registerPlugin`).

When `require('modulename')` is called, GraalVM handles module resolution natively.

[njsmod]: http://nodejs.org/api/modules.html
