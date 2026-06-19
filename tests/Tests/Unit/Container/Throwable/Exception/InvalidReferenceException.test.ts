/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ContainerInvalidReferenceException } from '../../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidReferenceException.ts';

describe('ContainerInvalidReferenceException', () => {
    it('builds the not-found message for the given id', () => {
        const id = 'SomeServiceId';

        const exception = new ContainerInvalidReferenceException(id);

        expect(exception.message).toBe(`Service with \`${id}\` not found`);
    });
});
