import { Command } from "../../typings/bot/command";
import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { DB } from '../../config';
import { Guild } from "../../typings/db/Guild";

export default class extends Command {
    name = 'togglepublicawards';
    description = 'Set if currency awards are posted publicly. (If not, get sent in DM)';

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const serverData: Guild = await interaction.client.mongo.collection<Guild>(DB.COLLECTION).findOne({ guildId: interaction.guildId });
        const prevState = serverData.publicAwardAnnounce;
        await interaction.client.mongo.collection<Guild>(DB.COLLECTION).updateOne({ guildId: interaction.guildId }, { $set: { publicAwardAnnounce: !prevState }});
        return interaction.reply({ content: `Currency awards for \`${interaction.guild.name}\` will now be sent in ${prevState ? 'DMs (if possible)' : 'this server'}.` });
    }
}