import { Client } from "discord.js";
import { DB } from "../config";
import { Guild } from './../typings/db/Guild.d';

async function register(client: Client): Promise<void> {
    client.on('messageCreate', async (msg) => {
        const serverData: Guild = await msg.client.mongo.collection<Guild>(DB.COLLECTION).findOne({ guildId: msg.guildId });

        if (msg.author.bot || !serverData) return; // bots shouldn't get money; if server not set up, don't listen

        let thisUser = serverData.users.find(user => user.id === msg.author.id);

        if (!thisUser) { // message sender not in server's users list yet, so add them
            thisUser = {
                id: msg.author.id,
                balance: 0,
                possessions: [],
                selling: {
                    items: []
                }
            };
            await msg.client.mongo.collection<Guild>(DB.COLLECTION).updateOne(
                { guildId: msg.guildId }, 
                { $set: { users: [...serverData.users, thisUser] }}
            );
            await msg.client.mongo.collection<Guild>(DB.COLLECTION).updateOne(
                { guildId: msg.guildId }, 
                { $inc: { 'stats.uniqueUsers': 1 }}
            );
        }

        let coinsEarned = 0;
        let rng = getRandomNumber();
        
        // 10% chance to get 1 coin
        // 5% chance to get 5 coins
        // 1% chance to get 10 coins
        if (rng <= 1) {
            coinsEarned = 10;
        } else if (rng <= 5) {
            coinsEarned = 5;
        } else if (rng <= 100) {
            coinsEarned = 1;
        }

        if (coinsEarned > 0) {
            await msg.client.mongo.collection<Guild>(DB.COLLECTION).updateOne(
                { guildId: msg.guildId }, 
                { $inc: { 'stats.coinsGivenOut': 1 }}
            );
            
            const serverUsers = serverData.users;
            thisUser.balance++;

            await msg.client.mongo.collection<Guild>(DB.COLLECTION).updateOne(
                { guildId: msg.guildId }, 
                { $set: { users: serverUsers }}
            );

            let destination;
            if (serverData.publicAwardAnnounce) {
                destination = msg.channel;
            } else {
                destination = msg.author;
            }

            try {
                destination.send({ content: `Congratulations <@${msg.author.id}>, you have earned ${coinsEarned} ${serverData.currencyName}${coinsEarned == 1 ? '' : '(s)'}!` });
            } catch (error) {
                console.log(`[ERROR] Could not send award message for ${msg.author.tag} (they probably have DMs off): ${error}`);
            }
        }
    })
}

/**
 * Generates a random number to determine if the user gains coins from a message.
 * @returns A number from 1 to 100 inclusive
 */
function getRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
}

export default register;