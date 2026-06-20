/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export enum BackgroundColor {
    BLACK = 40,
    RED = 41,
    GREEN = 42,
    YELLOW = 43,
    BLUE = 44,
    MAGENTA = 45,
    CYAN = 46,
    WHITE = 47,
    DARK_GRAY = 100,
    LIGHT_RED = 101,
    LIGHT_GREEN = 102,
    LIGHT_YELLOW = 103,
    LIGHT_BLUE = 104,
    LIGHT_MAGENTA = 105,
    LIGHT_CYAN = 106,
    LIGHT_WHITE = 107,
}

export function backgroundColorDefault(): number {
    return 49;
}
