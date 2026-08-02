/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Port } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Type/Port.ts';
import { HttpUriInvalidPortException } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Throwable/Exception/HttpUriInvalidPortException.ts';

describe('Port', () => {
    it('accepts a valid port and exposes its value', () => {
        const port = new Port(8080);

        expect(port.asValue()).toBe(8080);
        expect(port.asFlatValue()).toBe(8080);
    });

    it('rejects out-of-range ports', () => {
        expect(() => new Port(0)).toThrow(HttpUriInvalidPortException);
        expect(() => new Port(70000)).toThrow(HttpUriInvalidPortException);
    });

    it('creates a port from a numeric value', () => {
        expect(Port.fromValue(443).asValue()).toBe(443);
    });

    it('rejects non-numeric values', () => {
        expect(() => Port.fromValue('80')).toThrow(HttpUriInvalidPortException);
    });
});
