/**
 * Example Modern Plugin
 */

registerPlugin({
    onEnable() {
        console.info('Example plugin enabled! Config message: ' + this.config.welcomeMessage);
    },
    
    commands: {
        greet(args, player) {
            echo(player, this.config.welcomeMessage);
        }
    },
    
    events: {
        playerJoin(event) {
            echo(event.player, this.config.welcomeMessage);
        }
    }
});
