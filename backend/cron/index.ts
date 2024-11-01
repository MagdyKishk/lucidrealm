import cron from 'node-cron';
import { Email } from '../models';
import Logger from '../utils/logger';

cron.schedule('0 0 * * *', async () => {
    Logger.info('Running cron job to delete emails');
    const emails = await Email.deleteMany({ deletionDate: { $lte: new Date() } });
    Logger.info(`Deleted ${emails.deletedCount} emails`);
});