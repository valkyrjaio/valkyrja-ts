/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { CliInteractionServiceId } from '../../../../../../src/Valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { CliInteractionServiceProvider } from '../../../../../../src/Valkyrja/Cli/Interaction/Provider/CliInteractionServiceProvider.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { CliInteractionConfigContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/Contract/CliInteractionConfigContract.ts';

describe('CliInteractionServiceProvider', () => {
    it('publishes the config and output factory ids', () => {
        const publishers = new CliInteractionServiceProvider().publishers();

        expect(CliInteractionServiceId.CliInteractionConfigContract in publishers).toBe(true);
        expect(CliInteractionServiceId.OutputFactoryContract in publishers).toBe(true);
    });

    it('publishConfig reuses the application config when it is a cli interaction config', () => {
        const container = new Container();
        const config = new CliInteractionConfig(true, false, false);
        container.setSingleton(ApplicationServiceId.ConfigContract, config);

        CliInteractionServiceProvider.publishConfig(container);

        expect(container.getSingleton(CliInteractionServiceId.CliInteractionConfigContract)).toBe(config);
    });

    it('publishConfig falls back to a default config otherwise', () => {
        const container = new Container();
        container.setSingleton(ApplicationServiceId.ConfigContract, { namespace: 'App' });

        CliInteractionServiceProvider.publishConfig(container);

        expect(container.getSingleton(CliInteractionServiceId.CliInteractionConfigContract)).toBeInstanceOf(
            CliInteractionConfig,
        );
    });

    it('publishOutputFactory builds an output factory from the published config', () => {
        const container = new Container();
        const config = new CliInteractionConfig();
        container.setSingleton<CliInteractionConfigContract>(
            CliInteractionServiceId.CliInteractionConfigContract,
            config,
        );

        CliInteractionServiceProvider.publishOutputFactory(container);

        expect(container.getSingleton(CliInteractionServiceId.OutputFactoryContract)).toBeInstanceOf(OutputFactory);
    });
});
