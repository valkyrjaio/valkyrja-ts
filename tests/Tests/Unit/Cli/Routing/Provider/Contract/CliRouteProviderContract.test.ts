/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliRouteProviderContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';

describe('CliRouteProviderContract', () => {
    it('instanceOf is true for an object exposing getRoutes', () => {
        expect(CliRouteProviderContract.instanceOf({ getRoutes: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliRouteProviderContract.instanceOf(null)).toBe(false);
        expect(CliRouteProviderContract.instanceOf({})).toBe(false);
    });
});
