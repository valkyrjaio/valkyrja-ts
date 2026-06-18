/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { HttpConfig } from '../../../../../src/Valkyrja/Application/Data/HttpConfig.ts';
import { Directory } from '../../../../../src/Valkyrja/Application/Directory/Directory.ts';
import { Http } from '../../../../../src/Valkyrja/Application/Entry/Http.ts';
import { ContainerServiceId } from '../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';

// Note: the PHP functional Http test also drives attribute-routed requests via Http::run() with an
// Env; TS has no attributes/Env, so request-running is a documented gap. This covers booting an HTTP
// application and the services bootstrapped into its container.
describe('Http (functional)', () => {
    it('boots an HTTP application and registers the core services', () => {
        Http.directory(Directory.basePath);

        const app = Http.app(new HttpConfig());
        const container = app.getContainer();

        expect(container).toBeInstanceOf(Container);
        expect(container.has(ApplicationServiceId.HttpConfigContract)).toBe(true);
        expect(container.has(ApplicationServiceId.CliConfigContract)).toBe(false);
        expect(container.has(ContainerServiceId.Contract)).toBe(true);
        expect(container.has(ApplicationServiceId.ApplicationContract)).toBe(true);
    });
});
