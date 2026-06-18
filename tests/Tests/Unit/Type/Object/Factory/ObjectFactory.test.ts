/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ObjectFactory } from '../../../../../../src/Valkyrja/Type/Object/Factory/ObjectFactory.ts';

class Example {
    constructor(public value: number = 0) {}

    double(): number {
        return this.value * 2;
    }
}

describe('ObjectFactory', () => {
    it('clones own enumerable properties', () => {
        const original = new Example(5);
        const clone = ObjectFactory.clone(original);

        expect(clone).not.toBe(original);
        expect(clone.value).toBe(5);
    });

    it('preserves the prototype of the cloned object', () => {
        const original = new Example(5);
        const clone = ObjectFactory.clone(original);

        expect(clone).toBeInstanceOf(Example);
        expect(clone.double()).toBe(10);
    });

    it('does not mutate the original when the clone changes', () => {
        const original = new Example(5);
        const clone = ObjectFactory.clone(original);

        clone.value = 99;

        expect(original.value).toBe(5);
        expect(clone.value).toBe(99);
    });
});
