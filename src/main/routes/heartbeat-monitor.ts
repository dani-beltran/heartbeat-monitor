import { BodyParam, Delete, Get, PathParam, Post, Router } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { AppGroupRepo } from '../repositories/app-group.js';
import { StorageService } from '../services/storage-service.js';

/**
 * @title Heartbeat Monitor Router
 * @description This router provide the endpoints responsible for monitoring
 * the heartbeat of client apps. The app instances will be grouped.
 */
export class HeartbeatMonitorRouter extends Router {
  @dep() storage!: StorageService;
  @dep() appGroup!: AppGroupRepo;

  @Get({
      path: '/',
      responses: {
          200: {
              schema: {
                  type: 'object',
                  properties: {
                      status: { type: 'string' },
                  },
              },
          },
      },
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
                      status: { type: 'string' },
                  },
              },
          },
      },
  })
  async listAppInstances() {
      return { status: 'List apps within a group' };
  }

  /**
   * This endpoint registers an app instance in a group.
   * Meta data can be provided in the request body.
   */
  @Post({
      path: '/{group}/{id}',
      responses: {
          200: {
              schema: {
                  type: 'object',
                  properties: {
                      status: { type: 'string' },
                  },
              },
          },
      },
  })
  async registerApp(
    @PathParam('group', { schema: { type: 'string' } }) group: string,
    @PathParam('id', { schema: { type: 'string', format: 'uuid' } }) id: string,
    @BodyParam('meta', { schema: { type: 'object', default: {} } }) meta: Record<string, any>
  ) {
      const item = await this.appGroup.register({
          group,
          id,
          meta: meta || {},
      });
      return item;
  }

  @Delete({
      path: '/{group}/{id}',
      responses: {
          200: {
              schema: {
                  type: 'object',
                  properties: {
                      status: { type: 'string' },
                  },
              },
          },
      },
  })
  async deleteApp() {
      return { status: 'Deregister an app instance in a group' };
  }
}
