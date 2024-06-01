import dotenv from "dotenv";

dotenv.config();

import Redis from "ioredis";

const subscriber = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: {},
});


const publisher = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: {},
});

export function subscribe(channel, callback) {
    subscriber.subscribe(channel, (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(
                `Subscribed to channel ${channel} channels.`
            );
        }
    });
    subscriber.on("message", (subscribedChannel, message) => {
        console.log('Subscriber ', subscribedChannel, ' has received msg ', message);
        if (subscribedChannel === channel) {
            callback(message);
        }

    });

}

export async function unSubscribe(channel) {
    subscriber.unsubscribe(channel, (err, count) => {
        if (err) {
            console.error('Error unsubscribing from channel:', err);
            return;
        }
        console.log(`Unsubscribed from ${channel}`);
    });
}

export async function publish(channel, message) {
    try {
        await publisher.publish(channel, message);
        console.log(`Published message to ${channel}: ${message}`);
    } catch (error) {
        console.log(error.message);
    }
}

