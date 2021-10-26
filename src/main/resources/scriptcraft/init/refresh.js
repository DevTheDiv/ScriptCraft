// globals global.self


function refresh(skipOpCheck) {
  var op = global.self.isOp();
  if (!skipOpCheck && typeof self !== undefined) {
    if (!op) return echo('Only operators can refresh()');
  }
  CurrentPlugin.getPluginLoader().disablePlugin(CurrentPlugin);
  Bukkit.event.HandlerList.unregisterAll(CurrentPlugin);
  Server.getScheduler().cancelTasks(CurrentPlugin);
  CurrentPlugin.getPluginLoader().enablePlugin(CurrentPlugin);
}
