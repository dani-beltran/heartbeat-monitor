/* eslint-disable import/no-extraneous-dependencies */
import 'reflect-metadata';

import axios from 'axios';
import { expect } from 'chai';

import { App } from '../main/app.js';

const testApp = new App();
const baseURL = 'http://localhost:8080';

describe('heartbeat-monitor', () => {
    before(async () => {
        await testApp.start();
        await testApp.mongodb.db.collection('app_groups').deleteMany({});
    });

    after(async () => {
        await testApp.mongodb.db.collection('app_groups').deleteMany({});
        await testApp.stop();
    });

    describe('POST /:group/:id', () => {
        it('should return 400 when app ID is not UUID format', () => {
            return axios
                .post(baseURL + '/test-group/test-id')
                .catch(err => {
                    expect(err.response.status).to.equal(400);
                });
        });

        it('should return 400 when meta is not the right format', () => {
            const uuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
            return axios
                .post(baseURL + `/test-group/${uuid}`, { meta: 'invalid' })
                .catch(err => {
                    expect(err.response.status).to.equal(400);
                });
        });

        it('should return 200 when meta is empty', async () => {
            const uuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
            const response = await axios.post(baseURL + `/test-group/${uuid}`);
            expect(response.status).to.eq(200);
            expect(response.data).to.include({ id: uuid, group: 'test-group' });
            expect(response.data).to.have.any.keys('createdAt', 'updatedAt');
        });

        it('should return 200', async () => {
            const uuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';
            const response = await axios.post(baseURL + `/test-group/${uuid}`, {
                meta: { foo: 'bar' },
            });
            expect(response.status).to.eq(200);
            expect(response.data).to.deep.include({
                id: uuid,
                group: 'test-group',
                meta: { foo: 'bar' },
            });
            expect(response.data).to.have.any.keys('createdAt', 'updatedAt');
        });

        it('should return 200 and update an existing app', async () => {
            const uuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13';
            // Create the app
            const originalApp = (await axios.post(baseURL + `/test-group/${uuid}`)).data;
            // Update the app
            const response = (await axios.post(baseURL + `/test-group/${uuid}`, {
                meta: { foo: 'bar' },
            }));
            expect(response.status).to.eq(200);
            const updatedApp = response.data;
            expect(originalApp.createdAt).to.eq(updatedApp.createdAt);
            expect(originalApp.updatedAt).to.not.eq(updatedApp.updatedAt);
            expect(updatedApp).to.deep.include({
                id: uuid,
                group: 'test-group',
                meta: { foo: 'bar' },
            });
        });
    });


    describe('DELETE /:group/:id', () => {
        let existingAppUuid: string;
        before(async () => {
            existingAppUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14';
            await testApp.mongodb.db.collection('app_groups').insertOne({
                id: existingAppUuid,
                group: 'test-group',
                createdAt: new Date(),
                updatedAt: new Date(),
                meta: { foo: 'bar' },
            });
        });

        it('should return 200 when the app is not registered', async () => {
            const uuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15';
            const response = await axios.delete(baseURL + `/test-group/${uuid}`);
            expect(response.status).to.eq(200);
        });

        it('should return 200 and unregister the app', async () => {
            const response = await axios.delete(baseURL + `/test-group/${existingAppUuid}`);
            expect(response.status).to.eq(200);
            const item = await testApp.mongodb.db.collection('app_groups').findOne({ id: existingAppUuid });
            expect(item).to.eq(null);
        });
    });

    describe('GET /', () => {
        it('should return 200', async () => {
            const response = await axios.get(baseURL + '/');
            expect(response.data).to.include({ status: 'List app groups' });
        });
    });

    describe('GET /:group', () => {
        it('should return 200', async () => {
            const response = await axios.get(baseURL + '/test-group');
            expect(response.data).to.include({ status: 'List apps within a group' });
        });
    });
});
