import { Command } from "../../typings/bot/command";
import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { DB } from '../../config';

export default class extends Command {
    name = 'delete';
    description = 'Deletes this server from the database, effectively wiping its data.';

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        await interaction.client.mongo.collection(DB.COLLECTION).deleteOne({ guildId: interaction.guildId });
        return interaction.reply(`Done! Use /init to set up the server again.`);
    }
}