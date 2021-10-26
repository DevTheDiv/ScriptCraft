
interface _bukkit_byte extends any {

}



// Java.type("org.bukkit.command.Command");
interface Command {
    new (name: string) : T;
    new (name: string, description: string, usageMessage: string, aliases:Array<String>) : T;
    getAliases(): Array<string>;
    getDescription(): string;
    getLabel(): string;
    getName(): string;
    getPermission(): string;
    getPermissionMessage(): string;
    getUsage(): string;
    isRegistered(): boolean;
    register(commandMap : CommandMap ): boolean;
    setAlias(aliases: Array<string>): Command;
    setDescription(description: String): Command;
    setLabel(name: string): boolean;
    setName(name: string): boolean;
    setPermission(permission: string): void;
    setPermissionMessage​(permissionMessag: string) : Command;
    setUsage(usage: string) : Command;
    tabComplete(sender: CommandSender, alias: string, args : Array<string>) : Array<string>;
    tabComplete(sender: CommandSender, alias: string, args : Array<string>, location : Location) : Array<string>;
    testPermission(target: CommandSender) : boolean;
    testPermissionSilent(target: CommandSender) : boolean;
    unregister(commandMap: CommandMap) : boolean;
}




interface CommandSender {
    getName() : void,
    getServer() : any,
    sendMessage(message: string) : void,
    sendMessage(messages: string[]) : void,
    sendMessage(uuid: any | null, message: string) : void,
    sendMessage(uuid: any | null, message: string[]) : void,

}  

//https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/plugin/messaging/PluginMessageRecipient.html#sendPluginMessage(org.bukkit.plugin.Plugin,java.lang.String,byte%5B%5D)
interface PluginMessageRecipient {
    getListeningPluginChannels(): string,
    sendPluginMessage​(source : Plugin, channel : string, message: _bukkit_byte[]) : void
}

interface Recipe {
    getResult() : ItemStack
}

//https://hub.spigotmc.org/javadocs/bukkit/org/bukkit/Server.html
interface Server extends PuginMessageRecipient {
}
