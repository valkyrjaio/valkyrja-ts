/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteCollectionContract } from '../../../../../src/Valkyrja/Cli/Routing/Collection/Contract/RouteCollectionContract.ts';
import { RouteCollectorContract } from '../../../../../src/Valkyrja/Cli/Routing/Collector/Contract/RouteCollectorContract.ts';
import { ArgumentParameterContract } from '../../../../../src/Valkyrja/Cli/Routing/Data/Contract/ArgumentParameterContract.ts';
import { CliRoutingConfigContract } from '../../../../../src/Valkyrja/Cli/Routing/Data/Contract/CliRoutingConfigContract.ts';
import { OptionParameterContract } from '../../../../../src/Valkyrja/Cli/Routing/Data/Contract/OptionParameterContract.ts';
import { ParameterContract } from '../../../../../src/Valkyrja/Cli/Routing/Data/Contract/ParameterContract.ts';
import { RouteContract } from '../../../../../src/Valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';
import { RouterContract } from '../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Contract/RouterContract.ts';
import { CliRouteProviderContract } from '../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';

const noop = (): void => {};

describe('Cli Routing contracts', () => {
    it.each([
        ['RouteCollectionContract', RouteCollectionContract, { getData: noop }],
        ['RouteCollectorContract', RouteCollectorContract, { getRoutes: noop }],
        ['ArgumentParameterContract', ArgumentParameterContract, { getMode: noop }],
        ['CliRoutingConfigContract', CliRoutingConfigContract, { dataClassName: 'X' }],
        ['OptionParameterContract', OptionParameterContract, { getShortNames: noop }],
        ['ParameterContract', ParameterContract, { getName: noop }],
        ['RouteContract', RouteContract, { getName: noop }],
        ['RouterContract', RouterContract, { dispatch: noop }],
        ['CliRouteProviderContract', CliRouteProviderContract, { getRoutes: noop }],
    ])('%s.instanceOf distinguishes matching objects', (_name, contract, matching) => {
        expect(contract.instanceOf(matching)).toBe(true);
        expect(contract.instanceOf(null)).toBe(false);
        expect(contract.instanceOf({})).toBe(false);
    });
});
