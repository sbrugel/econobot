import { Item } from "./Item";
import { User } from "./User";

export interface Guild {
    guildId: string,
    currencyName: string,
    currencyIcon: string, // URL
    publicAwardAnnounce: boolean, // true = send coin award messages in chat; false = in DM
    users: User[],
    items: Item[]
}