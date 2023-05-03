import { Application } from '@ubio/framework';

import { HeartbeatMonitorRouter } from './routes/heartbeat-monitor.js';
import { StorageService } from './services/storage-service.js';

export class App extends Application {
    // @dep() mongodb!: MongoDb;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(StorageService);
        return mesh;
    }

    override createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        mesh.service(HeartbeatMonitorRouter);
        return mesh;
    }

    override async beforeStart() {
        // await this.mongoDb.client.connect();
        // Add other code to execute on application startup
        await this.httpServer.startServer();
    }

    override async afterStop() {
        await this.httpServer.stopServer();
        // Add other finalization code
        // this.mongoDb.client.close();
    }

}
