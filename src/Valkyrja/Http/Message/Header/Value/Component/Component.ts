/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ComponentContract } from './Contract/ComponentContract.ts';
import { ObjectFactory } from '../../../../../Type/Object/Factory/ObjectFactory.ts';

export class Component implements ComponentContract {
    constructor(
        protected token: string,
        protected text: string = '',
    ) {
        this.token = token.trim();
        this.text = text.trim();
    }

    static fromValue(value: string): Component {
        const deliminator = '=';
        const index = value.indexOf(deliminator);
        if (index !== -1) {
            return new Component(value.slice(0, index).trim(), value.slice(index + 1).trim());
        }
        return new Component(value.trim());
    }

    getToken(): string {
        return this.token;
    }

    withToken(token: string): this {
        const clone = ObjectFactory.clone(this);
        clone.token = token.trim();
        return clone;
    }

    getText(): string {
        return this.text;
    }

    withText(text: string): this {
        const clone = ObjectFactory.clone(this);
        clone.text = text.trim();
        return clone;
    }

    toString(): string {
        return this.token !== '' && this.text !== '' ? `${this.token}=${this.text}` : this.token;
    }
}
