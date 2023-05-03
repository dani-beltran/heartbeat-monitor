#!/usr/bin/env node
import { MongoClient } from 'mongodb';
import * as cron from 'node-cron';

console.info('Running DB cleaning task every five minutes');
cron.schedule('*/5 * * * *', () => {
    console.info(`[${new Date().toDateString()}]: Running task`);
    task().catch(error => {
        console.error(error);
        process.exit(1);
    });
});

async function task() {
    const client = new MongoClient(process.env.MONGO_URL!);
    try {
        await client.connect();
        const db = client.db();
        const timeout = Number(process.env.HEARTBEAT_TIMEOUT) || 60000;
        const res = await db.collection('app_groups').deleteMany({
            updatedAt: { $lt: new Date(Date.now() - timeout) },
        });
        console.info(`Deleted ${res.deletedCount} app groups`);
    } finally {
        await client.close();
    }
}
