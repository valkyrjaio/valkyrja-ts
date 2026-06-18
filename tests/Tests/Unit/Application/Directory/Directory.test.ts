/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Directory } from '../../../../../src/Valkyrja/Application/Directory/Directory.ts';

const BASE_PATH = '/base/path';
const SUB_PATH = '/sub/path';

describe('Directory', () => {
    let originalBasePath: string;

    beforeEach(() => {
        originalBasePath = Directory.basePath;
        Directory.basePath = BASE_PATH;
    });

    afterEach(() => {
        Directory.basePath = originalBasePath;
    });

    it('normalizes paths', () => {
        expect(Directory.path()).toBe('');
        expect(Directory.path('')).toBe('');
        expect(Directory.path('sub')).toBe('/sub');
        expect(Directory.path('/sub')).toBe('/sub');
    });

    it('resolves the base directory', () => {
        expect(Directory.baseDirectory()).toBe(BASE_PATH);
        expect(Directory.baseDirectory(SUB_PATH)).toBe(`${BASE_PATH}${SUB_PATH}`);
    });

    it('resolves first-level directories relative to the base', () => {
        expect(Directory.appDirectory()).toBe(`${BASE_PATH}/app`);
        expect(Directory.appDirectory(SUB_PATH)).toBe(`${BASE_PATH}/app${SUB_PATH}`);
        expect(Directory.dataDirectory()).toBe(`${BASE_PATH}/data`);
        expect(Directory.envDirectory()).toBe(`${BASE_PATH}/env`);
        expect(Directory.publicDirectory()).toBe(`${BASE_PATH}/public`);
        expect(Directory.resourcesDirectory()).toBe(`${BASE_PATH}/resources`);
        expect(Directory.srcDirectory()).toBe(`${BASE_PATH}/src`);
        expect(Directory.storageDirectory()).toBe(`${BASE_PATH}/storage`);
        expect(Directory.testsDirectory()).toBe(`${BASE_PATH}/tests`);
        expect(Directory.vendorDirectory()).toBe(`${BASE_PATH}/node_modules`);
    });

    it('resolves nested storage directories', () => {
        expect(Directory.frameworkStorageDirectory()).toBe(`${BASE_PATH}/storage/framework`);
        expect(Directory.logsStorageDirectory()).toBe(`${BASE_PATH}/storage/logs`);
        expect(Directory.frameworkStorageCacheDirectory()).toBe(`${BASE_PATH}/storage/framework/cache`);
        expect(Directory.frameworkStorageCacheDirectory(SUB_PATH)).toBe(
            `${BASE_PATH}/storage/framework/cache${SUB_PATH}`,
        );
    });
});
