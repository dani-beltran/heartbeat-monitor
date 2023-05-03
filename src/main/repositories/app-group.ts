import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

type AppGroup = {
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

  async register(item: AppGroupRegisterParams): Promise<AppGroup> {
      const updatedAt = new Date();
      const res = await this.collection.findOneAndUpdate({ id: item.id }, {
          $set: { ...item, updatedAt },
          $setOnInsert: { createdAt: new Date() }
      }, { upsert: true, returnDocument: 'after' });
      return { ...res.value, _id: undefined } as AppGroup;
  }
}
