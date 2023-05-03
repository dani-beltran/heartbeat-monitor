import {
    BodyParam,
    Delete,
    Get,
    PathParam,
    Post,
    QueryParam,
    Router,
} from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { AppGroupRepo } from '../repositories/app-group.js';
import { StorageService } from '../services/storage-service.js';

const appInstanceSchema = {
    id: { type: 'string' },
    group: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    meta: { type: 'object' },
};

const groupSchema = {
    group: { type: 'string' },
    instances: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
};

/**
 * @title Heartbeat Monitor Router
 * @description This router provide the endpoints responsible for monitoring
 * the heartbeat of client apps. The app instances will be grouped.
 */
export class HeartbeatMonitorRouter extends Router {
  @dep() storage!: StorageService;
  @dep() appGroup!: AppGroupRepo;

  /**
   * This endpoint returns the list of app groups. The number of app instances of each
   * group will only consider the active app instances (the ones that have sent a heartbeat recently).
   * @param limit The maximum number of app groups to return.
   */
  @Get({
      path: '/',
      summary:
      'List of app groups. The number of app instances of each group will only consider the active app instances (the ones that have sent a heartbeat recently).',
      responses: {
          200: {
              schema: {
                  type: 'array',
                  items: {
                      type: 'object',
                      properties: groupSchema,
                  },
              },
          },
      },
  })
  async listAppGroups(
    @QueryParam('limit', { schema: { type: 'number', default: 1000 } })
    limit: number
  ) {
      return this.appGroup.list(limit);
  }

  /**
   * This endpoint returns the list of active app instances within a group.
   */
  @Get({
      path: '/{group}',
      summary: 'List of active app instances within a group, being actives the ones that have sent a heartbeat recently',
      responses: {
          200: {
              schema: {
                  type: 'array',
                  items: {
                      type: 'object',
                      properties: appInstanceSchema,
                  },
              },
          },
      },
  })
  async listAppInstances(
    @PathParam('group', { schema: { type: 'string' } }) group: string,
    @QueryParam('limit', { schema: { type: 'number', default: 1000 } })
    limit: number
  ) {
      return this.appGroup.get(group, limit);
  }

  /**
   * This endpoint registers an app instance in a group.
   * If the app instance is already registered, it will be updated.
   * @param group The group name.
   * @param id The app instance id.
   * @param meta The meta data to be stored with the app instance.
   */
  @Post({
      path: '/{group}/{id}',
      summary: 'Register an app instance in a group. If the app instance is already registered, it will be updated.',
      responses: {
          200: {
              schema: {
                  type: 'object',
                  properties: appInstanceSchema,
              },
          },
      },
  })
  async registerApp(
    @PathParam('group', { schema: { type: 'string' } }) group: string,
    @PathParam('id', { schema: { type: 'string', format: 'uuid' } }) id: string,
    @BodyParam('meta', { schema: { type: 'object', default: {} } })
    meta: Record<string, any>
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
   * @param group The group name.
   * @param id The app instance id.
   */
  @Delete({
      path: '/{group}/{id}',
      summary: 'Unregister an app instance from a group.',
      responses: {
          200: {
              schema: {},
          },
      },
  })
  async deleteApp(
    @PathParam('group', { schema: { type: 'string' } }) group: string,
    @PathParam('id', { schema: { type: 'string', format: 'uuid' } }) id: string
  ) {
      await this.appGroup.unregister(id, group);
  }
}
