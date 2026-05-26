/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class OptionName {
    static readonly HELP = 'help' as const;
    static readonly VERSION = 'version' as const;
    static readonly QUIET = 'quiet' as const;
    static readonly SILENT = 'silent' as const;
    static readonly NO_INTERACTION = 'no-interaction' as const;
    static readonly TOKEN = 'token' as const;
}
