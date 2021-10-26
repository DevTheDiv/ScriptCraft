// Globals: server



function bukkitSetTimeout(callback, delayInMillis, ...args) {
  var delay = Math.ceil(delayInMillis / 50);
  var TimerTask = Java.type('java.util.TimerTask');
  var TaskClass = Java.extend(TimerTask, {
      run: function(){
          callback(...args);
      }
  });
  var task = Server.getScheduler().runTaskLater(__plugin__, new TaskClass(), delay);
  return task;
}

function bukkitClearTimeout(task) {
  task.cancel();
}

function bukkitSetInterval(callback, intervalInMillis, ...args) {
  var delay = Math.ceil(intervalInMillis / 50);
  var TimerTask = Java.type('java.util.TimerTask');
  var TaskClass = Java.extend(TimerTask, {
      run: function(){
          callback(...args);
      }
  });
  var task = Server.getScheduler().runTaskTimer(__plugin__, new TaskClass(), delay, delay);
  return task;
}

function bukkitClearInterval(task) {
  task.cancel();
}

setTimeout    = bukkitSetTimeout;
clearTimeout  = bukkitClearTimeout;
setInterval   = bukkitSetInterval;
clearInterval = bukkitClearInterval;
