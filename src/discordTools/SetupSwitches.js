const DiscordTools = require('./discordTools.js');

module.exports = async (client, rustplus) => {
    let instance = client.readInstanceFile(rustplus.guildId);
    let server = `${rustplus.server}-${rustplus.port}`;

    client.switchesMessages[rustplus.guildId] = {};

    await DiscordTools.clearTextChannel(rustplus.guildId, instance.channelId.switches, 100);

    for (const [key, value] of Object.entries(instance.switches)) {
        if (server !== `${value.ipPort}`) continue;

        let info = await rustplus.getEntityInfoAsync(key);
        if (!(await rustplus.isResponseValid(info))) return;

        instance = client.readInstanceFile(rustplus.guildId);

        if (info.error) {
            delete instance.switches[key];
            client.writeInstanceFile(rustplus.guildId, instance);
            continue;
        }

        let active = info.entityInfo.payload.value;
        instance.switches[key].active = active;
        client.writeInstanceFile(rustplus.guildId, instance);

        DiscordTools.sendSmartSwitchMessage(rustplus.guildId, key);
    }
};
