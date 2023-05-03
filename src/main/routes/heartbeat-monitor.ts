import { BodyParam, Delete, Get, PathParam, Post, QueryParam, Router } from '@ubio/framework';
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
  async listAppGroups(
    @QueryParam('limit', { schema: { type: 'number', default: 1000 } }) limit: number
  ) {
      return this.appGroup.list(limit);
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
   * If the app instance is already registered, it will be updated.
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

  /**
   * This endpoint unregisters an app instance from a group. If the app is not
   * registered, it will return a 200 status anyway.
   */
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
  async deleteApp(
    @PathParam('group', { schema: { type: 'string' } }) group: string,
    @PathParam('id', { schema: { type: 'string', format: 'uuid' } }) id: string,
  ) {
      await this.appGroup.unregister(id, group);
  }
}
