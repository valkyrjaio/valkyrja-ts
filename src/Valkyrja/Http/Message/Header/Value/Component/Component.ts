/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentContract } from './Contract/ComponentContract.js';
import { ObjectFactory } from '../../../../../Type/Object/Factory/ObjectFactory.js';

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
        if (value.includes(deliminator)) {
            const [token, ...rest] = value.split(deliminator);
            return new Component(token?.trim() ?? '', rest.join(deliminator).trim());
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
