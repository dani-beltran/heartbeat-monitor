import { Delete, Get, Post, Router } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { StorageService } from '../services/storage-service.js';

/**
 * @title Heartbeat Monitor Router
 * @description This router provide the endpoints responsible for monitoring
 * the heartbeat of client apps. The app instances will be grouped.
 */
export class HeartbeatMonitorRouter extends Router {
    @dep() storage!: StorageService;

    @Get({
        path: '/',
        responses: {
            200: {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' }
                    }
                }
            }
        }
    })
    async listAppGroups() {
        return { status: 'List app groups' };
    }

    @Get({
        path: '/{group}',
        responses: {
            200: {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' }
                    }
                }
            }
        }
    })
    async listAppInstances() {
        return { status: 'List apps within a group' };
    }

    @Post({
        path: '/{group}/{id}',
        responses: {
            200: {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' }
                    }
                }
            }
        }
    })
    async registerApp() {
        return { status: 'Register an app instance in a group' };
    }

    @Delete({
        path: '/{group}/{id}',
        responses: {
            200: {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' }
                    }
                }
            }
        }
    })
    async deleteApp() {
        return { status: 'Deregister an app instance in a group' };
    }

}
