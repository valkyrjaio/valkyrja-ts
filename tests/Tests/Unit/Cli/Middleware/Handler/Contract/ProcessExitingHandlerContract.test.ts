/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ProcessExitingHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';

describe('ProcessExitingHandlerContract', () => {
    it('instanceOf is true for an object exposing processExiting', () => {
        expect(ProcessExitingHandlerContract.instanceOf({ processExiting: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ProcessExitingHandlerContract.instanceOf(null)).toBe(false);
        expect(ProcessExitingHandlerContract.instanceOf({})).toBe(false);
    });
});
