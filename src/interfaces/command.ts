import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";

export abstract class Command {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];

    abstract run?(interaction: CommandInteraction): Promise<void>;
}