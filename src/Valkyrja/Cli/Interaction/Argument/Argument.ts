/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ArgumentContract } from './Contract/ArgumentContract.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class Argument implements ArgumentContract {
    constructor(protected value: string) {}

    getValue(): string {
        return this.value;
    }

    withValue(value: string): this {
        const clone = ObjectFactory.clone(this);
        clone.value = value;
        return clone;
    }
}
