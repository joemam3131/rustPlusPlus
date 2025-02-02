/*
    Copyright (C) 2022 Alexander Emanuelsson (alexemanuelol)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    https://github.com/alexemanuelol/rustPlusPlus

*/

const Discord = require('discord.js');

const DiscordTools = require('../discordTools/discordTools.js');

module.exports = async (client, guild) => {
    const instance = client.getInstance(guild.id);

    let category = undefined;
    if (instance.channelId.category !== null) {
        category = DiscordTools.getCategoryById(guild.id, instance.channelId.category);
    }
    if (category === undefined) {
        category = await DiscordTools.addCategory(guild.id, 'rustPlusPlus');
        instance.channelId.category = category.id;
        client.setInstance(guild.id, instance);
    }

    const perms = [];
    const everyoneAllow = [];
    const everyoneDeny = [];
    const roleAllow = [];
    const roleDeny = [];
    if (instance.role !== null) {
        everyoneDeny.push(Discord.PermissionFlagsBits.ViewChannel);
        everyoneDeny.push(Discord.PermissionFlagsBits.SendMessages);
        roleAllow.push(Discord.PermissionFlagsBits.ViewChannel);
        roleDeny.push(Discord.PermissionFlagsBits.SendMessages);

        perms.push({ id: guild.roles.everyone.id, deny: everyoneDeny });
        perms.push({ id: instance.role, allow: roleAllow, deny: roleDeny });
    }
    else {
        everyoneAllow.push(Discord.PermissionFlagsBits.ViewChannel);
        everyoneDeny.push(Discord.PermissionFlagsBits.SendMessages);

        perms.push({ id: guild.roles.everyone.id, allow: everyoneAllow, deny: everyoneDeny });
    }

    try {
        await category.permissionOverwrites.set(perms);
    }
    catch (e) {
        /* Ignore */
    }

    return category;
};