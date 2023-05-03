import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { StorageService } from '../services/storage-service.js';

export type AppInstance = {
    _id?: string;
    id: string;
    group: string;
    createdAt: Date;
    updatedAt: Date;
    meta?: Record<string, any>;
};

type Group = {
    group: string;
    instances: number;
    createdAt: Date;
    updatedAt: Date;
};

export class AppGroupRepo {
  @dep() private mongodb!: MongoDb;
  @dep() private storage!: StorageService;

  protected get collection() {
      return this.mongodb.db.collection('app_groups');
  }

  /**
   * @param limit The maximum number of app groups to return.
   * @returns an array of app groups with the number of active apps instances in each group.
   * With active apps we mean the apps that have sent a heartbeat recently.
   * The array is sorted by the number of apps in descending order.
   */
  async list(limit = 100): Promise<Group[]> {
      const beforeTimeout = new Date(Date.now() - this.storage.HEARTBEAT_TIMEOUT);
      const res = await this.collection
          .aggregate([
              { $match: { updatedAt: { $gt: beforeTimeout } } },
              {
                  $group: {
                      _id: '$group',
                      count: { $sum: 1 },
                      createdAt: { $min: '$createdAt' },
                      updatedAt: { $max: '$updatedAt' },
                  },
              },
              { $match: { count: { $gt: 0 } } },
              { $sort: { count: -1 } },
              { $limit: limit },
              {
                  $project: {
                      _id: 0,
                      group: '$_id',
                      instances: '$count',
                      createdAt: 1,
                      updatedAt: 1,
                  },
              },
          ])
          .toArray();
      return res as Group[];
  }

  /**
   * @param group the group name
   * @returns an array of active app instances within the group sorted by the last heartbeat.
   *  With active apps we mean the apps that have sent a heartbeat recently.
   */
  async get(group: string, limit = 100) {
      const res = await this.collection
          .find({
              group,
              updatedAt: {
                  $gt: new Date(Date.now() - this.storage.HEARTBEAT_TIMEOUT),
              },
          })
          .sort('updatedAt', -1)
          .project({ _id: 0 })
          .limit(limit)
          .toArray();
      return res as AppInstance[];
  }

  /**
   * This method registers an app instance in a group.
   * If the app instance is already registered, it will be updated.
   * @returns The registered app instance.
   */
  async register(
    item: Omit<AppInstance, 'createdAt' | 'updatedAt'>
  ): Promise<AppInstance> {
      const updatedAt = new Date();
      const res = await this.collection.findOneAndUpdate(
          { id: item.id },
          {
              $set: { ...item, updatedAt },
              $setOnInsert: { createdAt: new Date() },
          },
          {
              upsert: true,
              returnDocument: 'after',
              projection: { _id: 0 },
          }
      );
      return (<unknown>res.value) as AppInstance;
  }

  /**
   * This method unregisters an app instance from a group.
   * If the app is not registered, nothing happens.
   */
  async unregister(id: string, group: string) {
      const res = await this.collection.findOneAndDelete({ id, group });
      return res.value;
  }
}
