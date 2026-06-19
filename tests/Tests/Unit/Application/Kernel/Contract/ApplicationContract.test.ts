/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

describe('ApplicationContract', () => {
    it('instanceOf is true for an object exposing getContainer', () => {
        expect(ApplicationContract.instanceOf({ getContainer: (): null => null })).toBe(true);
    });

    it('instanceOf is false for non-applications', () => {
        expect(ApplicationContract.instanceOf(null)).toBe(false);
        expect(ApplicationContract.instanceOf({})).toBe(false);
    });
});
