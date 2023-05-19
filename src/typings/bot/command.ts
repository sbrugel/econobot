import { ApplicationCommandOptionData, ChatInputCommandInteraction, InteractionResponse } from "discord.js";

export abstract class Command {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];

    abstract run?(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void>;
}