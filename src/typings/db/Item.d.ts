export interface Item {
    id: number,
    name: string,
    type: ItemType,
    cost: number,
    stock: number, // -1 = unlimited
    owner: string // either "SERVER" or a user ID (SERVER = in the server store)
}