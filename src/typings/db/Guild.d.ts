import { Item } from "./Item";
import { Stats } from "./Stats";
import { Store } from "./Store";
import { User } from "./User";

export interface Guild {
    guildId: string,
    currencyName: string,
    currencyIcon: string, // URL
    publicAwardAnnounce: boolean, // true = send coin award messages in chat; false = in DM
    users: User[],
    serverStore: Store,
    stats: Stats
}