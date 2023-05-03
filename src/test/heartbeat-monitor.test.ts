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
    });

    after(async () => {
        await testApp.stop();
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

    describe('POST /:group/:id', () => {
        it('should return 200', async () => {
            const response = await axios.post(baseURL + '/test-group/test-id');
            expect(response.data).to.include({ status: 'Register an app instance in a group' });
        });
    });

    describe('DELETE /:group/:id', () => {
        it('should return 200', async () => {
            const response = await axios.delete(baseURL + '/test-group/test-id');
            expect(response.data).to.include({ status: 'Deregister an app instance in a group' });
        });
    });

});
