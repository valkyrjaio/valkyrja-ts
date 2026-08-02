/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export enum Style {
    BOLD = 1,
    UNDERSCORE = 4,
    BLINK = 5,
    INVERSE = 7,
    CONCEAL = 8,
}

export function styleDefault(style: Style): number {
    switch (style) {
        case Style.BOLD:
            return 22;
        case Style.UNDERSCORE:
            return 24;
        case Style.BLINK:
            return 25;
        case Style.INVERSE:
            return 27;
        case Style.CONCEAL:
            return 28;
    }
}
