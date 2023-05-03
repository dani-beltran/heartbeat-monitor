import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

type AppGroup = {
    id: string;
    group: string;
    createdAt: Date;
    updatedAt: Date;
    meta?: Record<string, any>;
};

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

  async create(item: AppGroup) {
      return this.collection.insertOne(item);
  }
}
