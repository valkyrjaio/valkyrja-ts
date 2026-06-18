/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentContract } from './Component/Contract/ComponentContract.ts';
import type { ValueContract } from './Contract/ValueContract.ts';
import { ObjectFactory } from '../../../../Type/Object/Factory/ObjectFactory.ts';

export class Value implements ValueContract {
    protected components: Array<ComponentContract | string>;

    constructor(...components: Array<ComponentContract | string>) {
        this.components = this.filterComponents(...components);
    }

    static fromValue(value: string): Value {
        const deliminator = ';';
        const parts = value.includes(deliminator) ? value.split(deliminator) : [value];
        return new Value(...parts.map((p) => p.trim()));
    }

    getComponents(): Array<ComponentContract | string> {
        return this.components;
    }

    withComponents(...components: Array<ComponentContract | string>): this {
        const clone = ObjectFactory.clone(this);
        clone.components = this.filterComponents(...components);
        return clone;
    }

    withAddedComponents(...components: Array<ComponentContract | string>): this {
        const clone = this.withComponents(...components);
        clone.components = [...this.components, ...clone.components];
        return clone;
    }

    toString(): string {
        return this.components
            .map((c) => (typeof c === 'string' ? c : c.toString()).trim())
            .filter((s) => s !== '')
            .join('; ');
    }

    protected filterComponents(...components: Array<ComponentContract | string>): Array<ComponentContract | string> {
        return components.filter((c) => {
            const str = typeof c === 'string' ? c : c.toString();
            return str !== '';
        });
    }
}
