/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface ComponentContract {
    getToken(): string;
    withToken(token: string): this;
    getText(): string;
    withText(text: string): this;
    toString(): string;
}
