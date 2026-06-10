/**
 * ScriptCraft Type Definitions
 */

/// <reference path="./bukkit.d.ts" />
/// <reference path="./bukkit-generated.d.ts" />

declare interface ScriptCraftEvents {
    /**
     * Registers an event listener.
     */
    on(eventType: any, handler: (event: any, cancel: () => void) => void, priority?: string): { unregister: () => void };

    /**
     * Alias for on() to match browser standards.
     */
    addEventListener(eventType: any, handler: (event: any, cancel: () => void) => void, priority?: string): { unregister: () => void };

    /**
     * Registers a one-time event listener.
     */
    once(eventType: any, handler: (event: any, cancel: () => void) => void, priority?: string): { unregister: () => void };

    /**
     * Removes an event listener.
     */
    off(eventType: any, handler: Function, priority?: string): void;

    /**
     * Alias for off() to match browser standards.
     */
    removeEventListener(eventType: any, handler: Function, priority?: string): void;

    [eventName: string]: (handler: (event: any, cancel: () => void) => void, priority?: string) => { unregister: () => void };
}

declare class EventEmitter {
    on(type: string, listener: Function): this;
    once(type: string, listener: Function): this;
    off(type: string, listener: Function): this;
    removeListener(type: string, listener: Function): this;
    emit(type: string, ...args: any[]): boolean;
}

declare interface ScriptCraftCommands {
    /**
     * Defines a new command.
     */
    (name: string | Function, func?: Function, options?: string[], intercepts?: boolean): Function;
}

declare function echo(player: any, message: string): void;

declare interface FetchResponse {
    ok: boolean;
    status: number;
    statusText: string;
    headers: { get(name: string): string | null };
    text(): Promise<string>;
    json(): Promise<any>;
}

declare function fetch(url: string, options?: {
    method?: string,
    headers?: { [key: string]: string },
    body?: string
}): Promise<FetchResponse>;

declare interface ScriptCraftPlugin {
    store: any;
    storage: {
        get(key: string): any;
        set(key: string, value: any): void;
        all(): any;
    };
}

declare interface ScriptCraftProcess {
    env: { [key: string]: string };
    platform: 'win32' | 'linux';
    version: string;
    arch: string;
    cwd(): string;
    nextTick(callback: Function): void;
}

declare interface ScriptCraftConsole {
    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
}

declare interface ScriptCraftFS {
    readFileSync(path: string, options?: string | { encoding?: string }): string | any;
    writeFileSync(path: string, data: string | any, options?: any): void;
    appendFileSync(path: string, data: string | any): void;
    existsSync(path: string): boolean;
    mkdirSync(path: string, options?: { recursive?: boolean }): void;
    readdirSync(path: string): string[];
    unlinkSync(path: string): void;
    statSync(path: string): {
        isFile(): boolean;
        isDirectory(): boolean;
        size: number;
        mtime: Date;
    };
    promises: {
        readFile(path: string, options?: string | { encoding?: string }): Promise<string | any>;
        writeFile(path: string, data: string | any, options?: any): Promise<void>;
        readdir(path: string): Promise<string[]>;
        mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
        unlink(path: string): Promise<void>;
        stat(path: string): Promise<{
            isFile(): boolean;
            isDirectory(): boolean;
            size: number;
            mtime: Date;
        }>;
    };
}

declare const process: ScriptCraftProcess;
declare const console: ScriptCraftConsole;
declare const fs: ScriptCraftFS;
declare const events: ScriptCraftEvents;
declare const hooks: ScriptCraftHooks;

declare const global: any;
declare const self: any;

declare function setTimeout(callback: Function, delay: number, ...args: any[]): any;
declare function clearTimeout(task: any): void;
declare function setInterval(callback: Function, interval: number, ...args: any[]): any;
declare function clearInterval(task: any): void;
declare function setImmediate(callback: Function, ...args: any[]): any;
declare function alert(message: string): void;

declare interface PluginDefinition {
    onEnable?: (this: ScriptCraftPlugin) => void;
    onDisable?: (this: ScriptCraftPlugin) => void;
    commands?: { 
        [name: string]: ((this: ScriptCraftPlugin, args: string[], player: any) => void) | {
            callback: (this: ScriptCraftPlugin, args: string[], player: any) => void;
            aliases?: string[];
            description?: string;
            tabComplete?: string[] | ((this: ScriptCraftPlugin, args: string[], player: any) => string[]);
        }
    };
    events?: { [name: string]: (this: ScriptCraftPlugin, event: any) => void };
}

declare function plugin(name: string, moduleObject: any, isPersistent?: boolean): ScriptCraftPlugin;

declare function registerPlugin(name: string, definition: PluginDefinition): ScriptCraftPlugin;

declare interface ScriptCraftHooks {
    add(hookName: string, callback: Function): void;
    trigger(hookName: string, ...args: any[]): void;
}

declare const hooks: ScriptCraftHooks;
