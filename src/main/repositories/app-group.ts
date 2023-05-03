import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

export type AppGroup = {
    _id?: string;
    id: string;
    group: string;
    createdAt: Date;
    updatedAt: Date;
    meta?: Record<string, any>;
};

type AppGroupRegisterParams = Omit<AppGroup, 'createdAt' | 'updatedAt'>;

export class AppGroupRepo {
  @dep() private mongodb!: MongoDb;

  protected get collection() {
      return this.mongodb.db.collection('app_groups');
  }

  async list() {
      return this.collection.find().toArray();
  }

  async get(id: string) {
      return this.collection.findOne({ id });
  }

  /**
   * This method registers an app instance in a group.
   * If the app instance is already registered, it will be updated.
   * @returns The registered app instance.
   */
  async register(item: AppGroupRegisterParams): Promise<AppGroup> {
      const updatedAt = new Date();
      const res = await this.collection.findOneAndUpdate({ id: item.id }, {
          $set: { ...item, updatedAt },
          $setOnInsert: { createdAt: new Date() }
      }, { upsert: true, returnDocument: 'after' });
      return { ...res.value, _id: undefined } as AppGroup;
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
