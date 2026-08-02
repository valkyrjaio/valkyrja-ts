/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeaderContract } from './Contract/HeaderContract.ts';
import type { ValueContract } from './Value/Contract/ValueContract.ts';
import { HeaderFactory } from './Factory/HeaderFactory.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class Header implements HeaderContract {
    protected name: string;
    protected normalizedName: string;
    protected values: Array<ValueContract | string> = [];

    constructor(name: string, ...values: Array<ValueContract | string>) {
        HeaderFactory.assertValidName(name);
        this.name = name;
        this.normalizedName = name.toLowerCase();
        this.updateValues(...values);
    }

    static fromValue(value: string): Header {
        const deliminator = ':';
        let name = value;
        let valuesStr = '';
        if (value.includes(deliminator)) {
            const idx = value.indexOf(deliminator);
            name = value.slice(0, idx);
            valuesStr = value.slice(idx + 1);
        }

        const valueDeliminator = ',';
        const parts: Array<ValueContract | string> = valuesStr.includes(valueDeliminator)
            ? valuesStr.split(valueDeliminator).map((v) => v.trim())
            : [valuesStr.trim()];

        return new Header(name.trim(), ...parts);
    }

    getName(): string {
        return this.name;
    }
    getNormalizedName(): string {
        return this.normalizedName;
    }

    withName(name: string): this {
        const clone = ObjectFactory.clone(this);
        HeaderFactory.assertValidName(name);
        clone.name = name;
        clone.normalizedName = name.toLowerCase();
        return clone;
    }

    getValues(): Array<ValueContract | string> {
        return this.values;
    }

    withValues(...values: Array<ValueContract | string>): this {
        const clone = ObjectFactory.clone(this);
        clone.values = this.filterValues(...values);
        return clone;
    }

    withAddedValues(...values: Array<ValueContract | string>): this {
        const clone = ObjectFactory.clone(this);
        clone.values = [...this.values, ...this.filterValues(...values)];
        return clone;
    }

    getHeaderLine(): string {
        return this.valuesToString();
    }

    toString(): string {
        const values = this.valuesToString();

        if (values === '') {
            return '';
        }

        return this.name + ': ' + values;
    }

    protected updateValues(...values: Array<ValueContract | string>): void {
        this.values = this.filterValues(...values);
    }

    protected valuesToString(): string {
        return this.values
            .map((v) => (typeof v === 'string' ? v : v.toString()).trim())
            .filter((s) => s !== '')
            .join(', ');
    }

    protected filterValues(...values: Array<ValueContract | string>): Array<ValueContract | string> {
        return values.map((v) => {
            if (typeof v === 'string') {
                v = HeaderFactory.filterValue(v);
                HeaderFactory.assertValidValue(v);
            }
            return v;
        });
    }
}
