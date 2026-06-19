/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { ApplicationInfo } from '../../../src/Valkyrja/Application/Constant/ApplicationInfo.ts';
import { Config } from '../../../src/Valkyrja/Application/Data/Config.ts';
import { Directory } from '../../../src/Valkyrja/Application/Directory/Directory.ts';
import { App } from '../../../src/Valkyrja/Application/Entry/Abstract/App.ts';
import { Container } from '../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ApplicationContract } from '../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

describe('Application (functional)', () => {
    let app: ApplicationContract;
    let config: Config;

    beforeEach(() => {
        App.directory(Directory.basePath);
        config = new Config();
        app = App.app(config);
    });

    it('container returns the application container', () => {
        expect(app.getContainer()).toBeInstanceOf(Container);
    });

    it('version returns the framework version', () => {
        expect(app.getVersion()).toBe(ApplicationInfo.VERSION);
    });

    it('environment returns the config environment', () => {
        expect(app.getEnvironment()).toBe(config.environment);
    });

    it('debug mode returns the config debug mode', () => {
        expect(app.getDebugMode()).toBe(config.debugMode);
    });
});
