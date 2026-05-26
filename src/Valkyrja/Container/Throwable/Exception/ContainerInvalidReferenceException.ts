/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerInvalidArgumentException } from './Abstract/ContainerInvalidArgumentException.js';

export class ContainerInvalidReferenceException extends ContainerInvalidArgumentException {
    constructor(id: string, options?: ErrorOptions) {
        super(`Service with \`${id}\` not found`, options);
        this.name = 'ContainerInvalidReferenceException';
    }
}
