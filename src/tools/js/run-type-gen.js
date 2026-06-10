'use strict';

/**
 * Runner for the Type Generator.
 * This can be run via jscript.java or within ScriptCraft.
 */

var TypeGenerator = require('./type-generator-core.js');
var File = java.io.File;
var FileUtils = org.apache.commons.io.FileUtils;

var generator = new TypeGenerator();

var coreClasses = [
    'org.bukkit.Server',
    'org.bukkit.World',
    'org.bukkit.entity.Player',
    'org.bukkit.block.Block',
    'org.bukkit.inventory.ItemStack',
    'org.bukkit.Location',
    'org.bukkit.entity.Entity',
    'org.bukkit.command.CommandSender',
    'org.bukkit.command.Command'
];

var types = generator.run(coreClasses);

var outputFile = new File('src/main/resources/scriptcraft/typings/bukkit-generated.d.ts');
FileUtils.writeStringToFile(outputFile, types, 'UTF-8');

console.log('Types generated to: ' + outputFile.getAbsolutePath());
