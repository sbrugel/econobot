import { Item } from "./Item";
import { Store } from "./Store";

export interface User {
    balance: number,
    possessions: Item[], // array of possession IDs; all items this user has
    selling: Store // any items the user is selling
}