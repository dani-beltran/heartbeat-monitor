#!/usr/bin/env node
// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata';

import { App } from '../main/app.js';

const app = new App();

try {
    await app.start();
} catch (error) {
    app.logger.error('Failed to start', error as Error);
    process.exit(1);
}
