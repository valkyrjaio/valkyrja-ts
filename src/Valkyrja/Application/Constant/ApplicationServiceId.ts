/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class ApplicationServiceId {
    static readonly ApplicationContract = 'Valkyrja.Application.Kernel.ApplicationContract' as const;
    static readonly ConfigContract = 'Valkyrja.Application.Data.ConfigContract' as const;
    static readonly CliConfigContract = 'Valkyrja.Application.Data.CliConfigContract' as const;
    static readonly HttpConfigContract = 'Valkyrja.Application.Data.HttpConfigContract' as const;
    static readonly Config = 'Valkyrja.Application.Data.Config' as const;
}
