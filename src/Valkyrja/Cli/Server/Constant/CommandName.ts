/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class CliCommandName {
    static readonly HELP: string = 'help' as const;
    static readonly LIST: string = 'list' as const;
    static readonly LIST_BASH: string = 'list:bash' as const;
    static readonly VERSION: string = 'version' as const;
    static readonly DATA_GENERATE: string = 'data:generate' as const;
}
