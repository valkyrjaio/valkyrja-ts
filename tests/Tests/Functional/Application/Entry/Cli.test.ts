/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { CliConfig } from '../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { Directory } from '../../../../../src/Valkyrja/Application/Directory/Directory.ts';
import { Cli } from '../../../../../src/Valkyrja/Application/Entry/Cli.ts';
import { ContainerServiceId } from '../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';

// Note: the PHP functional Cli test also drives attribute-routed commands via Cli::run() with
// an Env and Exiter; TS has no attributes/Env/Exiter, so route-running is a documented gap.
// This covers booting a CLI application and the services bootstrapped into its container.
describe('Cli (functional)', () => {
    it('boots a CLI application and registers the core services', () => {
        Cli.directory(Directory.basePath);

        const app = Cli.app(new CliConfig());
        const container = app.getContainer();

        expect(container).toBeInstanceOf(Container);
        expect(container.has(ApplicationServiceId.CliConfigContract)).toBe(true);
        expect(container.has(ApplicationServiceId.Config)).toBe(true);
        expect(container.has(ContainerServiceId.Contract)).toBe(true);
        expect(container.has(ApplicationServiceId.ApplicationContract)).toBe(true);
        expect(app.getEnvironment()).toBe('production');
    });
});
