const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    description: "Displays all commands that the bot has.",
    category: "Info",
    usage: "+ <commamnd_name>",
    aliases: ["h"],
    run: async (client, message, args, language, prefix) => {

        if (args[0]) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${message.guild.members.me.displayName} Help Command!`, iconURL: message.guild.iconURL({ dynamic: true })})
                .setDescription(`The bot prefix is: \`${prefix} or /\``)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setColor(client.color)

            let command = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if(!command) return message.channel.send({ embeds: [embed.setTitle("Invalid Command.").setDescription(`Do \`${prefix}help\` for the list of the commands.`)] })

            embed.setDescription(stripIndents`The client's prefix is: \`${prefix}\`\n
            **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
            **Description:** ${command.description || "No Description provided."}
            **Usage:** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}
            **Accessible by:** ${command.accessableby || "Members"}
            **Aliases:** ${command.aliases && command.aliases.length !== 0 ? command.aliases.join(", ") : "None."}`)

            return message.channel.send({ embeds: [embed] })
        }
        
        const category = readdirSync("./src/commands/prefix")

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${message.guild.members.me.displayName} Help Command! [PREFIX]`, iconURL: message.guild.iconURL({ dynamic: true })})
            .setDescription(`The bot prefix is: \`${prefix} or /\``)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setColor(client.color)
            .setFooter({ text: `© ${message.guild.members.me.displayName} | Total Commands: ${client.commands.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})


        category.forEach(category => {
            const dir = client.commands.filter(c => c.category === category)
            const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
            try {
                embed.addFields({ name: `❯ ${capitalise} [${dir.size}]`, value: " " })
            } catch(e) {
                console.log(e)
            }
        })

        const row = new ActionRowBuilder()
            .addComponents([
                new StringSelectMenuBuilder()
                    .setCustomId("help-category")
                    .setPlaceholder(`${client.i18n.get(language, "utilities", "help_desc")}`)
                    .setMaxValues(1)
                    .setMinValues(1)
                    /// Map the category to the select menu
                    .setOptions(category.map(category => {
                        return new StringSelectMenuOptionBuilder()
                            .setLabel(category)
                            .setValue(category)
                        }
                    ))
                ])

            message.reply({ embeds: [embed], components: [row] }).then(async (msg) => {
                let filter = (i) => (i.isStringSelectMenu()) && i.user && i.message.author.id == client.user.id;
                let collector = await msg.createMessageComponentCollector({ 
                    filter,
                    time: 60000 
                });
                collector.on('collect', async (m) => {
                    if(m.isStringSelectMenu()) {
                        if(m.customId === "help-category") {
                            await m.deferUpdate();
                            let [directory] = m.values;

                            const cmd = client.commands.filter(c => c.name === "music")

                            const embed = new EmbedBuilder()
                                .setAuthor({ name: `${message.guild.members.me.displayName} Help Command! [PREFIX]`, iconURL: message.guild.iconURL({ dynamic: true })})
                                .setDescription(`The bot prefix is: \`${prefix} or /\``)
                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                .setColor(client.color)
                                .addFields({ name: `❯  ${directory.toUpperCase()} [${client.commands.filter(c => c.category === directory).size}]`, value: `${client.commands.filter(c => c.category === directory).map(c => `\`${c.name}\``).join(", ")}`, inline: false })
                                .setFooter({ text: `© ${message.guild.members.me.displayName} | Total Commands: ${client.commands.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

                            msg.edit({ embeds: [embed] });
                    }
                }
            });

            collector.on('end', async (collected, reason) => {
                if(reason === 'time') {
                    const timed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "utilities", "help_timeout", {
                        prefix: prefix
                    })}`)
                    .setColor(client.color)

                    msg.edit({ embeds: [timed], components: [] });
                }
            });
        })
    }
}