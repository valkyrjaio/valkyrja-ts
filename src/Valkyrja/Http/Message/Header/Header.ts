import type { HeaderContract } from './Contract/HeaderContract.js';
import type { ValueContract } from './Value/Contract/ValueContract.js';
import { HeaderFactory } from './Factory/HeaderFactory.js';

export class Header implements HeaderContract {
    protected name: string;
    protected normalizedName: string;
    protected values: Array<ValueContract | string> = [];

    constructor(name: string, ...values: Array<ValueContract | string>) {
        HeaderFactory.assertValidName(name);
        this.name           = name;
        this.normalizedName = name.toLowerCase();
        this.updateValues(...values);
    }

    static fromValue(value: string): Header {
        const deliminator = ':';
        let name          = value;
        let valuesStr     = '';
        let parts: Array<ValueContract | string>;

        if (value.includes(deliminator)) {
            const idx = value.indexOf(deliminator);
            name      = value.slice(0, idx);
            valuesStr = value.slice(idx + 1);
        }

        const valueDeliminator = ',';
        parts = valuesStr.includes(valueDeliminator)
            ? valuesStr.split(valueDeliminator).map((v) => v.trim())
            : [valuesStr.trim()];

        return new Header(name.trim(), ...parts);
    }

    getName(): string { return this.name; }
    getNormalizedName(): string { return this.normalizedName; }

    withName(name: string): this {
        const clone              = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        HeaderFactory.assertValidName(name);
        clone.name               = name;
        clone.normalizedName     = name.toLowerCase();
        return clone;
    }

    getValues(): Array<ValueContract | string> { return this.values; }

    withValues(...values: Array<ValueContract | string>): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.values = this.filterValues(...values);
        return clone;
    }

    withAddedValues(...values: Array<ValueContract | string>): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.values = [...this.values, ...this.filterValues(...values)];
        return clone;
    }

    getHeaderLine(): string {
        return this.name + ': ' + this.valuesToString();
    }

    toString(): string {
        return this.getHeaderLine();
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
