function refresh(skipOpCheck : boolean) {
    // @ts-ignore
    __plugin__.getPluginLoader().disablePlugin(__plugin__);
    // @ts-ignore
    Bukkit.event.HandlerList.unregisterAll(__plugin__);
    // @ts-ignore
    Server.getScheduler().cancelTasks(__plugin__);
        // @ts-ignore
    __plugin__.getPluginLoader().enablePlugin(__plugin__);
}