import { Application } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { AppGroupRepo } from './repositories/app-group.js';
import { HeartbeatMonitorRouter } from './routes/heartbeat-monitor.js';
import { StorageService } from './services/storage-service.js';

export class App extends Application {
    @dep() mongodb!: MongoDb;
    @dep() appGroup!: AppGroupRepo;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(StorageService);
        mesh.service(MongoDb);
        mesh.service(AppGroupRepo);
        return mesh;
    }

    override createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        mesh.service(HeartbeatMonitorRouter);
        return mesh;
    }

    override async beforeStart() {
        await this.mongodb.start();
        // Add other code to execute on application startup
        await this.httpServer.startServer();
    }

    override async afterStop() {
        await this.httpServer.stopServer();
        // Add other finalization code
        this.mongodb.stop();
    }

}
