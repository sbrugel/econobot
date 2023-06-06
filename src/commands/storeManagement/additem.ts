import { Command } from "../../typings/bot/command";
import { ApplicationCommandOptionData, ApplicationCommandOptionType, ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { DB } from '../../config';
import { Guild } from "../../typings/db/Guild";
import { Item } from "../../typings/db/Item";
import { ItemType } from "../../typings/db/ItemType";

export default class extends Command {
    name = 'additem';
    description = 'Add a new, unique item to the store.';
    options: ApplicationCommandOptionData[] = [
        {
            name: 'name',
            description: 'The desired name',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'type', // collectible, message, role
            description: 'The type of item',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Collectible', value: 'Collectible' },
                { name: 'Message', value: 'Message' },
                { name: 'Role', value: 'Role' },
            ]
        },
        {
            name: 'cost', // collectible, message, role
            description: 'The cost of the item',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ]

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const serverData: Guild = await interaction.client.mongo.collection<Guild>(DB.COLLECTION).findOne({ guildId: interaction.guildId });
        const name = interaction.options.getString('name');
        const type = interaction.options.getString('type');
        const cost = interaction.options.getNumber('cost');

        // check name uniqueness, and only can have one Message item type in the store
        if (cost <= 0) {
            return interaction.reply({ content: `Cost must be at least 1!`, ephemeral: true });
        }

        for (const item of serverData.serverStore.items) {
            if (item.name === name) {
                return interaction.reply({ content: `An item with the name already exists!`, ephemeral: true });
            }
        }

        if (serverData.serverStore.items.filter(i => i.type === ItemType.Message).length !== 0 && type === ItemType.Message) {
            return interaction.reply({ content: `There can only be one Message item in the store!`, ephemeral: true });
        }

        // add the item to the store
        const newItem: Item = {
            id: serverData.serverStore.items.length,
            name,
            type,
            cost,
            stock: -1, // -1 = unlimited, any other = finite
            owner: 'SERVER'
        }

        await interaction.client.mongo.collection<Guild>(DB.COLLECTION).updateOne(
            { guildId: interaction.guildId }, 
            { $set: { 'serverStore.items': [...serverData.serverStore.items, newItem] }}
        );

        interaction.reply(`Item ${newItem.name} has been added to the server store!`);
    }
}