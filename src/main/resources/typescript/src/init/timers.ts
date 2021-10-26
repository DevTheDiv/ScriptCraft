"use strict";
var global : any = this;
(() => {
    //@ts-ignore
    const Bukkit = Packages.org.bukkit;
    const Server = Bukkit.Bukkit.getServer();
    
    type Callback = (ags: any) => void;

    const bukkitSetTimeout = function(callback: Callback, delayInMillis : number, ...args : any ) {    
      let delay : number = Math.ceil(delayInMillis / 50);

      //@ts-ignore
      let TimerTask : any = Java.type('java.util.TimerTask');
      //@ts-ignore
      let TaskClass = Java.extend(TimerTask, {
          run: function(){
            callback(args);
          }
      });
      //@ts-ignore
      let task : any  = Server.getScheduler().runTaskLater(__plugin__, new TaskClass(), delay);
      return task;
    };
    
    const bukkitClearTimeout = function(task : any) {
      task.cancel();
    };
    
    const bukkitSetInterval = function(callback: Callback, intervalInMillis: number, ...args : any[]) {
      let delay : number = Math.ceil(intervalInMillis / 50);
  
      //@ts-ignore
      let TimerTask = Java.type('java.util.TimerTask');
      //@ts-ignore
      let TaskClass = Java.extend(TimerTask, {
        run: function(){
          callback(args);
        }
      });
      //@ts-ignore
      let task = Server.getScheduler().runTaskTimer(__plugin__, new TaskClass(), delay, delay);
      return task;
    };
    
    const bukkitClearInterval = function(task : any) {
      task.cancel();
    };  

    global.setInterval = bukkitSetInterval;
    global.clearInterval = bukkitClearInterval;
    global.setTimeout = bukkitSetTimeout;
    global.clearTimeout = bukkitClearTimeout;
})();
  