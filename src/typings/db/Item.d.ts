enum ItemType {
    Item, // i.e. collectibles
    Message, // displays a custom message when /viewitems is run
    Role // contains property for name and color
}

export interface Item {
    id: number,
    name: string,
    type: ItemType, // TODO: enumerate
    cost: number
}