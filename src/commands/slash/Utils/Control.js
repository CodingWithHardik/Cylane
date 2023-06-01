const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const GControl = require('../../../schemas/control.js');
module.exports = { 
  name: ["settings", "control"],
  description: "Enable or disable the player control",
  category: "Utils",
  options: [
      {
          name: "type",
          description: "Choose enable or disable",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
              {
                  name: "Enable",
                  value: "enable"
              },
              {
                  name: "Disable",
                  value: "disable"
              }
          ]
      }
  ],
run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
            const Control = await GControl.findOne({ guild: interaction.guild.id });
            if(interaction.options.getString('type') === "enable") {
                if(!Control) {
                    const Control = new GControl({
                        guild: interaction.guild.id,
                        playerControl: "enable"
                    });
                    Control.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "utilities", "control_set", {
                            toggle: "enable"
                        })}`)
                        .setColor(client.color)
    
                        interaction.editReply({ embeds: [embed] });
                    }
                    ).catch((err) => {
                        interaction.editReply(`${client.i18n.get(language, "utilities", "control_err")}`)
                        console.log(err)
                    });
                }
                else if(Control) {
                    Control.playerControl = "enable";
                    Control.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "utilities", "control_change", {
                            toggle: "enable"
                        })}`)
                        .setColor(client.color)
            
                        interaction.editReply({ embeds: [embed] });
                    }
                    ).catch((err) => {
                        interaction.editReply(`${client.i18n.get(language, "utilities", "control_err")}`);
                        console.log(err)
                    });
                }
            }
            else if(interaction.options.getString('type') === "disable") {
                if(!Control) {
                    const Control = new GControl({
                        guild: interaction.guild.id,
                        playerControl: "disable"
                    });
                    Control.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "utilities", "control_set", {
                            toggle: "disable"
                        })}`)
                        .setColor(client.color)
    
                        interaction.editReply({ embeds: [embed] });
                    }
                    ).catch((err) => {
                        interaction.editReply(`${client.i18n.get(language, "utilities", "control_err")}`)
                        console.log(err)
                    });
                }
                else if(Control) {
                    Control.playerControl = "disable"
                    Control.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "utilities", "control_change", {
                            toggle: "disable"
                        })}`)
                        .setColor(client.color)
            
                        interaction.editReply({ embeds: [embed] });
                    }
                    ).catch((err) => {
                        interaction.editReply(`${client.i18n.get(language, "utilities", "control_err")}`);
                        console.log(err)
                    });
                }
            }
    }
};