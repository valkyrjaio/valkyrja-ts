/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class OptionShortName {
    static readonly HELP = 'h' as const;
    static readonly VERSION = 'v' as const;
    static readonly QUIET = 'q' as const;
    static readonly SILENT = 's' as const;
    static readonly NO_INTERACTION = 'N' as const;
    static readonly TOKEN = 't' as const;
}
