import { Command } from "../../typings/bot/command";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { DB } from '../../config';
import { Guild } from "../../typings/db/Guild";
import { ApplicationCommandOptionData } from 'discord.js';

export default class extends Command {
    name = 'setimage';
    description = 'Set the image of the server currency.';
    options: ApplicationCommandOptionData[] = [
        {
            name: 'image',
            description: 'The desired image attachment',
            type: ApplicationCommandOptionType.Attachment,
        },
        {
            name: 'url',
            description: 'The desired image URL',
            type: ApplicationCommandOptionType.String,
        }
    ]

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const newImage = interaction.options.getAttachment('image');
        const newUrl = interaction.options.getString('url');

        const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

        let imgUrl: string; // works for both attachment and url

        if (!newImage && !newUrl) {
            return interaction.reply({ content: `You must supply an image attachment or a URL!`, ephemeral: true });
        } else if (newImage && newUrl) {
            return interaction.reply({ content: `Please supply either just an image or a URL!`, ephemeral: true });
        }

        // now we can assume we have *either* a URL or an image
        if (newImage && !VALID_IMAGE_TYPES.includes(newImage.contentType)) {
            return interaction.reply({ content: `Invalid image type supplied! Acceptable types are ${VALID_IMAGE_TYPES.join(', ')}`, ephemeral: true });
        }
        imgUrl = newImage ? newImage.proxyURL : newUrl;
        await interaction.client.mongo.collection<Guild>(DB.COLLECTION).updateOne({ guildId: interaction.guildId }, { $set: { currencyIcon: imgUrl }});

        return interaction.reply({ content: `\`${interaction.guild.name}\`'s currency image has been changed.` });
    }
}