import { Command } from "../../typings/bot/command";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, InteractionResponse } from 'discord.js';
import { ApplicationCommandOptionData } from 'discord.js';
import { Guild } from "../../typings/db/Guild";
import { DB } from "../../config";
import { User } from "../../typings/db/User";

export default class extends Command {
    name = 'userinfo';
    description = 'See information for a user.';
    options: ApplicationCommandOptionData[] = [
        {
            name: 'user',
            description: 'Whose information to show',
            type: ApplicationCommandOptionType.User,
            required: false
        },
    ]

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const targetUser = interaction.options.getUser('user') || interaction.user; // default to sending user
        const serverData: Guild = await interaction.client.mongo.collection<Guild>(DB.COLLECTION).findOne({ guildId: interaction.guildId });

        const userInDB: User = serverData.users.find(user => user.id === targetUser.id);

        if (!userInDB) return interaction.reply({ content: `This user doesn't have any data yet!`, ephemeral: true });
        console.log(targetUser.avatarURL());

        const displayEmbed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle(`Stats for ${targetUser.tag}`)
            .setThumbnail(targetUser.avatarURL())
            .addFields(
                { name: 'Balance', value: userInDB.balance.toString() },
                { name: 'Possessions', value: userInDB.possessions.length === 0 ? 'None' : 'TODO' },
                { name: 'Selling', value: userInDB.possessions.length === 0 ? 'None' : 'TODO' },
            )

        return interaction.reply({ embeds: [displayEmbed], ephemeral: true });
    }
}