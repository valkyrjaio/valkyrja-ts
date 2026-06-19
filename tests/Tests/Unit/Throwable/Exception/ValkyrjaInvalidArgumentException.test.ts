/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ContainerInvalidReferenceException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidReferenceException.ts';

describe('ValkyrjaInvalidArgumentException', () => {
    it('produces a stable hex trace code for a concrete subclass', () => {
        const exception = new ContainerInvalidReferenceException('SomeServiceId');

        const traceCode = exception.getTraceCode();

        expect(traceCode).toMatch(/^[0-9a-f]{32}$/);
        expect(exception.getTraceCode()).toBe(traceCode);
    });
});
