import { ApplicationCommandOptionData, CommandInteraction, InteractionResponse } from "discord.js";

export abstract class Command {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];

    abstract run?(interaction: CommandInteraction): Promise<InteractionResponse<boolean> | void>;
}