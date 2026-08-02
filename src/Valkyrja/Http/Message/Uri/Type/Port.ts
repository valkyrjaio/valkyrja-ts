/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpUriInvalidPortException } from '../Throwable/Exception/HttpUriInvalidPortException.ts';

export class Port {
    protected subject: number;

    constructor(subject: number) {
        if (subject >= 1 && subject <= 65535) {
            this.subject = subject;
            return;
        }

        throw new HttpUriInvalidPortException('Invalid port argument passed.');
    }

    static fromValue(value: unknown): Port {
        if (typeof value !== 'number') {
            throw new HttpUriInvalidPortException(`Int expected value of type \`${typeof value}\` provided`);
        }

        return new Port(value);
    }

    asFlatValue(): number {
        return this.subject;
    }

    asValue(): number {
        return this.subject;
    }
}
