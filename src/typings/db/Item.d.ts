enum ItemType {
    Item, // i.e. collectibles
    Message, // displays a custom message when /viewitems is run
    Role // contains property for name and color
}

export interface Item {
    id: number,
    name: string,
    type: ItemType,
    cost: number,
    stock: number, // -1 = unlimited
    owner: string // either "SERVER" or a user ID (SERVER = in the server store)
}